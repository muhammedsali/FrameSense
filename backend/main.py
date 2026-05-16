"""
FrameSense Backend — FastAPI Uygulama Giriş Noktası
Tüm route'ları birleştirir, CORS ve middleware'leri yapılandırır.
Main FastAPI application entry point.
Combines all routes, configures CORS and middlewares.
"""

from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .api.routes import analyze, status, wiki, storyboards
from .core.config import get_settings

# ---------------------------------------------------------------------------
# Loglama / Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    format="[%(asctime)s] %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
    level=logging.INFO,
)
logger = logging.getLogger("framesense.api")

# ---------------------------------------------------------------------------
# FastAPI Uygulaması / FastAPI Application
# ---------------------------------------------------------------------------
settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "YouTube videolarını NLP + Vision LLM ile analiz eden pipeline API'si. "
        "Transkript analizi, akıllı frame seçimi ve Obsidian wiki üretimi."
    ),
    docs_url="/docs",       # Swagger UI — geliştirme sırasında / during development
    redoc_url="/redoc",     # ReDoc — alternatif dokümantasyon / alternative docs
    openapi_url="/openapi.json",
)

# ---------------------------------------------------------------------------
# CORS — Frontend'in API'ye erişmesi için / Allow frontend to access API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Route'ları Kaydet / Register Routes
# ---------------------------------------------------------------------------
app.include_router(analyze.router)
app.include_router(status.router)
app.include_router(wiki.router)
app.include_router(storyboards.router)

# ---------------------------------------------------------------------------
# Kök Endpoint / Root Endpoint — Frontend'i Sun / Serve Frontend
# ---------------------------------------------------------------------------

frontend_path = Path(__file__).parent.parent / "frontend"

@app.get("/", tags=["health"], summary="Frontend'i aç")
async def root() -> FileResponse:
    """Ana sayfayı döndürür / Returns index.html."""
    return FileResponse(frontend_path / "index.html")

@app.get("/index.html", include_in_schema=False)
async def serve_index() -> FileResponse:
    """Navbar tıklamalarındaki index.html yolları için / For navbar clicks."""
    return FileResponse(frontend_path / "index.html")

# Frontend klasörünü statik olarak sun / Mount static files
app.mount("/assets", StaticFiles(directory=frontend_path / "assets"), name="assets")
app.mount("/pages", StaticFiles(directory=frontend_path / "pages"), name="pages")

@app.get("/health", tags=["health"], summary="Sağlık kontrolü")
async def health() -> dict:
    """Load balancer / uptime monitor için / For load balancer / uptime monitor."""
    return {"status": "healthy"}


# ---------------------------------------------------------------------------
# Uygulama Başlatma / Application Startup
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def on_startup() -> None:
    """Uygulama başladığında çalışır / Runs on application startup."""
    logger.info(f"{settings.app_name} v{settings.app_version} başlatıldı")
    logger.info(f"Docs: http://{settings.host}:{settings.port}/docs")
    logger.info(f"Output dir: {settings.output_dir}")
    logger.info(f"Wiki dir:   {settings.wiki_dir}")


# ---------------------------------------------------------------------------
# Çalıştırma / Run (geliştirme / development)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info",
    )
