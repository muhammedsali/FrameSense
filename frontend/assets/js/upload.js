/**
 * upload.js — Ana sayfa etkileşimleri
 * URL giriş formu, ayarlar accordion, istatistik sayacı
 * Main page interactions, URL form, settings accordion, counter animation
 */

import { checkBackendHealth } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {

  // ---- Backend Sağlık Kontrolü / Backend Health Check ----
  const checkStatus = async () => {
    const isHealthy = await checkBackendHealth();
    const btn = document.getElementById('analyze-btn');
    if (btn) {
      if (!isHealthy) {
        // Backend kapalıysa görsel uyarı / Visual warning if backend is offline
        showUrlFeedback('Backend şu an ulaşılamaz durumda. Lütfen sunucuyu başlatın.', 'warn');
      } else {
        showUrlFeedback('', '');
      }
    }
  };
  
  // İlk yüklemede kontrol et / Check on initial load
  checkStatus();

  // ---- Pano Yapıştır Butonu / Paste from clipboard ----
  const pasteBtn = document.getElementById('paste-btn');
  const urlInput = document.getElementById('youtube-url');

  if (pasteBtn && urlInput) {
    pasteBtn.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        urlInput.value = text;
        urlInput.focus();
        showUrlFeedback('', '');
      } catch {
        urlInput.focus();
        showUrlFeedback('Panoya erişim izni gerekiyor — URL\'yi manuel yapıştırın.', 'warn');
      }
    });
  }

  // ---- Ayarlar Accordion / Settings Accordion ----
  const toggle = document.getElementById('settings-toggle');
  const panel  = document.getElementById('settings-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  }

  // ---- Range Slider Çıktıları / Range Slider Outputs ----
  const sliders = [
    { id: 'max-frames',   outId: 'max-frames-output',   fmt: v => v },
    { id: 'silence-gap',  outId: 'silence-gap-output',   fmt: v => `${v}s` },
    { id: 'jpeg-quality', outId: 'jpeg-quality-output',  fmt: v => v },
  ];

  sliders.forEach(({ id, outId, fmt }) => {
    const slider = document.getElementById(id);
    const output = document.getElementById(outId);
    if (!slider || !output) return;
    const update = () => { output.value = fmt(slider.value); };
    slider.addEventListener('input', update);
    update();
  });

  // ---- Form Gönderme / Form Submit ----
  const form = document.getElementById('analyze-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const url = urlInput?.value.trim() ?? '';
      if (!isValidYouTubeUrl(url)) {
        showUrlFeedback('Geçerli bir YouTube URL\'si giriniz.', 'error');
        urlInput?.focus();
        return;
      }

      // Göndermeden önce backend'i son bir kez kontrol et / Final check before sending
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        showUrlFeedback('Backend sunucusu kapalı! Lütfen başlatın.', 'error');
        return;
      }

      showUrlFeedback('', '');

      // Formdaki parametreleri topla / Collect form params
      const params = new URLSearchParams({
        url,
        max_frames:   document.getElementById('max-frames')?.value   ?? '30',
        silence_gap:  document.getElementById('silence-gap')?.value  ?? '5',
        jpeg_quality: document.getElementById('jpeg-quality')?.value ?? '85',
        verbose:      document.getElementById('verbose-mode')?.checked ? '1' : '0',
        no_learn:     document.getElementById('no-learn')?.checked    ? '1' : '0',
      });
      const groq = document.getElementById('groq-api-key')?.value.trim();
      if (groq) params.set('groq_api_key', groq);

      // İşlem sayfasına yönlendir / Redirect to process page
      window.location.href = `pages/process.html?${params.toString()}`;
    });
  }

  // ---- İstatistik Sayaç Animasyonu / Stats Counter Animation ----
  animateCounters();

});

/**
 * YouTube URL doğrulama / YouTube URL validation
 */
function isValidYouTubeUrl(url) {
  try {
    const u = new URL(url);
    return (
      (u.hostname.includes('youtube.com') && u.searchParams.has('v')) ||
      u.hostname === 'youtu.be' ||
      u.pathname.includes('/shorts/')
    );
  } catch {
    return false;
  }
}

/**
 * URL hata/uyarı mesajını göster / Show URL error or warning
 */
function showUrlFeedback(msg, type) {
  const el = document.getElementById('url-error');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'error' ? 'var(--clr-accent)' :
                   type === 'warn'  ? 'var(--clr-yellow)' : '';
}

/**
 * Sayı sayma animasyonu / Animated number counter
 */
function animateCounters() {
  const cards = document.querySelectorAll('[data-count]');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix ?? '';
      const duration = 1500;
      const start    = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // Ease out cubic / Kolaylaştırılmış animasyon
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  cards.forEach(card => observer.observe(card));
}
