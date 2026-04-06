class NavbarComponent extends HTMLElement {
  connectedCallback() {
    const userData = JSON.parse(sessionStorage.getItem("userActive"));

    let userRole = null;
    if (userData) {
      if (userData.role) {
        userRole = userData.role;
      } else if (userData.kelas !== undefined) {
        userRole = 'siswa';
      } else {
        userRole = 'siswa';
      }
    }

    let navMenu = '';
    let authSection = '';

    if (userData) {
      const displayName = userData.nama || 'Pengguna';
      const displayRole = userRole === 'admin' ? 'Administrator'
                        : userRole === 'guru'  ? 'Guru'
                        : `Siswa${userData.kelas ? ' Kelas ' + userData.kelas : ''}`;

      authSection = `
        <div class="auth-section">
          <div class="auth-avatar">${displayName.charAt(0).toUpperCase()}</div>
          <div class="auth-info">
            <div class="auth-name">${displayName}</div>
            <div class="auth-role">${displayRole}</div>
          </div>
          <button id="btnLogout" class="btn-logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Keluar
          </button>
        </div>
      `;

      if (userRole === 'admin') {
        navMenu = `
          <li><a href="/admin/index.html">Dashboard</a></li>
          <li><a href="/admin/kelola_buku.html">Kelola Buku</a></li>
          <li><a href="/admin/data_siswa.html">Data Siswa</a></li>
          <li><a href="/admin/laporan_kunjungan.html">Laporan Kunjungan</a></li>
          <li><a href="/admin/laporan_peminjaman.html">Laporan Peminjaman</a></li>
        `;
      } else if (userRole === 'guru') {
        navMenu = `
          <li><a href="/guru/index.html">Dashboard</a></li>
          <li><a href="/guru/koleksi.html">Koleksi</a></li>
          <li><a href="/guru/validasi.html">Validasi</a></li>
        `;
      } else {
        navMenu = `
          <li><a href="/siswa/index.html">Dashboard</a></li>
          <li><a href="/siswa/pinjambuku.html">Pinjam Buku</a></li>
          <li><a href="/siswa/kunjungan.html">Kunjungan</a></li>
          <li><a href="/siswa/riwayat.html">Riwayat</a></li>
          <li><a href="/siswa/pengembalian.html">Pengembalian</a></li>
        `;
      }
    } else {
      navMenu = '';
      authSection = `
        <div class="nav-guest">
          <button class="btn-login" onclick="window.location.href='login.html'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Masuk
          </button>
        </div>
      `;
    }

    this.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

      :host { display: block; font-family: 'Sora', sans-serif; }

      /* ── VARIABLES ── */
      :host {
        --nav-bg: #ffffff;
        --nav-border: rgba(0,0,0,0.08);
        --accent: #7C6BF2;
        --accent-2: #5AB4F5;
        --accent-glow: rgba(124,107,242,0.25);
        --text-primary: #1a1a2e;
        --text-muted: #6b6e8a;
        --text-dim: #4a4d6a;
        --surface: rgba(0,0,0,0.04);
        --surface-hover: rgba(124,107,242,0.08);
        --danger: #e53e3e;
        --danger-bg: rgba(229,62,62,0.08);
        --radius: 10px;
      }

      /* ── NAVBAR ── */
      .navbar {
        background: var(--nav-bg);
        border-bottom: 1px solid var(--nav-border);
        height: 64px;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 200;
        gap: 1.25rem;
        box-shadow: 0 1px 12px rgba(0,0,0,0.07);
      }

      /* Subtle top gradient line */
      .navbar::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent 0%, var(--accent) 40%, var(--accent-2) 60%, transparent 100%);
        opacity: 0.7;
      }

      /* ── LOGO ── */
      .nav-logo {
        display: flex;
        align-items: center;
        gap: 11px;
        text-decoration: none;
        flex-shrink: 0;
      }
      .logo-wrapper {
        width: 36px; height: 36px;
        border-radius: 10px;
        overflow: hidden;
        display: flex; align-items: center; justify-content: center;
        background: var(--surface);
        border: 1px solid var(--nav-border);
        flex-shrink: 0;
      }
      .main-logo { width: 100%; height: 100%; object-fit: contain; }
      .logo-text  { display: flex; flex-direction: column; line-height: 1.25; }
      .brand-name {
        font-size: 0.88rem; font-weight: 800;
        color: var(--text-primary);
        letter-spacing: -0.02em;
      }
      .brand-name span {
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      }
      .school-name {
        font-size: 0.6rem; font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.8px;
      }

      /* ── PILL CONTAINER for nav links ── */
      .nav-pill {
        background: var(--surface);
        border: 1px solid var(--nav-border);
        border-radius: 14px;
        padding: 4px;
        display: flex;
        align-items: center;
        gap: 2px;
        flex: 1;
        justify-content: center;
        overflow: hidden;
      }

      .nav-links {
        display: flex;
        gap: 2px;
        list-style: none;
        flex-wrap: nowrap;
        margin: 0; padding: 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .nav-links::-webkit-scrollbar { display: none; }

      .nav-links a {
        text-decoration: none;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-dim);
        padding: 0.38rem 0.85rem;
        border-radius: 10px;
        transition: all 0.18s ease;
        white-space: nowrap;
        display: block;
        letter-spacing: 0.01em;
      }
      .nav-links a:hover {
        color: var(--accent);
        background: var(--surface-hover);
      }
      .nav-links a.active {
        color: #fff;
        background: linear-gradient(135deg, var(--accent), #5E6CE0);
        box-shadow: 0 2px 12px var(--accent-glow);
      }

      /* ── AUTH SECTION ── */
      .nav-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }

      .auth-section {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .auth-avatar {
        width: 32px; height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        display: flex; align-items: center; justify-content: center;
        font-size: 0.75rem; font-weight: 800;
        color: #fff;
        flex-shrink: 0;
        box-shadow: 0 2px 8px var(--accent-glow);
      }

      .auth-info { text-align: left; line-height: 1.25; }
      .auth-name {
        font-size: 0.78rem; font-weight: 700;
        color: var(--text-primary);
        max-width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .auth-role {
        font-size: 0.62rem; font-weight: 600;
        color: var(--text-muted);
        letter-spacing: 0.3px;
      }

      /* ── LOGOUT BUTTON (putih dengan border merah) ── */
      .btn-logout {
        display: flex; align-items: center; gap: 6px;
        padding: 0.42rem 0.85rem;
        border-radius: var(--radius);
        border: 1.5px solid rgba(229,62,62,0.3);
        color: var(--danger);
        background: #fff;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.75rem;
        transition: 0.18s;
        white-space: nowrap;
        letter-spacing: 0.01em;
        box-shadow: 0 1px 4px rgba(229,62,62,0.1);
      }
      .btn-logout:hover {
        background: var(--danger-bg);
        border-color: rgba(229,62,62,0.6);
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(229,62,62,0.15);
      }
      .btn-logout svg { flex-shrink: 0; }

      /* Guest */
      .nav-guest { display: flex; align-items: center; }
      .btn-login {
        display: flex; align-items: center; gap: 7px;
        background: linear-gradient(135deg, var(--accent), #5E6CE0);
        color: white; border: none;
        padding: 0.5rem 1.1rem;
        border-radius: var(--radius);
        font-size: 0.8rem; font-weight: 700;
        cursor: pointer; font-family: inherit;
        box-shadow: 0 3px 14px var(--accent-glow);
        transition: 0.2s; white-space: nowrap;
        letter-spacing: 0.01em;
      }
      .btn-login:hover { transform: translateY(-1px); box-shadow: 0 6px 20px var(--accent-glow); }

      /* ── HAMBURGER ── */
      .hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        cursor: pointer;
        background: var(--surface);
        border: 1px solid var(--nav-border);
        border-radius: var(--radius);
        padding: 8px 9px;
        transition: 0.18s;
        flex-shrink: 0;
      }
      .hamburger:hover { background: var(--surface-hover); border-color: var(--accent); }
      .hbar {
        width: 18px; height: 2px;
        background: #1a1a2e;
        border-radius: 2px;
        transition: all 0.25s;
        transform-origin: center;
        display: block;
      }
      .hamburger:hover .hbar { background: var(--accent); }
      .hamburger.open .hbar:nth-child(1) { transform: translateY(7px) rotate(45deg); background: var(--accent); }
      .hamburger.open .hbar:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .hamburger.open .hbar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: var(--accent); }

      /* ── MOBILE DRAWER ── */
      .mobile-menu {
        display: none;
        position: fixed;
        top: 64px;
        left: 0; right: 0;
        background: #ffffff;
        border-bottom: 1px solid var(--nav-border);
        box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        z-index: 199;
        padding: 0.5rem 1rem 1.25rem;
        animation: slideDown 0.22s ease;
        max-height: calc(100vh - 64px);
        overflow-y: auto;
      }
      .mobile-menu.show { display: block; }
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: none; }
      }

      .mobile-links { list-style: none; margin-bottom: 0.75rem; padding: 0; }
      .mobile-links li { border-bottom: 1px solid var(--nav-border); }
      .mobile-links li:last-child { border-bottom: none; }
      .mobile-links a {
        display: flex; align-items: center;
        padding: 0.85rem 0.5rem;
        text-decoration: none;
        font-size: 0.85rem; font-weight: 600;
        color: var(--text-dim);
        transition: 0.15s;
      }
      .mobile-links a:hover { color: var(--accent); padding-left: 1rem; }
      .mobile-links a.active { color: var(--accent); }

      /* User info in mobile */
      .mobile-user {
        background: #f7f8fc;
        border: 1px solid var(--nav-border);
        border-radius: 12px;
        padding: 0.85rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-top: 0.25rem;
      }
      .mobile-user-left { display: flex; align-items: center; gap: 10px; }
      .mobile-avatar {
        width: 34px; height: 34px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        display: flex; align-items: center; justify-content: center;
        font-size: 0.78rem; font-weight: 800; color: #fff;
        flex-shrink: 0;
      }
      .mobile-user-info .mu-name { font-size: 0.82rem; font-weight: 700; color: var(--text-primary); }
      .mobile-user-info .mu-role { font-size: 0.64rem; font-weight: 600; color: var(--text-muted); margin-top: 0.1rem; }

      /* ── MOBILE LOGOUT (putih dengan border merah) ── */
      .mobile-logout {
        display: flex; align-items: center; gap: 5px;
        padding: 0.42rem 0.85rem;
        border-radius: var(--radius);
        border: 1.5px solid rgba(229,62,62,0.3);
        color: var(--danger);
        background: #fff;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.74rem;
        flex-shrink: 0;
        transition: 0.15s;
        box-shadow: 0 1px 4px rgba(229,62,62,0.1);
      }
      .mobile-logout:hover {
        background: var(--danger-bg);
        border-color: rgba(229,62,62,0.5);
      }

      .mobile-login {
        width: 100%;
        background: linear-gradient(135deg, var(--accent), #5E6CE0);
        color: white; border: none;
        padding: 0.78rem;
        border-radius: 11px;
        font-size: 0.85rem; font-weight: 700;
        cursor: pointer; font-family: inherit;
        margin-top: 0.5rem;
        box-shadow: 0 3px 14px var(--accent-glow);
      }

      /* ── OVERLAY ── */
      .nav-overlay {
        display: none;
        position: fixed;
        inset: 0;
        top: 64px;
        background: rgba(0,0,0,0.25);
        z-index: 198;
        backdrop-filter: blur(2px);
      }
      .nav-overlay.show { display: block; }

      /* ── RESPONSIVE ── */
      @media (max-width: 960px) {
        .nav-pill     { display: none; }
        .auth-section { display: none; }
        .nav-guest    { display: none; }
        .hamburger    { display: flex; }
      }

      @media (max-width: 480px) {
        .navbar { padding: 0 1rem; height: 60px; }
        .school-name { display: none; }
        .mobile-menu { top: 60px; }
        .nav-overlay { top: 60px; }
      }
    </style>

    <!-- OVERLAY -->
    <div class="nav-overlay" id="navOverlay"></div>

    <nav class="navbar">
      <!-- Logo -->
      <a href="index.html" class="nav-logo">
        <div class="logo-wrapper">
          <img src="/assets/logo-smk-BARU BANGET copy.png" alt="Logo SMK" class="main-logo">
        </div>
        <div class="logo-text">
          <span class="brand-name">Perpus SMK Bina Informatika</span></span>
          <span class="school-name"></span>
        </div>
      </a>

      <!-- Desktop nav links inside pill -->
      <div class="nav-pill">
        <ul class="nav-links">${navMenu}</ul>
      </div>

      <!-- Desktop auth -->
      <div class="nav-right">${authSection}</div>

      <!-- Hamburger -->
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span class="hbar"></span>
        <span class="hbar"></span>
        <span class="hbar"></span>
      </button>
    </nav>

    <!-- Mobile Drawer -->
    <div class="mobile-menu" id="mobileMenu">
      <ul class="mobile-links" id="mobileLinks">
        ${navMenu}
      </ul>

      ${userData
        ? `<div class="mobile-user">
            <div class="mobile-user-left">
              <div class="mobile-avatar">${(userData.nama || 'U').charAt(0).toUpperCase()}</div>
              <div class="mobile-user-info">
                <div class="mu-name">${userData.nama || 'Pengguna'}</div>
                <div class="mu-role">${userRole === 'admin' ? 'Administrator' : userRole === 'guru' ? 'Guru' : 'Siswa' + (userData.kelas ? ' · Kelas ' + userData.kelas : '')}</div>
              </div>
            </div>
            <button class="mobile-logout" id="mobileLogout">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Keluar
            </button>
          </div>`
        : `<button class="mobile-login" onclick="window.location.href='login.html'">Masuk</button>`
      }
    </div>
    `;

    // ── Active link highlight ──
    const currentPath = window.location.pathname;
    this.querySelectorAll("a").forEach(a => {
      if (a.href && new URL(a.href).pathname === currentPath && currentPath !== "/") {
        a.classList.add("active");
      }
    });

    // ── Hamburger toggle ──
    const hamburger  = this.querySelector("#hamburger");
    const mobileMenu = this.querySelector("#mobileMenu");
    const overlay    = this.querySelector("#navOverlay");

    const openMenu  = () => { mobileMenu.classList.add("show"); overlay.classList.add("show"); hamburger.classList.add("open"); document.body.style.overflow = "hidden"; };
    const closeMenu = () => { mobileMenu.classList.remove("show"); overlay.classList.remove("show"); hamburger.classList.remove("open"); document.body.style.overflow = ""; };

    hamburger.addEventListener("click", () => mobileMenu.classList.contains("show") ? closeMenu() : openMenu());
    overlay.addEventListener("click", closeMenu);
    this.querySelectorAll(".mobile-links a").forEach(a => a.addEventListener("click", closeMenu));

    // ── Logout ──
    const logoutAction = () => { sessionStorage.clear(); window.location.href = '../login.html'; };
    const btnLogout    = this.querySelector("#btnLogout");
    const mobileLogout = this.querySelector("#mobileLogout");
    if (btnLogout)    btnLogout.onclick    = logoutAction;
    if (mobileLogout) mobileLogout.onclick = logoutAction;

    // ── Close on resize ──
    window.addEventListener("resize", () => { if (window.innerWidth > 960) closeMenu(); });
  }
}

customElements.define('navbar-component', NavbarComponent);