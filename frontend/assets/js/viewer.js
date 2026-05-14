/**
 * viewer.js — Storyboard görüntüleyici mantığı
 * Storyboard viewer logic: sidebar, lightbox, page navigation
 */

// ---- Sidebar Demo Verisi / Sidebar demo data ----
const DEMO_PAGES = [
  { name: 'storyboard_page_001.jpg', size: '284 KB', active: true },
  { name: 'storyboard_page_002.jpg', size: '201 KB', active: false },
];

const sidebarList = document.getElementById('sidebar-list');
if (sidebarList) {
  DEMO_PAGES.forEach((page, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="sidebar__item ${page.active ? 'sidebar__item--active' : ''}"
           id="sidebar-item-${idx}"
           role="button" tabindex="0"
           aria-label="${page.name} sayfasını göster"
           aria-pressed="${page.active}">
        <div class="sidebar__item-thumb" aria-hidden="true" style="
          background: linear-gradient(135deg, hsl(${240 + idx*40},60%,20%), hsl(${260 + idx*40},60%,30%));
          display:flex; align-items:center; justify-content:center; font-size:10px; color:rgba(255,255,255,0.4);
        ">JPG</div>
        <div class="sidebar__item-info">
          <div class="sidebar__item-name">${page.name}</div>
          <div class="sidebar__item-size">${page.size}</div>
        </div>
      </div>
    `;
    sidebarList.appendChild(li);

    // Tıklama olayı / Click event
    const itemEl = li.querySelector('.sidebar__item');
    if (itemEl) {
      const activate = () => {
        document.querySelectorAll('.sidebar__item').forEach(el => {
          el.classList.remove('sidebar__item--active');
          el.setAttribute('aria-pressed', 'false');
        });
        itemEl.classList.add('sidebar__item--active');
        itemEl.setAttribute('aria-pressed', 'true');
        updatePageInfo(idx + 1);
      };
      itemEl.addEventListener('click', activate);
      itemEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    }
  });
}

// ---- Sayfa Navigasyonu / Page Navigation ----
let currentPage = 1;
const totalPages = DEMO_PAGES.length;

function updatePageInfo(page) {
  currentPage = page;
  const infoEl   = document.getElementById('page-info');
  const prevBtn  = document.getElementById('prev-page');
  const nextBtn  = document.getElementById('next-page');
  if (infoEl)  infoEl.textContent = `${page} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = page <= 1;
  if (nextBtn) nextBtn.disabled = page >= totalPages;
}

document.getElementById('prev-page')?.addEventListener('click', () => {
  if (currentPage > 1) {
    updatePageInfo(currentPage - 1);
    activateSidebarItem(currentPage - 1);
  }
});
document.getElementById('next-page')?.addEventListener('click', () => {
  if (currentPage < totalPages) {
    updatePageInfo(currentPage + 1);
    activateSidebarItem(currentPage);
  }
});

function activateSidebarItem(idx) {
  document.querySelectorAll('.sidebar__item').forEach((el, i) => {
    el.classList.toggle('sidebar__item--active', i === idx - 1);
    el.setAttribute('aria-pressed', String(i === idx - 1));
  });
}

updatePageInfo(1);

// ---- Lightbox / Zoom ----
const lightbox      = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightbox-close');
const imgWrap       = document.getElementById('storyboard-img-wrap');

function openLightbox() {
  if (lightbox) {
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  }
}
function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

imgWrap?.addEventListener('click', openLightbox);
imgWrap?.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(); });
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.getElementById('zoom-btn')?.addEventListener('click', openLightbox);

// ---- İndir Butonu / Download Button ----
document.getElementById('download-btn')?.addEventListener('click', () => {
  // Gerçek backend'de dosya URL'si oluşturulur
  // Real backend will generate file URL
  const link = document.createElement('a');
  link.href = '#';
  link.download = DEMO_PAGES[currentPage - 1]?.name ?? 'storyboard.jpg';
  // link.click(); — backend hazır olduğunda aktif edilecek / activate when backend ready
  alert('İndir butonu backend bağlandığında aktif olacak.');
});
