"""
watch-youtube Backend — Wiki Route'u
GET /api/wiki — Tüm wiki sayfalarını listeler
GET /api/wiki/{filename} — Tek sayfayı döndürür
GET /api/wiki/{filename}/content — Ham Markdown içeriğini döndürür
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import PlainTextResponse

from ...models.schemas import WikiListResponse, WikiPage
from ...services.wiki_service import WikiService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/wiki", tags=["wiki"])

# Servis singleton / Service singleton
_wiki_service: WikiService | None = None


def _get_wiki_service() -> WikiService:
    """Wiki servisini döndür / Return wiki service."""
    global _wiki_service
    if _wiki_service is None:
        _wiki_service = WikiService()
    return _wiki_service


@router.get(
    "",
    response_model=WikiListResponse,
    summary="Wiki sayfalarını listele",
    description="docs/wiki/ klasöründeki tüm Obsidian Markdown sayfalarını listeler.",
)
async def list_wiki_pages(
    q: str | None = Query(None, description="Arama sorgusu / search query"),
) -> WikiListResponse:
    """
    Wiki sayfalarını listeler veya arama yapar.
    Lists wiki pages or performs a search.
    """
    svc = _get_wiki_service()

    if q:
        pages = svc.search(q)
    else:
        pages = svc.list_pages()

    return WikiListResponse(pages=pages, total=len(pages))


@router.get(
    "/{filename}",
    response_model=WikiPage,
    summary="Wiki sayfası metaveri",
    description="Belirli bir wiki sayfasının başlık, özet ve kaynak video bilgilerini döndürür.",
)
async def get_wiki_page(filename: str) -> WikiPage:
    """
    Belirli bir wiki sayfasının metadata'sını döndürür.
    Returns metadata of a specific wiki page.
    """
    svc = _get_wiki_service()
    page = svc.get_page(filename)

    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Wiki sayfası bulunamadı: {filename}",
        )

    return page


@router.get(
    "/{filename}/content",
    response_class=PlainTextResponse,
    summary="Wiki sayfası Markdown içeriği",
    description="Ham Markdown içeriğini döndürür. Frontend'de render etmek için kullanılır.",
)
async def get_wiki_page_content(filename: str) -> str:
    """
    Wiki sayfasının ham Markdown içeriğini döndürür.
    Returns raw Markdown content of a wiki page.
    """
    svc = _get_wiki_service()
    content = svc.get_page_content(filename)

    if content is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Wiki sayfası bulunamadı: {filename}",
        )

    return content
