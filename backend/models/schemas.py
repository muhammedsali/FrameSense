"""
watch-youtube Backend — Pydantic Şemaları
Request/Response modelleri — veri doğrulama
Request/Response models — data validation
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, HttpUrl


# ---------------------------------------------------------------------------
# Enum Tanımları / Enum Definitions
# ---------------------------------------------------------------------------

class JobStatus(str, Enum):
    """İş kuyruğu durumları / Job queue states."""
    QUEUED     = "queued"
    RUNNING    = "running"
    DONE       = "done"
    ERROR      = "error"


class LogLevel(str, Enum):
    """Log seviyesi / Log level."""
    INFO  = "info"
    OK    = "ok"
    WARN  = "warn"
    ERROR = "error"


# ---------------------------------------------------------------------------
# İstek Modelleri / Request Models
# ---------------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    """POST /api/analyze — gelen istek / incoming request."""
    url: str = Field(..., description="YouTube video URL'si", example="https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    max_frames: int = Field(30, ge=5, le=60, description="Maksimum frame sayısı")
    silence_gap: float = Field(5.0, ge=1.0, le=15.0, description="Sessizlik eşiği (saniye)")
    jpeg_quality: int = Field(85, ge=50, le=95, description="JPEG kalitesi")
    groq_api_key: str | None = Field(None, description="Groq API key (Whisper fallback)")
    verbose: bool = Field(False, description="Detaylı loglama")
    no_learn: bool = Field(False, description="Self-learning'i atla")


# ---------------------------------------------------------------------------
# Yanıt Modelleri / Response Models
# ---------------------------------------------------------------------------

class JobCreatedResponse(BaseModel):
    """POST /api/analyze yanıtı / response."""
    job_id: str
    status: JobStatus
    message: str = "İş kuyruğa alındı."


class StepInfo(BaseModel):
    """Pipeline adım bilgisi / pipeline step info."""
    step: int
    title: str
    status: JobStatus
    description: str = ""
    elapsed_sec: float | None = None


class JobStatusResponse(BaseModel):
    """GET /api/status/{job_id} yanıtı / response."""
    job_id: str
    status: JobStatus
    progress_pct: int = Field(0, ge=0, le=100)
    steps: list[StepInfo] = []
    video_id: str | None = None
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime
    result: "JobResult | None" = None


class JobResult(BaseModel):
    """Tamamlanmış iş sonucu / completed job result."""
    video_id: str
    transcript_source: str
    entry_count: int
    smart_timestamps: int
    fixed_count: int
    frame_count: int
    board_count: int
    storyboard_paths: list[str]
    wiki_pages: list[str]
    elapsed_sec: float
    learned_keywords: int


class StoryboardListResponse(BaseModel):
    """GET /api/storyboards/{video_id} yanıtı / response."""
    video_id: str
    pages: list[StoryboardPage]


class StoryboardPage(BaseModel):
    """Tek storyboard sayfası / single storyboard page."""
    filename: str
    url: str
    size_kb: int
    page_number: int


class WikiPage(BaseModel):
    """Wiki sayfası özeti / wiki page summary."""
    filename: str
    title: str
    summary: str = ""
    source_video_ids: list[str] = []
    url: str


class WikiListResponse(BaseModel):
    """GET /api/wiki yanıtı / response."""
    pages: list[WikiPage]
    total: int


class HistoryItem(BaseModel):
    """Analiz geçmişi girişi / history entry."""
    job_id: str
    video_id: str
    url: str
    status: JobStatus
    frame_count: int = 0
    board_count: int = 0
    created_at: datetime


class HistoryResponse(BaseModel):
    """GET /api/history yanıtı / response."""
    items: list[HistoryItem]
    total: int


class LogMessage(BaseModel):
    """WebSocket log mesajı / WebSocket log message."""
    type: str = "log"
    message: str
    level: LogLevel = LogLevel.INFO
    step: int | None = None


class ErrorResponse(BaseModel):
    """Hata yanıtı / error response."""
    detail: str
    code: str | None = None


# Döngüsel referans güncelleme / Update forward references
JobStatusResponse.model_rebuild()
