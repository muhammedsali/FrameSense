"""
watch-youtube Backend — Wiki Servisi
docs/wiki/ klasöründeki Markdown dosyalarını okur ve parse eder.
Reads and parses Markdown files from docs/wiki/ directory.
"""

from __future__ import annotations

import re
from pathlib import Path

from ..core.config import get_settings
from ..models.schemas import WikiPage


class WikiService:
    """
    Obsidian formatındaki wiki sayfalarını web API için sunar.
    Serves Obsidian-format wiki pages for the web API.
    """

    def __init__(self) -> None:
        self._settings = get_settings()
        self._wiki_dir: Path = self._settings.wiki_dir

    # -----------------------------------------------------------------------
    # Public API
    # -----------------------------------------------------------------------

    def list_pages(self) -> list[WikiPage]:
        """
        Tüm wiki sayfalarını listele (Index.md ve Videos.md hariç).
        List all wiki pages (excluding Index.md and Videos.md).
        """
        if not self._wiki_dir.exists():
            return []

        pages = []
        skip = {"index.md", "videos.md"}

        for md_file in sorted(self._wiki_dir.glob("*.md")):
            if md_file.name.lower() in skip:
                continue
            page = self._parse_page(md_file)
            pages.append(page)

        return pages

    def get_page(self, filename: str) -> WikiPage | None:
        """
        Belirli bir wiki sayfasını döndür.
        Return a specific wiki page.
        """
        path = self._wiki_dir / filename
        if not path.exists() or path.suffix != ".md":
            return None
        return self._parse_page(path)

    def get_page_content(self, filename: str) -> str | None:
        """
        Wiki sayfasının ham Markdown içeriğini döndür.
        Return raw Markdown content of a wiki page.
        """
        path = self._wiki_dir / filename
        if not path.exists():
            return None
        return path.read_text(encoding="utf-8")

    def search(self, query: str) -> list[WikiPage]:

        """
        Wiki sayfalarında basit metin araması yap.
        Simple text search across wiki pages.
        """
        query_lower = query.lower()
        results = []

        for page in self.list_pages():
            content = self.get_page_content(page.filename) or ""
            if query_lower in content.lower() or query_lower in page.title.lower():
                results.append(page)

        return results

    # -----------------------------------------------------------------------
    # Private Helpers
    # -----------------------------------------------------------------------

    def _parse_page(self, path: Path) -> WikiPage:
        """
        Markdown dosyasını parse et, başlık ve özeti çıkar.
        Parse Markdown file, extract title and summary.
        """
        content = path.read_text(encoding="utf-8", errors="replace")

        title   = self._extract_title(content, path.stem)
        summary = self._extract_summary(content)
        sources = self._extract_source_videos(content)

        return WikiPage(
            filename=path.name,
            title=title,
            summary=summary,
            source_video_ids=sources,
            url=f"/api/wiki/{path.name}",
        )

    def _extract_title(self, content: str, fallback: str) -> str:
        """İlk H1 başlığını al / Extract first H1 heading."""
        match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        return match.group(1).strip() if match else fallback

    def _extract_summary(self, content: str) -> str:
        """
        **Özet:** alanını veya ilk paragrafı al.
        Extract **Özet:** field or first paragraph.
        """
        # Özet alanı / Özet field
        match = re.search(r"\*\*Özet:\*\*\s*(.+?)(?:\n|$)", content)
        if match:
            return match.group(1).strip()

        # İlk boş olmayan paragraf / First non-empty paragraph
        for line in content.splitlines():
            stripped = line.strip()
            if stripped and not stripped.startswith("#") and not stripped.startswith("**"):
                return stripped[:200]

        return ""

    def _extract_source_videos(self, content: str) -> list[str]:
        """
        **Kaynak Video:** alanındaki video ID'lerini çıkar.
        Extract video IDs from **Kaynak Video:** field.
        """
        match = re.search(r"\*\*Kaynak Video:\*\*\s*(.+?)(?:\n|$)", content)
        if not match:
            return []

        # YouTube video ID'lerini bul / Find YouTube video IDs
        ids = re.findall(r"[A-Za-z0-9_-]{11}", match.group(1))
        return ids
