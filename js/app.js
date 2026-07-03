// app.js — Core app: sidebar, nav, role-based UI rendering

Auth.requireAuth();

const user = Auth.getUser();

// SVG icons (inline, simple)
const ICONS = {
  dashboard: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>',
  workorders: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="1" width="12" height="2"/><rect x="2" y="5" width="12" height="2"/><rect x="2" y="9" width="8" height="2"/><rect x="2" y="13" width="6" height="2"/></svg>',
  spareparts: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="14" height="6"/></svg>',
  users: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6H2z"/></svg>',
  audit: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="2"/><rect x="1" y="5" width="10" height="2"/><rect x="1" y="9" width="12" height="2"/><rect x="1" y="13" width="8" height="2"/></svg>',
  logout: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M6 2H2v12h4v-2H4V4h2V2zm4 3l-1.4 1.4L10.2 8H5v2h5.2l-1.6 1.6L10 13l4-4-4-4z"/></svg>',
};

const NAV_CONFIG = {
  manager: [
    { id: 'dashboard', label: 'Dashboard', page: 'dashboard.html', icon: 'dashboard' },
    { id: 'workorders', label: 'Work Order', page: 'work-orders.html', icon: 'workorders' },
    { id: 'spareparts', label: 'Sparepart & Stok', page: 'spareparts.html', icon: 'spareparts' },
    { id: 'users', label: 'Manajemen User', page: 'users.html', icon: 'users' },
  ],
  ca: [
    { id: 'dashboard', label: 'Dashboard', page: 'dashboard.html', icon: 'dashboard' },
    { id: 'workorders', label: 'Work Order', page: 'work-orders.html', icon: 'workorders' },
  ],
  mekanik: [
    { id: 'dashboard', label: 'Dashboard', page: 'dashboard.html', icon: 'dashboard' },
    { id: 'workorders', label: 'Work Order Saya', page: 'work-orders.html', icon: 'workorders' },
    { id: 'spareparts', label: 'Cek Sparepart', page: 'spareparts.html', icon: 'spareparts' },
  ],
  sparepart: [
    { id: 'dashboard', label: 'Dashboard', page: 'dashboard.html', icon: 'dashboard' },
    { id: 'sparepart', label: 'Departemen Sparepart', page: 'sparepart.html', icon: 'spareparts' },
    { id: 'workorders', label: 'Work Order', page: 'work-orders.html', icon: 'workorders' },
  ],
  kasir: [
    { id: 'dashboard', label: 'Dashboard', page: 'dashboard.html', icon: 'dashboard' },
    { id: 'workorders', label: 'Antrian Pembayaran', page: 'work-orders.html', icon: 'workorders' },
  ],
};

const ROLE_LABELS = {
  manager: 'Manager', ca: 'Customer Advisor',
  mekanik: 'Mekanik', sparepart: 'Sparepart', kasir: 'Kasir',
};

function renderSidebar(activeId) {
  const nav = NAV_CONFIG[user.role] || [];
  const items = nav.map(item => `
    <button class="nav-item ${item.id === activeId ? 'active' : ''}"
            onclick="navigate('${item.page}')">
      <span class="nav-icon">${ICONS[item.icon] || ''}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

  const initials = (user.nama_lengkap || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#cc0000">
            <rect width="20" height="20"/>
            <path d="M4 16 L10 4 L16 16 Z" fill="white"/>
          </svg>
        </div>
        <div>
          <div class="sidebar-title">GR-Connect</div>
          <div class="sidebar-subtitle">Bengkel Management</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Menu</div>
          ${items}
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">${initials}</div>
          <div class="user-info">
            <div class="user-name">${Utils.escapeHtml(user.nama_lengkap)}</div>
            <div class="user-role">${ROLE_LABELS[user.role] || user.role}</div>
          </div>
          <button class="logout-btn" onclick="handleLogout()" title="Logout">${ICONS.logout}</button>
        </div>
      </div>
    </aside>
  `;
}

// ── Mobile Menu (Hamburger + Overlay) ──
function initMobileMenu() {
  // Cegah duplikasi jika dipanggil ulang
  if (document.getElementById('hamburger-btn')) return;

  // 1. Inject tombol hamburger ke .page-header-inner atau .page-hdr (fallback halaman sparepart)
  const headerInner = document.querySelector('.page-header-inner') || document.querySelector('.page-hdr');
  if (headerInner) {
    const hamburger = document.createElement('button');
    hamburger.id = 'hamburger-btn';
    hamburger.className = 'hamburger-btn';
    hamburger.setAttribute('aria-label', 'Buka/Tutup Menu');
    hamburger.innerHTML = '&#9776;';
    hamburger.style.display = 'inline-flex';
    hamburger.addEventListener('click', handleHamburgerClick);

    // Ambil elemen judul (first child)
    const titleDiv = headerInner.firstElementChild;
    // Jika ada judul dan bukan elemen page-actions, wrap mereka agar alignment rapi
    if (titleDiv && !titleDiv.classList.contains('page-actions')) {
      const leftGroup = document.createElement('div');
      leftGroup.style.display = 'flex';
      leftGroup.style.alignItems = 'center';
      leftGroup.style.gap = '15px';
      
      headerInner.insertBefore(leftGroup, titleDiv);
      leftGroup.appendChild(hamburger);
      leftGroup.appendChild(titleDiv);
    } else {
      headerInner.insertBefore(hamburger, headerInner.firstChild);
    }
  }

  // 2. Buat overlay (hanya dipakai di mobile)
  if (!document.getElementById('sidebar-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', closeMobileSidebar);
    document.body.appendChild(overlay);
  }

  // 3. Reset sidebar ke full saat resize ke desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileSidebar();
    }
  });
}

// Logika klik hamburger: dual-mode (desktop mini vs mobile open)
function handleHamburgerClick() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  if (!sidebar) return;

  if (window.innerWidth > 768) {
    sidebar.classList.toggle('mini');
    if (mainContent) mainContent.classList.toggle('mini-offset');
  } else {
    toggleMobileSidebar();
  }
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    closeMobileSidebar();
  } else {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

function navigate(page) {
  window.location.href = page;
}

async function handleLogout() {
  await API.logout();
  Auth.clearSession();
  window.location.href = 'index.html';
}

// ── Utility Helpers ──
const Utils = {
  formatCurrency: (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0),

  formatDate: (str) => {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  formatDateTime: (str) => {
    if (!str) return '-';
    return new Date(str).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },

  statusBadge: (status) => {
    const labels = {
      antrean:           'Antrean',
      dikerjakan:        'Dikerjakan',
      nunggu_part:       'Nunggu Part',
      menunggu_audit:    'Menunggu Audit',
      audit_ditolak:     'Audit Ditolak',
      nunggu_pembayaran: 'Nunggu Bayar',
      selesai:           'Selesai',
      lunas:             'Lunas',
      belum_lunas:       'Belum Lunas',
      pending:           'Pending',
      approved:          'Approved',
      rejected:          'Rejected',
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
  },

  escapeHtml: (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  showLoading: (container) => {
    container.innerHTML = `
      <tr><td colspan="10">
        <div class="loading-state">
          <svg class="spinner" width="28" height="28" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#cc0000" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/>
          </svg>
          <span>Memuat data...</span>
        </div>
      </td></tr>`;
  },

  showEmpty: (container, msg = 'Tidak ada data') => {
    container.innerHTML = `
      <tr><td colspan="10">
        <div class="empty-state">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="#aaa"><rect x="5" y="5" width="30" height="30" fill="none" stroke="#aaa" stroke-width="2"/><line x1="5" y1="5" x2="35" y2="35" stroke="#aaa" stroke-width="2"/></svg>
          <span>${Utils.escapeHtml(msg)}</span>
        </div>
      </td></tr>`;
  },

  closeModal: (id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  },
};

// ── Auto-init setelah DOM siap ──
document.addEventListener('DOMContentLoaded', () => initMobileMenu());