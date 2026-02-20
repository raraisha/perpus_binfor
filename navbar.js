class NavbarComponent extends HTMLElement {
  connectedCallback() {
    const userData = JSON.parse(sessionStorage.getItem("userActive"));

    let navMenu = '';
    let authSection = '';

    if (userData) {
      authSection = `
        <div class="auth-section">
          <div class="auth-info">
            <div class="auth-name">${userData.nama}</div>
            <div class="auth-role">${userData.role}</div>
          </div>
          <button id="btnLogout" class="btn-logout">Keluar</button>
        </div>
      `;

      if (userData.role === 'admin') {
        navMenu = `
          <li><a href="/admin/index.html">Dashboard</a></li>
          <li><a href="/admin/kelola_buku.html">Kelola Buku</a></li>
          <li><a href="/admin/data_siswa.html">Data Siswa</a></li>
          <li><a href="/admin/laporan_kunjungan.html">Laporan Kunjungan</a></li>
          <li><a href="/admin/laporan_peminjaman.html">Laporan Peminjaman</a></li>
        `;
      } else if (userData.role === 'guru') {
        navMenu = `
          <li><a href="guru_dashboard.html">Dashboard</a></li>
          <li><a href="#">Koleksi</a></li>
          <li><a href="#">Validasi</a></li>
        `;
      } else {
        navMenu = `
          <li><a href="../index.html">Beranda</a></li>
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
        <div class="nav-avatar">👤</div>
        <button class="btn-login" onclick="window.location.href='login.html'">Masuk</button>
      `;
    }

    this.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      :host { display: block; font-family: 'Plus Jakarta Sans', sans-serif; }

      /* ── NAVBAR ── */
      .navbar {
        background: #ffffff;
        border-bottom: 1px solid #ececf5;
        height: 64px;
        padding: 0 2.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 200;
        gap: 1rem;
      }

      /* ── LOGO ── */
      .nav-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        flex-shrink: 0;
      }
      .logo-wrapper {
        width: 36px; height: 36px;
        border-radius: 10px;
        overflow: hidden;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .main-logo { width: 100%; height: 100%; object-fit: contain; }
      .logo-text  { display: flex; flex-direction: column; line-height: 1.2; }
      .brand-name { font-size: 0.95rem; font-weight: 800; color: #1e1e2e; letter-spacing: -0.01em; }
      .brand-name span {
        background: linear-gradient(135deg, #B36FF2, #4B7FF2);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      }
      .school-name { font-size: 0.65rem; font-weight: 600; color: #a0a5be; text-transform: uppercase; letter-spacing: 0.6px; }

      /* ── DESKTOP NAV LINKS ── */
      .nav-links {
        display: flex;
        gap: 0.1rem;
        list-style: none;
        flex: 1;
        justify-content: center;
        flex-wrap: nowrap;
      }
      .nav-links a {
        text-decoration: none;
        font-size: 0.83rem;
        font-weight: 600;
        color: #8b90a7;
        padding: 0.42rem 0.85rem;
        border-radius: 8px;
        transition: all 0.18s ease;
        white-space: nowrap;
        display: block;
      }
      .nav-links a:hover,
      .nav-links a.active { color: #4B7FF2; background: #eef2fe; }

      /* ── AUTH SECTION ── */
      .nav-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
      .auth-section {
        display: flex;
        align-items: center;
        gap: 12px;
        border-left: 1px solid #eee;
        padding-left: 15px;
      }
      .auth-info { text-align: right; line-height: 1.2; }
      .auth-name { font-size: 0.82rem; font-weight: 800; color: #1e1e2e; }
      .auth-role { font-size: 0.68rem; font-weight: 700; color: #B36FF2; text-transform: uppercase; }
      .btn-logout {
        padding: 0.45rem 0.9rem;
        border-radius: 9px;
        border: 1.5px solid #ffeded;
        color: #ff4d4d;
        background: #fff;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.78rem;
        transition: 0.2s;
        white-space: nowrap;
      }
      .btn-logout:hover { background: #fee2e2; }
      .nav-avatar {
        width: 34px; height: 34px;
        border-radius: 50%;
        background: #f0f4fe;
        border: 1.5px solid #dde3f8;
        display: flex; align-items: center; justify-content: center;
        font-size: 1rem;
        cursor: pointer;
      }
      .btn-login {
        background: linear-gradient(135deg, #B36FF2, #4B7FF2);
        color: white; border: none;
        padding: 0.52rem 1.2rem;
        border-radius: 9px;
        font-size: 0.83rem; font-weight: 700;
        cursor: pointer; font-family: inherit;
        box-shadow: 0 3px 12px rgba(107,115,230,0.3);
        transition: 0.2s; white-space: nowrap;
      }
      .btn-login:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(107,115,230,0.4); }

      /* ── HAMBURGER ── */
      .hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        cursor: pointer;
        background: none;
        border: 1.5px solid #ececf5;
        border-radius: 9px;
        padding: 7px 9px;
        transition: 0.18s;
        flex-shrink: 0;
      }
      .hamburger:hover { background: #eef2fe; border-color: #4B7FF2; }
      .hbar {
        width: 18px; height: 2px;
        background: #4B7FF2;
        border-radius: 2px;
        transition: all 0.25s;
        transform-origin: center;
        display: block;
      }
      .hamburger.open .hbar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      .hamburger.open .hbar:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .hamburger.open .hbar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

      /* ── MOBILE DRAWER ── */
      .mobile-menu {
        display: none;
        position: fixed;
        top: 64px;
        left: 0; right: 0;
        background: #ffffff;
        border-bottom: 1px solid #ececf5;
        box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        z-index: 199;
        padding: 0.75rem 1.25rem 1.25rem;
        animation: slideDown 0.22s ease;
        max-height: calc(100vh - 64px);
        overflow-y: auto;
      }
      .mobile-menu.show { display: block; }
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: none; }
      }

      .mobile-links { list-style: none; margin-bottom: 0.75rem; }
      .mobile-links li { border-bottom: 1px solid #f1f5f9; }
      .mobile-links li:last-child { border-bottom: none; }
      .mobile-links a {
        display: flex;
        align-items: center;
        padding: 0.85rem 0.5rem;
        text-decoration: none;
        font-size: 0.88rem;
        font-weight: 600;
        color: #64748b;
        transition: 0.15s;
      }
      .mobile-links a:hover { color: #4B7FF2; padding-left: 1rem; }

      /* User info + logout in mobile */
      .mobile-user {
        background: #f8faff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 0.85rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .mobile-user-info .mu-name { font-size: 0.85rem; font-weight: 800; color: #1e1e2e; }
      .mobile-user-info .mu-role { font-size: 0.68rem; font-weight: 700; color: #B36FF2; text-transform: uppercase; margin-top: 0.1rem; }
      .mobile-logout {
        padding: 0.45rem 0.9rem;
        border-radius: 9px;
        border: 1.5px solid #ffeded;
        color: #ff4d4d;
        background: #fff;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.78rem;
        flex-shrink: 0;
      }
      .mobile-logout:hover { background: #fee2e2; }

      .mobile-login {
        width: 100%;
        background: linear-gradient(135deg, #B36FF2, #4B7FF2);
        color: white; border: none;
        padding: 0.75rem;
        border-radius: 11px;
        font-size: 0.88rem; font-weight: 700;
        cursor: pointer; font-family: inherit;
        margin-top: 0.5rem;
      }

      /* ── OVERLAY ── */
      .nav-overlay {
        display: none;
        position: fixed;
        inset: 0;
        top: 64px;
        background: rgba(0,0,0,0.25);
        z-index: 198;
      }
      .nav-overlay.show { display: block; }

      /* ── RESPONSIVE ── */
      @media (max-width: 960px) {
        .nav-links  { display: none; }
        .auth-section { display: none; }
        .nav-avatar   { display: none; }
        .btn-login    { display: none; }
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
          <span class="brand-name">PERPUSTAKAAN <span></span></span>
          <span class="school-name">SMK Bina Informatika</span>
        </div>
      </a>

      <!-- Desktop nav links -->
      <ul class="nav-links">${navMenu}</ul>

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
        ${navMenu.replace(/<li>/g, '<li>').replace(/<\/li>/g, '</li>')}
      </ul>

      ${userData
        ? `<div class="mobile-user">
            <div class="mobile-user-info">
              <div class="mu-name">${userData.nama}</div>
              <div class="mu-role">${userData.role}</div>
            </div>
            <button class="mobile-logout" id="mobileLogout">Keluar</button>
          </div>`
        : `<button class="mobile-login" onclick="window.location.href='login.html'">Masuk</button>`
      }
    </div>
    `;

    // ── Active link highlight ──
    const currentPath = window.location.pathname;
    this.querySelectorAll("a").forEach(a => {
      if (a.href && a.href.includes(currentPath) && currentPath !== "/") {
        a.classList.add("active");
      }
    });

    // ── Hamburger toggle ──
    const hamburger   = this.querySelector("#hamburger");
    const mobileMenu  = this.querySelector("#mobileMenu");
    const overlay     = this.querySelector("#navOverlay");

    const openMenu  = () => { mobileMenu.classList.add("show"); overlay.classList.add("show"); hamburger.classList.add("open"); document.body.style.overflow = "hidden"; };
    const closeMenu = () => { mobileMenu.classList.remove("show"); overlay.classList.remove("show"); hamburger.classList.remove("open"); document.body.style.overflow = ""; };

    hamburger.addEventListener("click", () => mobileMenu.classList.contains("show") ? closeMenu() : openMenu());
    overlay.addEventListener("click", closeMenu);

    // Close on nav link click
    this.querySelectorAll(".mobile-links a").forEach(a => a.addEventListener("click", closeMenu));

    // ── Logout (desktop + mobile) ──
    const logoutAction = () => { sessionStorage.clear(); window.location.href = '../login.html'; };
    const btnLogout       = this.querySelector("#btnLogout");
    const mobileLogout    = this.querySelector("#mobileLogout");
    if (btnLogout)    btnLogout.onclick    = logoutAction;
    if (mobileLogout) mobileLogout.onclick = logoutAction;

    // ── Close menu on resize ──
    window.addEventListener("resize", () => { if (window.innerWidth > 960) closeMenu(); });
  }
}

customElements.define('navbar-component', NavbarComponent);