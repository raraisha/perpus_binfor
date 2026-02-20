class AdminSidebar extends HTMLElement {
  connectedCallback() {
    const activePage = this.getAttribute("active") || "dashboard";

    const menuItems = [
      { id: "dashboard",    icon: "🏠", label: "Dashboard",    href: "./index.html" },
      { id: "buku",         icon: "📚", label: "Koleksi Buku", href: "./kelola_buku.html" },
      { id: "pinjaman",     icon: "📋", label: "Peminjaman",   href: "./laporan_peminjaman.html" },
      { id: "pengembalian", icon: "📩", label: "Kunjungan", href: "./laporan_kunjungan.html" },
      { id: "anggota",      icon: "👥", label: "Data Anggota", href: "./kelola_user.html" },
      { id: "laporan",      icon: "📊", label: "Laporan",      href: "./laporan.html" },
      { id: "import",       icon: "📥", label: "Import Data", href: "./import.html" },
    ];

    const settingItems = [
      { id: "pengaturan", icon: "⚙️", label: "Pengaturan", href: "./pengaturan.html" },
      { id: "bantuan",    icon: "❓", label: "Bantuan",     href: "./bantuan.html" },
    ];

    const renderItems = (items) => items.map(item => `
      <a href="${item.href}" class="nav-item ${activePage === item.id ? "active" : ""}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
        ${activePage === item.id ? '<span class="active-dot"></span>' : ''}
      </a>
    `).join("");

    this.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :host {
          display: block;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── OVERLAY (mobile) ── */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 99;
          opacity: 0;
          transition: opacity 0.25s;
        }

        .sidebar-overlay.visible {
          opacity: 1;
        }

        /* ── TOGGLE BUTTON ── */
        .sidebar-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 200;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #ffffff;
          border: 1.5px solid #ececf5;
          box-shadow: 0 2px 12px rgba(107,115,230,0.12);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          padding: 0;
          transition: background 0.18s;
        }

        .sidebar-toggle:hover { background: #eef2fe; }

        .toggle-bar {
          width: 18px;
          height: 2px;
          background: #4B7FF2;
          border-radius: 2px;
          transition: all 0.25s;
          transform-origin: center;
        }

        /* Hamburger → X animation */
        .sidebar-toggle.open .toggle-bar:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .sidebar-toggle.open .toggle-bar:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .sidebar-toggle.open .toggle-bar:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ── SIDEBAR SHELL ── */
        .admin-sidebar {
          width: 240px;
          background: #ffffff;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
          border-right: 1px solid #ececf5;
          box-shadow: 2px 0 16px rgba(107,115,230,0.06);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden; /* prevent outer scroll */
        }

        /* ── BRAND ── */
        .sidebar-brand {
          padding: 1.5rem 1.25rem 1.25rem;
          border-bottom: 1px solid #ececf5;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .brand-text    { line-height: 1.2; }
        .brand-title   { font-size: 0.88rem; font-weight: 800; color: #1e1e2e; }
        .brand-sub     { font-size: 0.6rem; color: #a0a5be; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        /* ── USER BLOCK ── */
        .sidebar-user {
          margin: 0.5rem 1rem 0.25rem;
          background: #f0f4fe;
          border: 1px solid #dde3f8;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          flex-shrink: 0;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #B36FF2, #4B7FF2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .user-name { font-size: 0.8rem; font-weight: 700; color: #1e1e2e; }
        .user-role {
          font-size: 0.62rem;
          color: #B36FF2;
          font-weight: 700;
          text-transform: uppercase;
          margin-top: 0.1rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        /* ── NAV SECTION (scrollable) ── */
        .sidebar-nav {
          padding: 0.5rem 1rem;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0; /* flex-fix for scroll inside flex */
        }

        .nav-group-label {
          font-size: 0.6rem;
          font-weight: 700;
          color: #a0a5be;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.85rem 0.5rem 0.35rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.58rem 0.75rem;
          border-radius: 10px;
          color: #8b90a7;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          text-decoration: none;
          margin-bottom: 0.1rem;
          position: relative;
        }

        .nav-item:hover {
          background: #eef2fe;
          color: #4B7FF2;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(179,111,242,0.12), rgba(75,127,242,0.12));
          color: #4B7FF2;
          border: 1px solid rgba(75,127,242,0.2);
        }

        .nav-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          transition: all 0.18s;
        }

        .nav-item.active .nav-icon      { background: rgba(75,127,242,0.15); }
        .nav-item:not(.active) .nav-icon { background: #f0f4fe; }

        .nav-label  { flex: 1; }

        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4B7FF2;
          flex-shrink: 0;
        }

        /* ── DIVIDER ── */
        .divider {
          height: 1px;
          background: #ececf5;
          margin: 0.5rem 1rem;
          flex-shrink: 0;
        }

        /* ── BOTTOM ── */
        .sidebar-bottom {
          padding: 0 1rem 1.5rem;
          flex-shrink: 0;
        }

        .btn-logout {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.58rem 0.75rem;
          border-radius: 10px;
          color: #ff4d4d;
          font-size: 0.84rem;
          font-weight: 600;
          background: #fff5f5;
          border: 1.5px solid #ffeded;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.18s;
          text-align: left;
        }

        .btn-logout:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        .logout-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #ffeded;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }

        /* ── SCROLLBAR ── */
        .sidebar-nav::-webkit-scrollbar { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: #dde3f8; border-radius: 4px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .sidebar-toggle {
            display: flex;
          }

          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block;
          }
        }
      </style>

      <!-- Overlay (mobile backdrop) -->
      <div class="sidebar-overlay" id="sidebarOverlay"></div>

      <!-- Hamburger Toggle Button -->
      <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle Sidebar">
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
      </button>

      <aside class="admin-sidebar" id="adminSidebar">

        <a href="./index.html" class="sidebar-brand">
          <div class="icon-wrapper">
            <img src="/assets/logo-smk-BARU BANGET copy.png" alt="Logo SMK" class="brand-icon">
          </div>
          <div class="brand-text">
            <div class="brand-title">Panel Perpustakaan</div>
            <div class="brand-sub">SMK Bina Informatika</div>
          </div>
        </a>


        <!-- User info -->
        <div class="sidebar-user">
          <div class="user-avatar" id="adminInitial">A</div>
          <div>
            <div class="user-name" id="adminName">Admin</div>
            <div class="user-role">🔑 Administrator</div>
          </div>
        </div>

        <!-- Navigation (scrollable) -->
        <nav class="sidebar-nav">
          <div class="nav-group-label">Menu Utama</div>
          ${renderItems(menuItems)}

          <div class="nav-group-label" style="margin-top:0.25rem;">Lainnya</div>
          ${renderItems(settingItems)}
        </nav>

        <div class="divider"></div>

        <!-- Logout -->
        <div class="sidebar-bottom">
          <button class="btn-logout" id="adminLogoutBtn">
            <span class="logout-icon">🚪</span>
            Keluar dari Admin
          </button>
        </div>

      </aside>
    `;

    // ── Isi nama admin dari sessionStorage ──
    const userData = JSON.parse(sessionStorage.getItem("userActive") || "{}");
    const nama = userData.nama || userData.name || "Admin";
    const initial = nama.charAt(0).toUpperCase();

    this.querySelector("#adminName").textContent    = nama;
    this.querySelector("#adminInitial").textContent = initial;

    // ── Logout handler ──
    this.querySelector("#adminLogoutBtn").addEventListener("click", () => {
      sessionStorage.removeItem("userActive");
      window.location.href = "../login.html";
    });

    // ── Toggle sidebar (mobile) ──
    const sidebar  = this.querySelector("#adminSidebar");
    const toggle   = this.querySelector("#sidebarToggle");
    const overlay  = this.querySelector("#sidebarOverlay");

    const openSidebar = () => {
      sidebar.classList.add("open");
      toggle.classList.add("open");
      overlay.classList.add("visible");
    };

    const closeSidebar = () => {
      sidebar.classList.remove("open");
      toggle.classList.remove("open");
      overlay.classList.remove("visible");
    };

    toggle.addEventListener("click", () => {
      sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener("click", closeSidebar);

    // Tutup sidebar otomatis saat nav item diklik (mobile)
    this.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 768) closeSidebar();
      });
    });
  }
}

customElements.define("admin-sidebar", AdminSidebar);