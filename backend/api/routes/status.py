"""
FrameSense Backend — Durum Route'u
GET /api/status/{job_id} — İş durumunu sorgular
WebSocket /ws/job/{job_id} — Gerçek zamanlı log akışı
"""

from __future__ import annotations

import asyncio
import json
import logging

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status

from ...core.job_store import JobStore, get_job_store
from ...models.schemas import JobStatus, JobStatusResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["status"])


@router.get(
    "/status/{job_id}",
    response_model=JobStatusResponse,
    summary="İş durumunu sorgula",
    description="Belirli bir iş ID'sinin güncel durumunu, adım ilerlemesini ve sonucunu döndürür.",
)
async def get_job_status(
    job_id: str,
    job_store: JobStore = Depends(get_job_store),
) -> JobStatusResponse:
    """
    İş ID'sine göre güncel durumu döndürür.
    Returns current status by job ID.
    """
    job = job_store.get(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"İş bulunamadı: {job_id}",
        )
    return job


@router.get(
    "/history",
    summary="Analiz geçmişi",
    description="Tüm tamamlanmış ve devam eden işlerin listesi.",
)
async def get_history(
    job_store: JobStore = Depends(get_job_store),
) -> dict:
    """
    Tüm işlerin özetini döndürür (en yeniden en eskiye).
    Returns summary of all jobs (newest first).
    """
    jobs = sorted(
        job_store.all(),
        key=lambda j: j.created_at,
        reverse=True,
    )

    items = []
    for job in jobs:
        items.append({
            "job_id":      job.job_id,
            "video_id":    job.video_id,
            "status":      job.status,
            "progress_pct": job.progress_pct,
            "frame_count": job.result.frame_count if job.result else 0,
            "board_count": job.result.board_count if job.result else 0,
            "created_at":  job.created_at.isoformat(),
        })

    return {"items": items, "total": len(items)}


# ---------------------------------------------------------------------------
# WebSocket — Gerçek zamanlı durum / Real-time status
# ---------------------------------------------------------------------------

@router.websocket("/ws/job/{job_id}")
async def job_websocket(
    websocket: WebSocket,
    job_id: str,
    job_store: JobStore = Depends(get_job_store),
) -> None:
    """
    WebSocket ile gerçek zamanlı iş durumu.
    İş bitmeden veya bağlantı kesilene kadar her saniye durum gönderir.
    Real-time job status via WebSocket.
    Sends status every second until job completes or connection is dropped.
    """
    await websocket.accept()
    logger.info(f"WebSocket bağlantısı açıldı: {job_id}")

    try:
        while True:
            job = job_store.get(job_id)

            if not job:
                await websocket.send_json({
                    "type": "error",
                    "message": f"İş bulunamadı: {job_id}",
                })
                break

            # Durum mesajı gönder / Send status message
            await websocket.send_json({
                "type":         "status",
                "job_id":       job.job_id,
                "status":       job.status,
                "progress_pct": job.progress_pct,
                "steps":        [s.model_dump() for s in job.steps],
                "video_id":     job.video_id,
            })

            # Tamamlandıysa son mesajı gönder ve bağlantıyı kapat
            # If done, send final message and close
            if job.status == JobStatus.DONE:
                await websocket.send_json({
                    "type":   "done",
                    "result": job.result.model_dump() if job.result else None,
                })
                break

            if job.status == JobStatus.ERROR:
                await websocket.send_json({
                    "type":    "error",
                    "message": job.error_message or "Bilinmeyen hata",
                })
                break

            await asyncio.sleep(1)

    except WebSocketDisconnect:
        logger.info(f"WebSocket bağlantısı kapandı: {job_id}")
    except Exception as exc:
        logger.exception(f"WebSocket hatası [{job_id}]: {exc}")
        try:
            await websocket.send_json({"type": "error", "message": str(exc)})
        except Exception:
            pass
