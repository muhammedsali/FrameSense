<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/play-circle.svg" alt="FrameSense logo" width="80" height="80">
  
  # FrameSense

  **Vision LLM'ler için Akıllı YouTube Video Analiz ve Storyboard Motoru**

  [![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg?style=flat-square)](https://python.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.136.1-009688.svg?style=flat-square)](https://fastapi.tiangolo.com)
  [![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

  *Videoları baştan sona izlemeyin; yapay zeka sizin için en önemli anları bulsun ve derlesin.*
</div>

<br/>

`FrameSense`, uzun YouTube videolarını Vision LLM'ler (örn. GPT-4V, Claude 3.5 Sonnet, LLaVA) için optimize edilmiş "Storyboard" gridlerine dönüştüren yüksek performanslı bir pipeline aracıdır.

Videoları kare kare indirmek yerine NLP (Doğal Dil İşleme) kullanarak transkript üzerinden "akıllı zaman damgaları" (smart timestamps) belirler ve yalnızca en kritik anları bir araya getirerek token tasarrufu sağlar.

---

## 🌟 Neden FrameSense?

Meta, OpenAI ve Google gibi devlerin Vision model araştırma projelerinde kullanılan pipeline mantığına uygun tasarlanmıştır:

- **Token Optimizasyonu:** Gereksiz (sessiz, hareketsiz, boş konuşma) kareleri eler. Sabit saniye aralığına göre %75'e varan tasarruf sağlar.
- **Akıllı NLP Filtresi:** spaCy ve dinamik bir Keyword Store (Anahtar Kelime Deposu) kullanarak videonun en can alıcı noktalarını seçer.
- **Modern Arayüz (Meta UI):** Tamamen asenkron, WebSocket tabanlı, reaktif ve çok temiz (clean-tech) bir web arayüzü sunar.
- **Wiki Jeneratörü:** Çıkarılan kareler ve transkriptler ile otomatik olarak Obsidian/Notion uyumlu Markdown dökümanları üretir.
- **SOLID Mimarisi:** FastAPI üzerinde servis odaklı, genişletilmeye ve modül eklenmeye açık bir yapı.

---

## 🏗️ Mimari (Architecture)

Sistem 4 ana adımdan (Pipeline) oluşur:

1. **Downloader (`yt-dlp`):** Videonun transkriptini ve medyayı indirir. Transkript yoksa Groq API üzerinden Whisper-v3 ile otomatik üretir.
2. **Analyzer (`spaCy`):** NLP ile transkriptteki anahtar kelimeleri, deiktik ifadeleri (ör: "şuna bakın") ve uzun sessizlikleri tespit eder.
3. **Extractor (`ffmpeg`):** Sadece tespit edilen o kritik saniyelerden yüksek çözünürlüklü kilit kareleri (keyframes) çıkarır.
4. **Compiler (`Pillow` & `wiki_generator`):** Çıkarılan kareleri zaman damgaları ve altyazılarla birlikte adaptif bir grid haline getirir. Eş zamanlı olarak detaylı bir Markdown Wiki sayfası yazar.

---

## 🚀 Başlangıç (Getting Started)

### Gereksinimler

- Python 3.10+
- [FFmpeg](https://ffmpeg.org/download.html) (Sistem `PATH` değişkenine ekli olmalı)

### Hızlı Kurulum

Projeyi klonlayın ve bağımlılıkları yükleyin. Windows kullanıcıları için otomatik kurulum scripti mevcuttur:

```bash
git clone https://github.com/KULLANICI_ADI/FrameSense.git
cd FrameSense

# Bağımlılıkları, klasörleri ve spaCy modellerini otomatik kurmak için:
python setup_env.py
```

*Not: Eğer sisteminizde FFmpeg yoksa, `setup_env.py` sizi uyaracaktır. Windows'ta `winget install ffmpeg` ile tek tuşla kurabilirsiniz.*

### Çalıştırma

Modern web arayüzünü ve backend'i tek bir komutla başlatın:

```bash
python -m uvicorn backend.main:app --port 8000 --reload
```

Tarayıcınızda açın: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## ⚙️ Konfigürasyon

Proje ayarlarını kök dizindeki `.env` dosyasından veya doğrudan UI üzerinden yönetebilirsiniz:

| Parametre | Varsayılan | Açıklama |
| :--- | :--- | :--- |
| `MAX_FRAMES` | 30 | Bir videodan çıkarılacak maksimum kare sayısı. |
| `SILENCE_GAP` | 5.0 | Kaç saniyelik sessizliklerin ayrı bir frame olarak alınacağı. |
| `JPEG_QUALITY` | 85 | Üretilen storyboard grid'inin kalite oranı. |
| `GROQ_API_KEY` | - | (Opsiyonel) Altyazısı olmayan videolar için fısıltı (Whisper) modeli API anahtarı. |

---

## 📂 Proje Yapısı

```text
FrameSense/
├── backend/                  # FastAPI Sunucu ve Servisleri
│   ├── api/routes/           # REST ve WebSocket Uç Noktaları
│   ├── core/                 # Config ve JobStore (In-memory state)
│   └── services/             # İş Mantığı (Pipeline orchestrator)
├── frontend/                 # Modern Meta UI (HTML/CSS/JS)
│   ├── assets/               # CSS Tokens, JS (ES Modules)
│   └── pages/                # Viewer, Process, History, Wiki Sayfaları
├── framesense/            # Çekirdek Python Kütüphanesi (Core logic)
│   ├── analyzer.py           # spaCy NLP & Keyword logic
│   ├── compiler.py           # Pillow Grid builder
│   ├── downloader.py         # yt-dlp wrapper
│   ├── extractor.py          # FFmpeg frame extraction
│   └── wiki_generator.py     # Markdown dökümantasyon motoru
├── setup_env.py              # Akıllı kurulum yardımcısı
└── README.md
```

---

## 🤝 Katkıda Bulunma (Contributing)

Bu proje geliştirilmeye çok açıktır! Pull Request göndermeden önce:

1. Kodu `black` ve `isort` ile formatladığınızdan emin olun.
2. Yeni özellikler için bir Issue açıp tartışın.
3. SOLID prensiplerine sadık kalın.

---

## 📄 Lisans

Bu proje **MIT** lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.
