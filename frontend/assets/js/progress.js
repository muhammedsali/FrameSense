/**
 * progress.js — İşlem ekranı mantığı
 * Process page: URL parametrelerini okur, backend'e gönderir,
 * WebSocket ile adım adım ilerlemeyi gösterir.
 *
 * Process page: reads URL params, sends to backend,
 * shows step-by-step progress via WebSocket.
 */

// ============================================================
// API modülünü yükle / Load API module
// ============================================================
// Not: <script type="module"> gerektirir / Requires <script type="module">
import { analyzeVideo, connectJobWebSocket, checkBackendHealth } from './api.js';

// ============================================================
// URL Parametrelerini Oku / Read URL Parameters
// ============================================================
const params = new URLSearchParams(window.location.search);

const videoUrl   = params.get('url')          ?? '';
const maxFrames  = parseInt(params.get('max_frames') ?? '30', 10);
const silenceGap = parseFloat(params.get('silence_gap') ?? '5');
const jpegQual   = parseInt(params.get('jpeg_quality') ?? '85', 10);
const verbose    = params.get('verbose') === '1';
const noLearn    = params.get('no_learn') === '1';
const groqKey    = params.get('groq_api_key') ?? '';

// ============================================================
// DOM Elementleri / DOM Elements
// ============================================================
const urlEl     = document.getElementById('video-url');
const statusBdg = document.getElementById('status-badge');
const statusTxt = document.getElementById('status-text');
const progBar   = document.getElementById('progress-bar');
const progPct   = document.getElementById('progress-pct');
const progRole  = document.getElementById('progress-bar-role');
const logBody   = document.getElementById('log-body');
const logDot    = document.getElementById('log-dot');
const successBn = document.getElementById('success-banner');
const successSb = document.getElementById('success-sub');
const viewBtn   = document.getElementById('view-storyboard-btn');

// URL'yi göster / Show URL
if (urlEl) urlEl.textContent = videoUrl;

// ============================================================
// Yardımcı Fonksiyonlar / Helper Functions
// ============================================================

/** İlerleme çubuğunu güncelle / Update progress bar */
function setProgress(pct) {
  if (progBar)  progBar.style.width = `${pct}%`;
  if (progPct)  progPct.textContent = `${pct}%`;
  if (progRole) progRole.setAttribute('aria-valuenow', pct);
}

/** Durum rozetini güncelle / Update status badge */
function setStatus(type, text) {
  if (!statusBdg || !statusTxt) return;
  statusBdg.className = `status-badge status-badge--${type}`;
  statusTxt.textContent = text;
}

/** Log satırı ekle / Append log line */
function appendLog(msg, level = 'info') {
  if (!logBody) return;
  const now  = new Date();
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const line = document.createElement('div');
  line.className = `log-line log-line--${level}`;
  line.innerHTML = `<span class="log-line__time">${time}</span><span class="log-line__msg">${escHtml(msg)}</span>`;
  logBody.appendChild(line);
  logBody.scrollTop = logBody.scrollHeight;
}

const pad = (n) => String(n).padStart(2, '0');
const escHtml = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/** Log temizle / Clear log */
document.getElementById('clear-log-btn')?.addEventListener('click', () => {
  if (logBody) logBody.innerHTML = '';
});

// ============================================================
// Pipeline Adım Güncelleme / Step State Update
// ============================================================

/** Adım durumunu UI'da göster / Render step state in UI */
function renderStep(stepNum, stepStatus, desc = '', elapsedSec = null) {
  const el        = document.getElementById(`step-${stepNum}`);
  const indicator = document.getElementById(`step-${stepNum}-indicator`);
  const descEl    = document.getElementById(`step-${stepNum}-desc`);
  const timeEl    = document.getElementById(`step-${stepNum}-time`);
  if (!el) return;

  el.classList.remove('step-item--active', 'step-item--done', 'step-item--error');

  if (stepStatus === 'running') {
    el.classList.add('step-item--active');
    if (indicator) indicator.innerHTML = '<div class="spinner"></div>';
  } else if (stepStatus === 'done') {
    el.classList.add('step-item--done');
    if (indicator) indicator.innerHTML = '<span class="checkmark">✓</span>';
    if (elapsedSec !== null && timeEl) timeEl.textContent = `${elapsedSec.toFixed(1)}s`;
    if (desc && descEl) descEl.textContent = desc;
  } else if (stepStatus === 'error') {
    el.classList.add('step-item--error');
    if (indicator) indicator.innerHTML = '<span class="error-mark">✕</span>';
    if (desc && descEl) descEl.textContent = desc;
  }
}

/** WebSocket'ten gelen adım listesini işle / Process steps from WebSocket */
function handleSteps(steps) {
  if (!Array.isArray(steps)) return;
  steps.forEach(s => renderStep(s.step, s.status, s.description, s.elapsed_sec));
}

// ============================================================
// Başarı Banner'ı / Success Banner
// ============================================================
function showSuccess(result) {
  if (!successBn || !result) return;
  if (successSb)  successSb.textContent = `${result.frame_count} frame → ${result.board_count} storyboard oluşturuldu (${result.elapsed_sec?.toFixed(1)}s)`;
  if (viewBtn)    viewBtn.href = `viewer.html?video_id=${result.video_id}&job_id=${result.job_id ?? ''}`;
  successBn.hidden = false;
}

// ============================================================
// Ana Akış / Main Flow
// ============================================================
async function startAnalysis() {
  if (!videoUrl) {
    appendLog('URL parametresi bulunamadı. Ana sayfaya yönlendiriliyorsunuz...', 'warn');
    setTimeout(() => { window.location.href = '../index.html'; }, 2000);
    return;
  }

  // 1. Backend sağlık kontrolü / Backend health check
  appendLog('Backend bağlantısı kontrol ediliyor...', 'info');
  const healthy = await checkBackendHealth();
  if (!healthy) {
    appendLog('Backend çalışmıyor! Lütfen: python -m uvicorn backend.main:app --port 8000', 'error');
    setStatus('error', 'Backend Hatası');
    return;
  }
  appendLog('Backend bağlantısı tamam.', 'ok');

  // 2. Analiz isteği gönder / Send analyze request
  setStatus('running', 'Kuyruğa alınıyor...');
  let jobId;
  try {
    appendLog(`Analiz kuyruğa gönderiliyor: ${videoUrl}`, 'info');
    const response = await analyzeVideo({
      url:          videoUrl,
      max_frames:   maxFrames,
      silence_gap:  silenceGap,
      jpeg_quality: jpegQual,
      verbose,
      no_learn:     noLearn,
      groq_api_key: groqKey || undefined,
    });
    jobId = response.job_id;
    appendLog(`İş ID: ${jobId}`, 'info');
    setStatus('running', 'Çalışıyor');
  } catch (err) {
    appendLog(`Kuyruğa alma hatası: ${err.message}`, 'error');
    setStatus('error', 'Hata');
    return;
  }

  // 3. WebSocket ile gerçek zamanlı takip / Real-time tracking via WebSocket
  appendLog('Pipeline başlatıldı, adımlar takip ediliyor...', 'info');

  connectJobWebSocket(
    jobId,

    // onStatus — her saniye / every second
    (data) => {
      setProgress(data.progress_pct ?? 0);
      handleSteps(data.steps ?? []);
    },

    // onDone — tamamlandı / completed
    (result) => {
      if (result) result.job_id = jobId;
      setProgress(100);
      setStatus('done', 'Tamamlandı');
      appendLog('Pipeline tamamlandi!', 'ok');
      appendLog(`${result?.frame_count} frame → ${result?.board_count} storyboard`, 'ok');
      if (result?.learned_keywords) appendLog(`${result.learned_keywords} yeni keyword ogrendi`, 'ok');
      if (logDot) { logDot.style.animation = 'none'; logDot.style.background = 'var(--clr-primary)'; }
      showSuccess(result);
    },

    // onError — hata / error
    (errMsg) => {
      appendLog(`Hata: ${errMsg}`, 'error');
      setStatus('error', 'Hata Olustu');
      // Son adımı hata olarak işaretle / Mark last running step as error
      [1,2,3,4].forEach(n => {
        const el = document.getElementById(`step-${n}`);
        if (el?.classList.contains('step-item--active')) renderStep(n, 'error', errMsg);
      });
    },
  );
}

// ============================================================
// Başlat / Start
// ============================================================
startAnalysis();
