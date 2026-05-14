/**
 * api.js — Backend API istemcisi
 * Backend API client — watch-youtube
 * Tüm HTTP ve WebSocket çağrıları burada / All HTTP and WebSocket calls are here
 */

// Backend base URL — Aynı sunucu üzerindeyse dinamik algılar
// Backend base URL — Detects dynamically if on the same server
const API_BASE = window.location.origin.includes('file://') 
  ? 'http://127.0.0.1:8000' 
  : window.location.origin;

const WS_BASE = API_BASE.replace('http', 'ws');

// ============================================================
// HTTP Yardımcıları / HTTP Helpers
// ============================================================

/**
 * Genel fetch sarmalayıcı — hata yönetimli
 * Generic fetch wrapper with error handling
 * @param {string} path
 * @param {RequestInit} [options]
 */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ============================================================
// Analiz / Analyze
// ============================================================

/**
 * Videoyu analiz kuyruğuna al / Queue video for analysis
 * @param {{url:string, max_frames:number, silence_gap:number, jpeg_quality:number, groq_api_key?:string, verbose:boolean, no_learn:boolean}} params
 * @returns {Promise<{job_id:string, status:string, message:string}>}
 */
export async function analyzeVideo(params) {
  return apiFetch('/api/analyze', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ============================================================
// İş Durumu / Job Status
// ============================================================

/**
 * İş durumunu sorgula / Poll job status
 * @param {string} jobId
 */
export async function getJobStatus(jobId) {
  return apiFetch(`/api/status/${jobId}`);
}

/**
 * Analiz geçmişini getir / Get analysis history
 */
export async function getHistory() {
  return apiFetch('/api/history');
}

// ============================================================
// Storyboard
// ============================================================

/**
 * Video'ya ait storyboard dosyalarını listele / List storyboard files for video
 * @param {string} videoId
 */
export async function getStoryboards(videoId) {
  return apiFetch(`/api/storyboards/${videoId}`);
}

/**
 * Storyboard görsel URL'si üret / Build storyboard image URL
 * @param {string} videoId
 * @param {string} filename
 */
export function storyboardUrl(videoId, filename) {
  return `${API_BASE}/api/storyboards/${videoId}/${filename}`;
}

// ============================================================
// Wiki
// ============================================================

/**
 * Wiki sayfalarını listele / List wiki pages
 * @param {string} [query] - Arama sorgusu / search query
 */
export async function getWikiPages(query = '') {
  const qs = query ? `?q=${encodeURIComponent(query)}` : '';
  return apiFetch(`/api/wiki${qs}`);
}

/**
 * Wiki sayfası metadata'sını getir / Get wiki page metadata
 * @param {string} filename
 */
export async function getWikiPage(filename) {
  return apiFetch(`/api/wiki/${filename}`);
}

/**
 * Wiki sayfası ham Markdown içeriğini getir / Get raw wiki page content
 * @param {string} filename
 */
export async function getWikiContent(filename) {
  const res = await fetch(`${API_BASE}/api/wiki/${filename}/content`);
  if (!res.ok) throw new Error(`Wiki sayfası bulunamadı: ${filename}`);
  return res.text();
}

// ============================================================
// WebSocket — Gerçek zamanlı iş takibi
// Real-time job tracking via WebSocket
// ============================================================

/**
 * İş WebSocket bağlantısı kur / Connect to job WebSocket
 * @param {string} jobId
 * @param {(status:object) => void} onStatus   — adım durumu / step status
 * @param {(result:object) => void} onDone     — tamamlandı / completed
 * @param {(err:string) => void}   onError     — hata / error
 * @returns {WebSocket}
 */
export function connectJobWebSocket(jobId, onStatus, onDone, onError) {
  const ws = new WebSocket(`${WS_BASE}/api/ws/job/${jobId}`);

  ws.onopen = () => console.log(`[WS] Bağlandı: ${jobId}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'status') onStatus(data);
      if (data.type === 'done')   onDone(data.result);
      if (data.type === 'error')  onError(data.message);
    } catch (e) {
      console.warn('[WS] Parse hatası:', e);
    }
  };

  ws.onerror = () => onError('WebSocket bağlantısı kurulamadı. Backend çalışıyor mu?');
  ws.onclose = () => console.log(`[WS] Kapatıldı: ${jobId}`);

  return ws;
}

/**
 * Backend erişilebilirliğini kontrol et / Check backend availability
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
