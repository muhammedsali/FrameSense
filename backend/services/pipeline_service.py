"""
FrameSense Backend — Pipeline Servisi
framesense Python paketini sarmalar ve job store ile entegre eder.
Wraps the framesense Python package and integrates with job store.
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
    framesense pipeline'ını çalıştıran servis.
    Adım adım ilerlemeyi job_store'a yazar.
    Service that runs the framesense pipeline.
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
            error_msg = f"Hata: {str(exc)}"
            logger.error(f"[{job_id}] {error_msg}")
            # Hatayı adım adım göster / Show error in steps
            for i in range(1, 5):
                step = next((s for s in self._store.get(job_id).steps if s.step == i), None)
                if step and step.status == JobStatus.RUNNING:
                    self._store.update_step(job_id, i, JobStatus.ERROR, description=error_msg)
            self._store.set_error(job_id, error_msg)

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

        # framesense paketini import et / Import framesense package
        # Proje kökünden import ediyoruz / Importing from project root
        import sys
        project_root = self._settings.project_root
        if str(project_root) not in sys.path:
            sys.path.insert(0, str(project_root))

        from framesense.downloader import download_video
        from framesense.analyzer import extract_smart_timestamps, update_keyword_store
        from framesense.extractor import check_ffmpeg, get_video_duration, extract_frames
        from framesense.compiler import compile_storyboards
        from framesense.wiki_generator import generate_wiki_page

        temp_dir = Path(tempfile.mkdtemp(prefix="wy_api_"))

        try:
            # ---- Adım 1: İndir / Step 1: Download ----
            self._store.update_step(job_id, 1, JobStatus.RUNNING)
            self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=5)

            try:
                check_ffmpeg()
            except Exception:
                raise RuntimeError("FFmpeg sistemde bulunamadı! Lütfen FFmpeg'i kurun ve PATH'e ekleyin.")

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
                description=f"{len(timestamps)} akıllı timestamp tespit edildi.",
                elapsed_sec=time.time() - t2,
            )
            self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=50)

            # ---- Adım 3: Frame Çıkarma / Step 3: Extract frames ----
            self._store.update_step(job_id, 3, JobStatus.RUNNING)
            t3 = time.time()

            frames = extract_frames(result.video_path, timestamps, temp_dir)

            self._store.update_step(
                job_id, 3, JobStatus.DONE,
                description=f"{len(frames)} kilit kare çıkarıldı.",
                elapsed_sec=time.time() - t3,
            )
            self._store.update_status(job_id, JobStatus.RUNNING, progress_pct=75)

            # ---- Adım 4: Storyboard + Wiki / Step 4: Compile ----
            self._store.update_step(job_id, 4, JobStatus.RUNNING)
            t4 = time.time()

            output_dir = self._settings.output_dir / result.video_id
            output_dir.mkdir(parents=True, exist_ok=True)

            boards = compile_storyboards(frames, output_dir, jpeg_quality=request.jpeg_quality)
            
            # Wiki sayfası üret / Generate Wiki
            wiki_file = generate_wiki_page(
                result.video_id, 
                f"Video Analizi: {result.video_id}", 
                result.transcript_entries, 
                frames, 
                self._settings.wiki_dir
            )

            learned = 0
            if not request.no_learn and result.transcript_entries and timestamps:
                learned = update_keyword_store(result.transcript_entries, timestamps)

            self._store.update_step(
                job_id, 4, JobStatus.DONE,
                description=f"Storyboard ve Wiki sayfası ({wiki_file.name}) oluşturuldu.",
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
                wiki_pages=[wiki_file.name],
                elapsed_sec=time.time() - t_start,
                learned_keywords=learned,
            )

        finally:
            # Geçici dosyaları temizle / Clean up temp files
            shutil.rmtree(temp_dir, ignore_errors=True)
