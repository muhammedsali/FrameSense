"""
watch-youtube Backend — Storyboard Route'u
GET /api/storyboards/{video_id} — Storyboard dosyalarını listeler
GET /api/storyboards/{video_id}/{filename} — Tek dosyayı döndürür
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from ...core.config import get_settings
from ...models.schemas import StoryboardListResponse, StoryboardPage

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/storyboards", tags=["storyboards"])


@router.get(
    "/{video_id}",
    response_model=StoryboardListResponse,
    summary="Storyboard sayfalarını listele",
    description="Belirli bir video ID'si için üretilmiş storyboard JPEG'lerini listeler.",
)
async def list_storyboards(video_id: str) -> StoryboardListResponse:
    """
    video_id klasöründeki storyboard JPEG'lerini listeler.
    Lists storyboard JPEGs in the video_id directory.
    """
    settings = get_settings()
    video_dir = settings.output_dir / video_id

    if not video_dir.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Video ID için storyboard bulunamadı: {video_id}",
        )

    # JPEG dosyalarını sırala / Sort JPEG files
    pages = []
    for i, jpg in enumerate(sorted(video_dir.glob("storyboard_page_*.jpg")), start=1):
        size_kb = jpg.stat().st_size // 1024
        pages.append(StoryboardPage(
            filename=jpg.name,
            url=f"/api/storyboards/{video_id}/{jpg.name}",
            size_kb=size_kb,
            page_number=i,
        ))

    return StoryboardListResponse(video_id=video_id, pages=pages)


@router.get(
    "/{video_id}/{filename}",
    summary="Storyboard dosyasını indir",
    description="Belirtilen storyboard JPEG dosyasını döndürür.",
    response_class=FileResponse,
)
async def get_storyboard_file(video_id: str, filename: str) -> FileResponse:
    """
    Storyboard JPEG dosyasını döndürür.
    Returns a storyboard JPEG file.
    """
    settings = get_settings()
    file_path = settings.output_dir / video_id / filename

    # Güvenlik: dosya yolu output_dir içinde mi? / Security: is path inside output_dir?
    try:
        file_path.resolve().relative_to(settings.output_dir.resolve())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz dosya yolu",
        )

    if not file_path.exists() or not file_path.suffix.lower() == ".jpg":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dosya bulunamadı: {filename}",
        )

    return FileResponse(
        path=str(file_path),
        media_type="image/jpeg",
        filename=filename,
    )
