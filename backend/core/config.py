"""
FrameSense Backend — Uygulama Yapılandırması
Settings ve environment variable yönetimi
Application settings and environment variable management
"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Uygulama ayarları — .env dosyasından veya environment'dan okunur.
    Application settings — read from .env file or environment variables.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Uygulama bilgisi / App info
    app_name: str = "FrameSense API"
    app_version: str = "1.0.0"
    debug: bool = False

    # API sunucu / API server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS — Frontend adresleri / Frontend origins
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "null",  # file:// protokolü için geliştirme sırasında / for file:// during dev
    ]

    # Dosya yolları / File paths (proje kökünden / from project root)
    project_root: Path = Path(__file__).parent.parent.parent
    output_dir: Path = Path(__file__).parent.parent.parent / "output"
    wiki_dir: Path = Path(__file__).parent.parent.parent / "docs" / "wiki"
    data_dir: Path = Path(__file__).parent.parent.parent / "data"

    # İş kuyruğu / Job queue
    max_concurrent_jobs: int = 3
    job_timeout_sec: int = 600  # 10 dakika / 10 minutes

    # Groq API (opsiyonel / optional)
    groq_api_key: str | None = None

    # FrameSense pipeline varsayılanları / pipeline defaults
    default_max_frames: int = 30
    default_silence_gap: float = 5.0
    default_jpeg_quality: int = 85


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Singleton ayarlar nesnesi — her çağrıda aynı nesne döner.
    Singleton settings object — returns the same instance on every call.
    """
    return Settings()
