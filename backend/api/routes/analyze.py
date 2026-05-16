"""
FrameSense Backend — Analiz Route'u
POST /api/analyze — YouTube URL'si analiz kuyruğuna alır
POST /api/analyze — Queues a YouTube URL for analysis
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status

from ...core.job_store import JobStore, get_job_store
from ...core.config import get_settings
from ...models.schemas import AnalyzeRequest, JobCreatedResponse, JobStatus
from ...services.pipeline_service import PipelineService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["analyze"])


def _get_pipeline_service(
    job_store: JobStore = Depends(get_job_store),
) -> PipelineService:
    """Pipeline servisini bağımlılık olarak döndür / Return pipeline service as dependency."""
    return PipelineService(job_store)


@router.post(
    "/analyze",
    response_model=JobCreatedResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="YouTube videosunu analiz kuyruğuna al",
    description=(
        "Verilen YouTube URL'sini pipeline kuyruğuna ekler. "
        "Dönen `job_id` ile `/api/status/{job_id}` endpoint'inden ilerleme takip edilebilir."
    ),
)
async def analyze_video(
    request: AnalyzeRequest,
    background_tasks: BackgroundTasks,
    job_store: JobStore = Depends(get_job_store),
    pipeline: PipelineService = Depends(_get_pipeline_service),
) -> JobCreatedResponse:
    """
    YouTube URL'sini alır, yeni bir iş oluşturur ve arka planda pipeline'ı başlatır.
    Accepts a YouTube URL, creates a new job, and starts the pipeline in the background.
    """
    settings = get_settings()

    # Eş zamanlı iş limitini kontrol et / Check concurrent job limit
    active_jobs = [
        j for j in job_store.all()
        if j.status in (JobStatus.QUEUED, JobStatus.RUNNING)
    ]
    if len(active_jobs) >= settings.max_concurrent_jobs:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Maksimum {settings.max_concurrent_jobs} eş zamanlı iş çalışabilir. Lütfen bekleyin.",
        )

    # İş oluştur / Create job
    job = job_store.create(request.url)
    logger.info(f"Yeni iş oluşturuldu: {job.job_id} — {request.url}")

    # Arka planda pipeline'ı başlat / Start pipeline in background
    background_tasks.add_task(pipeline.run, job.job_id, request)

    return JobCreatedResponse(
        job_id=job.job_id,
        status=JobStatus.QUEUED,
        message="Video analizi kuyruğa alındı.",
    )
