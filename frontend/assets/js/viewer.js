/**
 * viewer.js — Storyboard görüntüleyici
 * Gerçek backend'den storyboard ve metadata yükler.
 * Loads storyboards and metadata from real backend.
 */

import { getStoryboards, storyboardUrl, getJobStatus } from '../assets/js/api.js';

// ============================================================
// URL Parametreleri / URL Parameters
// ============================================================
const params  = new URLSearchParams(window.location.search);
const videoId = params.get('video_id') ?? '';
const jobId   = params.get('job_id')   ?? '';

// ============================================================
// Durum / State
// ============================================================
let pages        = [];
let currentPage  = 1;

// ============================================================
// Sayfa Başlatma / Page Initialization
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  if (!videoId) {
    showError('video_id parametresi eksik. Lütfen analiz sayfasından gelin.');
    return;
  }

  await loadStoryboards();
  setupLightbox();
  setupPageNav();
  if (jobId) await loadMetadata();
});

// ============================================================
// Storyboard Yükleme / Load Storyboards
// ============================================================
async function loadStoryboards() {
  try {
    const data = await getStoryboards(videoId);
    pages = data.pages ?? [];

    if (pages.length === 0) {
      showError('Bu video için storyboard bulunamadı.');
      return;
    }

    renderSidebar();
    showPage(1);
    updatePageNav();

  } catch (err) {
    showError(`Storyboard yüklenemedi: ${err.message}`);
  }
}

// ============================================================
// Sidebar Oluşturma / Render Sidebar
// ============================================================
function renderSidebar() {
  const list = document.getElementById('sidebar-list');
  if (!list) return;
  list.innerHTML = '';

  pages.forEach((page, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="sidebar__item ${idx === 0 ? 'sidebar__item--active' : ''}"
           id="sidebar-item-${idx}"
           role="button" tabindex="0"
           aria-label="${page.filename} sayfasını göster"
           aria-pressed="${idx === 0}">
        <img
          class="sidebar__item-thumb"
          src="${storyboardUrl(videoId, page.filename)}"
          alt="${page.filename} önizleme"
          loading="lazy"
          onerror="this.style.display='none'"
        />
        <div class="sidebar__item-info">
          <div class="sidebar__item-name">${page.filename}</div>
          <div class="sidebar__item-size">${page.size_kb} KB</div>
        </div>
      </div>
    `;

    const itemEl = li.querySelector('.sidebar__item');
    const activate = () => {
      document.querySelectorAll('.sidebar__item').forEach(el => {
        el.classList.remove('sidebar__item--active');
        el.setAttribute('aria-pressed', 'false');
      });
      itemEl.classList.add('sidebar__item--active');
      itemEl.setAttribute('aria-pressed', 'true');
      showPage(idx + 1);
    };
    itemEl.addEventListener('click', activate);
    itemEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });

    list.appendChild(li);
  });
}

// ============================================================
// Sayfa Göster / Show Page
// ============================================================
function showPage(pageNum) {
  currentPage = pageNum;
  const page = pages[pageNum - 1];
  if (!page) return;

  // Başlık / Title
  const titleEl = document.getElementById('viewer-title');
  if (titleEl) titleEl.textContent = `Sayfa ${pageNum} / ${pages.length}`;

  // Storyboard görseli / Storyboard image
  const wrap = document.getElementById('storyboard-img-wrap');
  if (wrap) {
    const imgUrl = storyboardUrl(videoId, page.filename);
    wrap.innerHTML = `
      <img
        class="storyboard-img"
        src="${imgUrl}"
        alt="${page.filename} storyboard"
        id="storyboard-img"
        loading="lazy"
      />
    `;
    // Lightbox için / For lightbox
    wrap.querySelector('img')?.addEventListener('click', () => openLightbox(imgUrl));
  }

  // Lightbox img / Lightbox image src
  const lbImg = document.getElementById('lightbox-img');
  if (lbImg) lbImg.src = storyboardUrl(videoId, page.filename);

  updatePageNav();
}

// ============================================================
// Sayfa Navigasyonu / Page Navigation
// ============================================================
function setupPageNav() {
  document.getElementById('prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      activateSidebarItem(currentPage - 1);
      showPage(currentPage);
    }
  });
  document.getElementById('next-page')?.addEventListener('click', () => {
    if (currentPage < pages.length) {
      currentPage++;
      activateSidebarItem(currentPage - 1);
      showPage(currentPage);
    }
  });
}

function updatePageNav() {
  const infoEl  = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  if (infoEl)  infoEl.textContent = `${currentPage} / ${pages.length}`;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= pages.length;
}

function activateSidebarItem(idx) {
  document.querySelectorAll('.sidebar__item').forEach((el, i) => {
    el.classList.toggle('sidebar__item--active', i === idx);
    el.setAttribute('aria-pressed', String(i === idx));
  });
}

// ============================================================
// Metadata Yükleme (iş sonuçlarından) / Load Metadata from job
// ============================================================
async function loadMetadata() {
  try {
    const job = await getJobStatus(jobId);
    if (!job?.result) return;

    const r = job.result;

    // Özet güncelle / Update summary
    updateSummary(r);

    // Timestamp listesi / Timestamps list — backend'den gelecek şekilde genişletilebilir
    // Can be extended when backend returns timestamp details
  } catch {
    // Sessizce geç / Fail silently
  }
}

function updateSummary(result) {
  const container = document.querySelector('.meta-panel .glass-card');
  if (!container) return;
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:var(--sp-2)">
      <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)">
        <span style="color:var(--clr-text-2)">Akıllı Frame</span>
        <span style="font-weight:700;color:var(--clr-green)">${result.frame_count}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)">
        <span style="color:var(--clr-text-2)">Sabit Aralık (~30s)</span>
        <span style="font-weight:700;color:var(--clr-text-3)">~${result.fixed_count}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)">
        <span style="color:var(--clr-text-2)">Tasarruf</span>
        <span style="font-weight:700;color:var(--clr-primary)">%${Math.round((1 - result.frame_count / result.fixed_count) * 100)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)">
        <span style="color:var(--clr-text-2)">Storyboard</span>
        <span style="font-weight:700">${result.board_count}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)">
        <span style="color:var(--clr-text-2)">Süre</span>
        <span style="font-weight:700">${result.elapsed_sec?.toFixed(1)}s</span>
      </div>
    </div>
  `;
}

// ============================================================
// Lightbox
// ============================================================
function setupLightbox() {
  const overlay = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightbox-close');

  closeBtn?.addEventListener('click', closeLightbox);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  document.getElementById('zoom-btn')?.addEventListener('click', () => {
    const img = document.getElementById('storyboard-img');
    if (img) openLightbox(img.src);
  });
}

function openLightbox(src) {
  const overlay = document.getElementById('lightbox');
  const img     = document.getElementById('lightbox-img');
  if (!overlay) return;
  if (img && src) img.src = src;
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('is-open');
  document.body.style.overflow = '';
}

// ============================================================
// İndir Butonu / Download Button
// ============================================================
document.getElementById('download-btn')?.addEventListener('click', () => {
  const page = pages[currentPage - 1];
  if (!page) return;
  const a = document.createElement('a');
  a.href = storyboardUrl(videoId, page.filename);
  a.download = page.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// ============================================================
// Hata Göster / Show Error
// ============================================================
function showError(msg) {
  const main = document.getElementById('viewer-main');
  if (!main) return;
  main.innerHTML = `
    <div style="
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      height:60vh;gap:var(--sp-4);text-align:center;
    ">
      <i data-lucide="alert-circle" style="width:48px;height:48px;color:var(--clr-accent);" aria-hidden="true"></i>
      <p style="font-size:var(--fs-lg);font-weight:700;color:var(--clr-text)">${msg}</p>
      <a href="../index.html" class="btn btn--primary btn--md">Ana Sayfaya Dön</a>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}
