"""
watch-youtube Backend — Pipeline Servisi
watch_youtube Python paketini sarmalar ve job store ile entegre eder.
Wraps the watch_youtube Python package and integrates with job store.
"""

from __future__ import annotations

import logging
import time
from pathlib import Path

from ..core.config import get_settings
from ..core.job_store import JobStore
from ..models.schemas import (
    AnalyzeRequest,
    JobResult,
    JobStatus,
)

logger = logging.getLogger(__name__)


class PipelineService:
    """
    watch_youtube pipeline'ını çalıştıran servis.
    Adım adım ilerlemeyi job_store'a yazar.
    Service that runs the watch_youtube pipeline.
    Writes step-by-step progress to job_store.
    """

    def __init__(self, job_store: JobStore) -> None:
        self._store = job_store
        self._settings = get_settings()

    def run(self, job_id: str, request: AnalyzeRequest) -> None:
        """
        Pipeline'ı senkron olarak çalıştır.
        FastAPI BackgroundTasks ile ayrı thread'de çağrılır.
        Run pipeline synchronously.
        Called in a separate thread via FastAPI BackgroundTasks.
        """
        logger.info(f"[{job_id}] Pipeline başlatıldı: {request.url}")
        self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=0)
        t_start = time.time()

        try:
            result = self._run_pipeline(job_id, request, t_start)
            self._store.set_result(job_id, result)
            logger.info(f"[{job_id}] Pipeline tamamlandı: {time.time() - t_start:.1f}s")

        except Exception as exc:
            logger.exception(f"[{job_id}] Pipeline hatası: {exc}")
            self._store.set_error(job_id, str(exc))

    def _run_pipeline(
        self,
        job_id: str,
        request: AnalyzeRequest,
        t_start: float,
    ) -> JobResult:
        """
        Gerçek pipeline adımlarını çalıştır.
        Run the actual pipeline steps.
        """
        import tempfile
        import shutil
        from pathlib import Path

        # watch_youtube paketini import et / Import watch_youtube package
        # Proje kökünden import ediyoruz / Importing from project root
        import sys
        project_root = self._settings.project_root
        if str(project_root) not in sys.path:
            sys.path.insert(0, str(project_root))

        from watch_youtube.downloader import download_video
        from watch_youtube.analyzer import extract_smart_timestamps, update_keyword_store
        from watch_youtube.extractor import check_ffmpeg, get_video_duration, extract_frames
        from watch_youtube.compiler import compile_storyboards

        temp_dir = Path(tempfile.mkdtemp(prefix="wy_api_"))

        try:
            # ---- Adım 1: İndir / Step 1: Download ----
            self._store.update_step(job_id, 1, JobStatus.RUNNING)
            self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=5)

            check_ffmpeg()
            result = download_video(
                request.url,
                temp_dir,
                request.groq_api_key or self._settings.groq_api_key,
            )

            self._store.set_video_id(job_id, result.video_id)
            self._store.update_step(
                job_id, 1, JobStatus.DONE,
                description=f"{result.transcript_source} ({len(result.transcript_entries)} giriş)",
                elapsed_sec=time.time() - t_start,
            )
            self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=25)

            # ---- Adım 2: NLP / Step 2: NLP ----
            self._store.update_step(job_id, 2, JobStatus.RUNNING)
            t2 = time.time()

            timestamps = extract_smart_timestamps(
                result.transcript_entries,
                silence_threshold=request.silence_gap,
                max_timestamps=request.max_frames,
            )
            duration = get_video_duration(result.video_path)
            fixed_count = max(1, int((duration or 1800) / 30))

            self._store.update_step(
                job_id, 2, JobStatus.DONE,
                description=f"{len(timestamps)} akıllı timestamp (vs ~{fixed_count} sabit)",
                elapsed_sec=time.time() - t2,
            )
            self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=50)

            # ---- Adım 3: Frame Çıkarma / Step 3: Extract frames ----
            self._store.update_step(job_id, 3, JobStatus.RUNNING)
            t3 = time.time()

            frames = extract_frames(result.video_path, timestamps, temp_dir)

            self._store.update_step(
                job_id, 3, JobStatus.DONE,
                description=f"{len(frames)} frame çıkarıldı",
                elapsed_sec=time.time() - t3,
            )
            self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=75)

            # ---- Adım 4: Storyboard / Step 4: Compile ----
            self._store.update_step(job_id, 4, JobStatus.RUNNING)
            t4 = time.time()

            output_dir = self._settings.output_dir / result.video_id
            output_dir.mkdir(parents=True, exist_ok=True)

            boards = compile_storyboards(frames, output_dir, jpeg_quality=request.jpeg_quality)

            learned = 0
            if not request.no_learn and result.transcript_entries and timestamps:
                learned = update_keyword_store(result.transcript_entries, timestamps)

            self._store.update_step(
                job_id, 4, JobStatus.DONE,
                description=f"{len(boards)} storyboard grid oluşturuldu",
                elapsed_sec=time.time() - t4,
            )
            self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=99)

            # ---- Sonuç / Result ----
            return JobResult(
                video_id=result.video_id,
                transcript_source=result.transcript_source,
                entry_count=len(result.transcript_entries),
                smart_timestamps=len(timestamps),
                fixed_count=fixed_count,
                frame_count=len(frames),
                board_count=len(boards),
                storyboard_paths=[str(b.relative_to(self._settings.output_dir)) for b in boards],
                wiki_pages=[],
                elapsed_sec=time.time() - t_start,
                learned_keywords=learned,
            )

        finally:
            # Geçici dosyaları temizle / Clean up temp files
            shutil.rmtree(temp_dir, ignore_errors=True)
