/**
 * progress.js — İşlem ekranı mantığı
 * Process page logic: step tracking, log streaming, mock demo
 * Backend hazır olduğunda mock yerine WebSocket kullanılacak
 * When backend is ready, replace mock with WebSocket
 */

// URL parametrelerini oku / Read URL parameters
const params   = new URLSearchParams(window.location.search);
const videoUrl = params.get('url') ?? '';

// ---- Video URL'sini göster / Display video URL ----
const urlEl = document.getElementById('video-url');
if (urlEl) urlEl.textContent = videoUrl;

// Video ID'yi çıkar / Extract video ID
function extractVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    return u.searchParams.get('v') ?? 'unknown';
  } catch { return 'unknown'; }
}
const videoId = extractVideoId(videoUrl);

// ---- Pipeline Adımları Tanımları / Pipeline Step Definitions ----
const STEPS = [
  {
    id: 1,
    title: 'Transcript + Video İndir',
    icon: '⬇️',
    doneDesc: (ctx) => `Transcript: ${ctx.transcriptSource} (${ctx.entryCount} giriş)`,
    progress: 25,
  },
  {
    id: 2,
    title: 'NLP Analizi',
    icon: '🧠',
    doneDesc: (ctx) => `${ctx.smartTimestamps} akıllı timestamp (vs ~${ctx.fixedCount} sabit)`,
    progress: 50,
  },
  {
    id: 3,
    title: 'Frame Çıkarma',
    icon: '📸',
    doneDesc: (ctx) => `${ctx.frameCount} frame başarıyla çıkarıldı`,
    progress: 75,
  },
  {
    id: 4,
    title: 'Storyboard + Wiki',
    icon: '🗂️',
    doneDesc: (ctx) => `${ctx.boardCount} storyboard grid, wiki sayfaları yazıldı`,
    progress: 100,
  },
];

// Durum / State
let currentStep = 0;
const stepTimers = {};
const mockContext = {
  transcriptSource: 'YouTube VTT',
  entryCount: 214,
  smartTimestamps: 18,
  fixedCount: 72,
  frameCount: 18,
  boardCount: 2,
};

// ---- Adım Durum Güncelleme / Step State Update ----
function setStepState(stepNum, state, desc) {
  const el        = document.getElementById(`step-${stepNum}`);
  const icon      = document.getElementById(`step-${stepNum}-icon`);
  const indicator = document.getElementById(`step-${stepNum}-indicator`);
  const descEl    = document.getElementById(`step-${stepNum}-desc`);
  const timeEl    = document.getElementById(`step-${stepNum}-time`);

  if (!el) return;

  // Sınıfları sıfırla / Reset classes
  el.classList.remove('step-item--active', 'step-item--done', 'step-item--error');

  if (state === 'active') {
    el.classList.add('step-item--active');
    indicator.innerHTML = '<div class="spinner"></div>';
    stepTimers[stepNum] = { start: Date.now() };
  } else if (state === 'done') {
    el.classList.add('step-item--done');
    indicator.innerHTML = '<span class="checkmark">✓</span>';
    if (stepTimers[stepNum]) {
      const elapsed = ((Date.now() - stepTimers[stepNum].start) / 1000).toFixed(1);
      timeEl.textContent = `${elapsed}s`;
    }
    if (desc) descEl.textContent = desc;
  } else if (state === 'error') {
    el.classList.add('step-item--error');
    indicator.innerHTML = '<span class="error-mark">✕</span>';
    if (desc) descEl.textContent = desc;
  }
}

// ---- İlerleme Çubuğu / Progress Bar Update ----
function setProgress(pct) {
  const bar     = document.getElementById('progress-bar');
  const pctEl   = document.getElementById('progress-pct');
  const barRole = document.getElementById('progress-bar-role');
  if (bar)     bar.style.width     = `${pct}%`;
  if (pctEl)   pctEl.textContent   = `${pct}%`;
  if (barRole) barRole.setAttribute('aria-valuenow', pct);
}

// ---- Log Ekle / Append Log Line ----
function appendLog(msg, level = 'info') {
  const body = document.getElementById('log-body');
  if (!body) return;

  const now  = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

  const line = document.createElement('div');
  line.className = `log-line log-line--${level}`;
  line.innerHTML = `
    <span class="log-line__time">${time}</span>
    <span class="log-line__msg">${msg}</span>
  `;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

// ---- Log Temizle / Clear Logs ----
document.getElementById('clear-log-btn')?.addEventListener('click', () => {
  const body = document.getElementById('log-body');
  if (body) body.innerHTML = '';
});

// ---- Durum Badge Güncelle / Update Status Badge ----
function setStatus(type, text) {
  const badge  = document.getElementById('status-badge');
  const textEl = document.getElementById('status-text');
  if (!badge || !textEl) return;

  badge.className = `status-badge status-badge--${type}`;
  textEl.textContent = text;
}

// ---- Başarı Banner'ı / Show Success Banner ----
function showSuccess(context) {
  const banner = document.getElementById('success-banner');
  const sub    = document.getElementById('success-sub');
  const link   = document.getElementById('view-storyboard-btn');

  if (!banner) return;
  if (sub)  sub.textContent  = `${context.frameCount} frame → ${context.boardCount} storyboard grid üretildi.`;
  if (link) link.href        = `viewer.html?video_id=${videoId}`;

  banner.hidden = false;
}

// ---- MOCK Demo Pipeline / Demo pipeline without backend ----
// Backend hazır olduğunda bu fonksiyon WebSocket ile değiştirilecek
// Replace this with WebSocket when backend is ready
async function runMockPipeline() {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // Adım 1: İndir / Step 1: Download
  setStepState(1, 'active');
  setProgress(5);
  appendLog(`watch-youtube "${videoUrl}" başlatıldı`, 'info');
  appendLog('Step 1/4 ▸ Downloading transcript + video...', 'info');
  await delay(1200);
  appendLog(`yt-dlp: Video ID ${videoId} bulundu`, 'ok');
  await delay(800);
  appendLog('VTT altyazı indirildi (214 giriş)', 'ok');
  setStepState(1, 'done', mockContext.transcriptSource + ` (${mockContext.entryCount} giriş)`);
  setProgress(25);

  // Adım 2: NLP / Step 2: NLP
  setStepState(2, 'active');
  appendLog('Step 2/4 ▸ Analyzing transcript for smart timestamps...', 'info');
  await delay(600);
  appendLog('spaCy en_core_web_sm yüklendi', 'ok');
  await delay(900);
  appendLog('Rule A (keyword): 14 eşleşme bulundu', 'ok');
  await delay(500);
  appendLog('Rule B (silence): 4 sessizlik boşluğu tespit edildi', 'ok');
  await delay(400);
  appendLog(`18 akıllı timestamp seçildi (vs ~72 sabit)`, 'ok');
  setStepState(2, 'done', `${mockContext.smartTimestamps} timestamp (vs ~${mockContext.fixedCount} sabit)`);
  setProgress(50);

  // Adım 3: Frame / Step 3: Frame
  setStepState(3, 'active');
  appendLog('Step 3/4 ▸ Extracting frames with ffmpeg...', 'info');
  for (let i = 1; i <= 18; i++) {
    await delay(80);
    if (i % 6 === 0) appendLog(`  → ${i}/18 frame çıkarıldı`, 'info');
  }
  appendLog('18 frame başarıyla çıkarıldı', 'ok');
  setStepState(3, 'done', `${mockContext.frameCount} frame çıkarıldı`);
  setProgress(75);

  // Adım 4: Storyboard / Step 4: Storyboard
  setStepState(4, 'active');
  appendLog('Step 4/4 ▸ Compiling storyboard grids...', 'info');
  await delay(700);
  appendLog('storyboard_page_001.jpg → 284 KB', 'ok');
  await delay(400);
  appendLog('storyboard_page_002.jpg → 201 KB', 'ok');
  await delay(300);
  appendLog('Keyword store: 3 yeni terim öğrenildi', 'ok');
  appendLog('═══════════════════════════════════════════', 'info');
  appendLog('  Done in 14.3s', 'ok');
  appendLog('  18 akıllı frame → 2 storyboard grid', 'ok');
  setStepState(4, 'done', `${mockContext.boardCount} storyboard grid oluşturuldu`);
  setProgress(100);

  // Tamamlandı / Done
  setStatus('done', 'Tamamlandı');
  document.getElementById('log-dot')?.style.setProperty('animation', 'none');
  document.getElementById('log-dot')?.style.setProperty('background', 'var(--clr-primary)');

  showSuccess(mockContext);
}

// ---- Başlat / Start ----
setStatus('running', 'Çalışıyor');
runMockPipeline();
