/**
 * api.js — Backend API istemcisi
 * Backend API client for watch-youtube
 * Gerçek backend bağlandığında bu dosya kullanılır / Used when real backend is connected
 */

const API_BASE = 'http://localhost:8000';

/**
 * Videoyu analiz için kuyruğa al / Queue video for analysis
 * @param {Object} params
 * @returns {Promise<{job_id: string, status: string}>}
 */
export async function analyzeVideo(params) {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

/**
 * İş durumunu sorgula / Poll job status
 * @param {string} jobId
 * @returns {Promise<JobStatus>}
 */
export async function getJobStatus(jobId) {
  const res = await fetch(`${API_BASE}/api/status/${jobId}`);
  if (!res.ok) throw new Error(`Status Error: ${res.status}`);
  return res.json();
}

/**
 * Storyboard dosyalarını listele / List storyboard files
 * @param {string} videoId
 * @returns {Promise<string[]>}
 */
export async function getStoryboards(videoId) {
  const res = await fetch(`${API_BASE}/api/storyboards/${videoId}`);
  if (!res.ok) throw new Error(`Storyboard Error: ${res.status}`);
  return res.json();
}

/**
 * Wiki sayfalarını listele / List wiki pages
 * @returns {Promise<WikiPage[]>}
 */
export async function getWikiPages() {
  const res = await fetch(`${API_BASE}/api/wiki`);
  if (!res.ok) throw new Error(`Wiki Error: ${res.status}`);
  return res.json();
}

/**
 * Analiz geçmişini getir / Get analysis history
 * @returns {Promise<HistoryItem[]>}
 */
export async function getHistory() {
  const res = await fetch(`${API_BASE}/api/history`);
  if (!res.ok) throw new Error(`History Error: ${res.status}`);
  return res.json();
}

/**
 * WebSocket ile gerçek zamanlı log / Real-time log via WebSocket
 * @param {string} jobId
 * @param {function} onMessage  - (log: string) => void
 * @param {function} onDone     - (result: object) => void
 * @param {function} onError    - (err: string) => void
 * @returns {WebSocket}
 */
export function connectJobWebSocket(jobId, onMessage, onDone, onError) {
  const ws = new WebSocket(`ws://localhost:8000/ws/job/${jobId}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'log')    onMessage(data.message, data.level ?? 'info');
      if (data.type === 'done')   onDone(data.result);
      if (data.type === 'error')  onError(data.message);
    } catch {
      onMessage(event.data, 'info');
    }
  };

  ws.onerror = () => onError('WebSocket bağlantısı kurulamadı.');
  return ws;
}
