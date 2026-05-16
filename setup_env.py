import sys
import subprocess
import shutil
import os
from pathlib import Path

def run_command(cmd):
    print(f">> Çalıştırılıyor: {cmd}")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + cmd.split())
        return True
    except Exception as e:
        print(f"Hata: {e}")
        return False

def check_ffmpeg():
    print(">> FFmpeg kontrol ediliyor...")
    if shutil.which("ffmpeg"):
        print("✅ FFmpeg bulundu.")
        return True
    else:
        print("❌ HATA: FFmpeg bulunamadı!")
        print("Lütfen FFmpeg'i kurun ve PATH'e ekleyin.")
        print("Windows için: https://www.gyan.dev/ffmpeg/builds/")
        return False

def setup():
    print("=== FrameSense Proje Kurulumu ===")
    
    # 1. Temel kütüphaneler
    libraries = "fastapi uvicorn[standard] pydantic pydantic-settings python-multipart websockets yt-dlp spacy pillow requests webvtt-py jinja2"
    run_command(libraries)

    # 2. spacy modeli
    print(">> spaCy modeli indiriliyor...")
    subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])

    # 3. Klasör yapısını oluştur
    folders = ["output", "docs/wiki", "data", "temp"]
    for f in folders:
        Path(f).mkdir(parents=True, exist_ok=True)
        print(f"✅ Klasör hazır: {f}")

    # 4. FFmpeg kontrolü
    check_ffmpeg()

    print("\n=== Kurulum Tamamlandı! ===")
    print("Başlatmak için: python -m uvicorn backend.main:app --reload")

if __name__ == "__main__":
    setup()
