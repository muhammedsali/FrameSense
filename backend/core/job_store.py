"""
FrameSense Backend — İş Deposu
In-memory iş kuyruğu — thread-safe job tracking
In-memory job queue — thread-safe job tracking
"""

from __future__ import annotations

import uuid
from datetime import datetime
from threading import Lock
from typing import Callable

from ..models.schemas import JobStatus, JobStatusResponse, StepInfo


# ---------------------------------------------------------------------------
# İş Deposu / Job Store
# ---------------------------------------------------------------------------

class JobStore:
    """
    Thread-safe in-memory iş deposu.
    Gerçek production'da Redis veya PostgreSQL ile değiştirilebilir.
    Thread-safe in-memory job store.
    Can be replaced with Redis or PostgreSQL in real production.
    """

    def __init__(self) -> None:
        self._jobs: dict[str, JobStatusResponse] = {}
        self._lock = Lock()
        # Tamamlanmış iş geri çağrıları / Completed job callbacks
        self._callbacks: dict[str, list[Callable]] = {}

    def create(self, url: str) -> JobStatusResponse:
        """
        Yeni iş oluştur ve depoya ekle.
        Create a new job and add to store.
        """
        job_id = str(uuid.uuid4())
        now = datetime.utcnow()

        job = JobStatusResponse(
            job_id=job_id,
            status=JobStatus.QUEUED,
            progress_pct=0,
            steps=_initial_steps(),
            video_id=None,
            created_at=now,
            updated_at=now,
        )

        with self._lock:
            self._jobs[job_id] = job

        return job

    def get(self, job_id: str) -> JobStatusResponse | None:
        """İş bilgisini getir / Get job info."""
        with self._lock:
            return self._jobs.get(job_id)

    def update_status(
        self,
        job_id: str,
        status: JobStatus,
        progress_pct: int | None = None,
    ) -> None:
        """İş durumunu güncelle / Update job status."""
        with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                return
            job.status = status
            if progress_pct is not None:
                job.progress_pct = progress_pct
            job.updated_at = datetime.utcnow()

    def update_step(
        self,
        job_id: str,
        step: int,
        status: JobStatus,
        description: str = "",
        elapsed_sec: float | None = None,
    ) -> None:
        """
        Belirli bir pipeline adımını güncelle.
        Update a specific pipeline step.
        """
        with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                return
            for s in job.steps:
                if s.step == step:
                    s.status = status
                    if description:
                        s.description = description
                    if elapsed_sec is not None:
                        s.elapsed_sec = elapsed_sec
                    break
            job.updated_at = datetime.utcnow()

    def set_video_id(self, job_id: str, video_id: str) -> None:
        """Video ID'sini kaydet / Save video ID."""
        with self._lock:
            job = self._jobs.get(job_id)
            if job:
                job.video_id = video_id
                job.updated_at = datetime.utcnow()

    def set_result(self, job_id: str, result) -> None:
        """Tamamlanmış sonucu kaydet / Save completed result."""
        with self._lock:
            job = self._jobs.get(job_id)
            if job:
                job.result = result
                job.status = JobStatus.DONE
                job.progress_pct = 100
                job.updated_at = datetime.utcnow()

    def set_error(self, job_id: str, message: str) -> None:
        """Hata mesajını kaydet / Save error message."""
        with self._lock:
            job = self._jobs.get(job_id)
            if job:
                job.status = JobStatus.ERROR
                job.error_message = message
                job.updated_at = datetime.utcnow()

    def all(self) -> list[JobStatusResponse]:
        """Tüm işleri döndür / Return all jobs."""
        with self._lock:
            return list(self._jobs.values())


# ---------------------------------------------------------------------------
# Singleton / Singleton Instance
# ---------------------------------------------------------------------------

# Uygulama genelinde tek bir iş deposu / Single job store for the whole app
_job_store: JobStore | None = None


def get_job_store() -> JobStore:
    """
    Singleton iş deposu döndür.
    Return singleton job store (FastAPI dependency injection compatible).
    """
    global _job_store
    if _job_store is None:
        _job_store = JobStore()
    return _job_store


# ---------------------------------------------------------------------------
# Yardımcı / Helper
# ---------------------------------------------------------------------------

def _initial_steps() -> list[StepInfo]:
    """
    Pipeline adımlarının başlangıç durumu.
    Initial state for pipeline steps.
    """
    return [
        StepInfo(step=1, title="Transcript + Video İndir",   status=JobStatus.QUEUED),
        StepInfo(step=2, title="NLP Analizi",                status=JobStatus.QUEUED),
        StepInfo(step=3, title="Frame Çıkarma",              status=JobStatus.QUEUED),
        StepInfo(step=4, title="Storyboard + Wiki Oluştur",  status=JobStatus.QUEUED),
    ]
