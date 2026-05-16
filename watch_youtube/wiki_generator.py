"""Generate Obsidian-ready Markdown wiki pages from video analysis results."""

import logging
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)

def generate_wiki_page(
    video_id: str,
    title: str,
    transcript_entries: list,
    smart_timestamps: list,
    output_dir: Path
) -> Path:
    """Creates a markdown file summarizing the video analysis."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Safe filename
    clean_title = "".join([c if c.isalnum() or c in " _-" else "_" for c in title])
    file_path = output_dir / f"{video_id}_{clean_title[:50]}.md"
    
    content = [
        f"# {title}",
        f"\n**Tarih:** {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"**Kaynak Video:** https://www.youtube.com/watch?v={video_id}",
        "\n## 📝 Özet",
        "Bu video yapay zeka tarafından analiz edildi ve önemli anlar storyboard olarak derlendi.",
        "\n## 🧠 Akıllı Analiz Notları",
        f"Toplam {len(transcript_entries)} transkript satırı incelendi ve {len(smart_timestamps)} kritik an tespit edildi.",
        "\n## ⏱️ Önemli Timestamp'ler",
        "| Zaman | Açıklama |",
        "|-------|----------|"
    ]
    
    # En önemli 10 timestamp'i ekle
    for ts in smart_timestamps[:15]:
        # ts nesne veya dict olabilir, pipeline'dan nasıl geldiğine göre ayarla
        time_str = f"{int(ts.time_sec // 60)}:{int(ts.time_sec % 60):02d}"
        content.append(f"| {time_str} | {ts.transcript_text[:100]}... |")
        
    content.append("\n\n---")
    content.append("\n*watch-youtube AI tarafından otomatik oluşturulmuştur.*")
    
    file_path.write_text("\n".join(content), encoding="utf-8")
    logger.info(f"Wiki sayfası oluşturuldu: {file_path.name}")
    return file_path
