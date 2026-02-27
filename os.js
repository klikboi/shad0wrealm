// ════════════════════════════════════════════
//  SHAD0WREALM // WINDOW MANAGER + OS CORE
// ════════════════════════════════════════════

const APP_CONFIG = {
  about:    { title: 'ABOUT.exe',   icon: '👾', w: 560, h: 420 },
  resume:   { title: 'RESUME.dat',  icon: '📄', w: 600, h: 500 },
  projects: { title: 'PROJECTS/',   icon: '💀', w: 720, h: 480 },
  contact:  { title: 'CONTACT.cfg', icon: '📡', w: 500, h: 440 },
};

let windowStack = {};
let windowZBase = 100;
let startOpen   = false;
let bootTime    = Date.now();
let fmMinimized = false;
let fmMaxed     = false;
let fmPrevStyle = {};

function initOS() {
  initClock();
  initFileManager();
}

// ── CLOCK ──────────────────────────────────
function initClock() {
  function tick() {
    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    document.getElementById('clock-time').textContent =
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    document.getElementById('clock-date').textContent =
      `${pad(now.getMonth()+1)}/${pad(now.getDate())}/${now.getFullYear()}`;

    const up = document.getElementById('uptime-counter');
    if (up) {
      const el = Math.floor((Date.now() - bootTime) / 1000);
      up.textContent = `${String(Math.floor(el/3600)).padStart(2,'0')}:${String(Math.floor((el%3600)/60)).padStart(2,'0')}:${String(el%60).padStart(2,'0')}`;
    }
  }
  tick();
  setInterval(tick, 1000);
}

// ── FILE MANAGER ───────────────────────────
function initFileManager() {
  const fm = document.getElementById('file-manager');
  if (!fm) return;

  makeDraggableEl(fm, document.getElementById('fm-titlebar'));

  // Double-click entries to open
  const entries = document.querySelectorAll('.fm-entry');
  entries.forEach(entry => {
    let clicks = 0, timer;
    entry.addEventListener('click', () => {
      entries.forEach(e => e.classList.remove('selected'));
      entry.classList.add('selected');
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (clicks >= 2) handleEntryOpen(entry);
        clicks = 0;
      }, 280);
    });
  });
}

function handleEntryOpen(entry) {
  if (entry.classList.contains('fm-external')) {
    const href = entry.dataset.href;
    if (href) window.open(href, '_blank');
    return;
  }
  const app = entry.dataset.app;
  if (app) openApp(app);
}

// ── FM WINDOW CONTROLS ─────────────────────
function fmMinimize() {
  const fm = document.getElementById('file-manager');
  if (!fm) return;
  // Just shrink to title bar only
  const body   = document.getElementById('fm-body');
  const footer = document.getElementById('fm-footer');
  if (fmMinimized) {
    body.style.display   = '';
    footer.style.display = '';
    fmMinimized = false;
  } else {
    body.style.display   = 'none';
    footer.style.display = 'none';
    fmMinimized = true;
  }
}

function fmMaximize() {
  const fm = document.getElementById('file-manager');
  if (!fm) return;
  if (fmMaxed) {
    fm.style.left   = fmPrevStyle.left;
    fm.style.top    = fmPrevStyle.top;
    fm.style.width  = fmPrevStyle.width;
    fm.style.height = fmPrevStyle.height;
    fmMaxed = false;
  } else {
    fmPrevStyle = { left: fm.style.left, top: fm.style.top, width: fm.style.width, height: fm.style.height };
    fm.style.left   = '0px';
    fm.style.top    = '0px';
    fm.style.width  = '100vw';
    fm.style.height = '100vh';
    fmMaxed = true;
  }
}

// ── APP OPEN ───────────────────────────────
function openApp(appId) {
  closeStartMenu();
  if (windowStack[appId]) {
    windowStack[appId].classList.remove('minimized');
    focusWindow(appId);
    return;
  }
  const cfg = APP_CONFIG[appId];
  if (!cfg) return;
  const tpl = document.getElementById(`tpl-${appId}`);
  if (!tpl) return;
  const content = tpl.content.cloneNode(true);
  const win     = createWindow(appId, cfg, content);
  document.getElementById('windows-container').appendChild(win);
  windowStack[appId] = win;
  focusWindow(appId);
}

// ── CREATE WINDOW ──────────────────────────
function createWindow(appId, cfg, content) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w  = Math.min(cfg.w, vw - 40);
  const h  = Math.min(cfg.h, vh - 40);
  const x  = Math.min(380 + Math.floor(Math.random() * 60), vw - w - 20);
  const y  = Math.max(20, Math.floor(Math.random() * (vh * 0.3)) + 20);

  const win = document.createElement('div');
  win.className = 'os-window focused';
  win.id = `win-${appId}`;
  win.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;

  win.innerHTML = `
    <div class="win-titlebar">
      <div class="win-title">${cfg.icon} ${cfg.title}</div>
      <div class="win-controls">
        <button class="win-btn minimize" title="Minimize" onclick="minimizeWindow('${appId}')">_</button>
        <button class="win-btn maximize" title="Maximize" onclick="maximizeWindow('${appId}')">□</button>
        <button class="win-btn close"    title="Close"    onclick="closeWindow('${appId}')">✕</button>
      </div>
    </div>
    <div class="win-menubar">
      <span>File</span><span>Edit</span><span>View</span><span>Help</span>
    </div>
    <div class="win-body"></div>
    <div class="win-resize"></div>
  `;

  win.querySelector('.win-body').appendChild(content);
  makeDraggableEl(win, win.querySelector('.win-titlebar'));
  makeResizable(win, win.querySelector('.win-resize'));
  win.addEventListener('mousedown', () => focusWindow(appId));
  return win;
}

// ── FOCUS / MINIMIZE / MAXIMIZE / CLOSE ────
function focusWindow(appId) {
  Object.values(windowStack).forEach(w => w.classList.remove('focused'));
  const win = windowStack[appId];
  if (win) { win.classList.add('focused'); win.style.zIndex = ++windowZBase; }
}

function minimizeWindow(appId) {
  windowStack[appId]?.classList.add('minimized');
}

function maximizeWindow(appId) {
  const win = windowStack[appId];
  if (!win) return;
  if (win.dataset.maxed === '1') {
    win.style.left = win.dataset.pl; win.style.top   = win.dataset.pt;
    win.style.width= win.dataset.pw; win.style.height= win.dataset.ph;
    win.dataset.maxed = '0';
  } else {
    win.dataset.pl = win.style.left; win.dataset.pt = win.style.top;
    win.dataset.pw = win.style.width;win.dataset.ph = win.style.height;
    win.style.left='0px'; win.style.top='0px';
    win.style.width='100vw'; win.style.height='100vh';
    win.dataset.maxed = '1';
  }
}

function closeWindow(appId) {
  const win = windowStack[appId];
  if (win) {
    win.style.transition = 'opacity 0.1s, transform 0.1s';
    win.style.opacity    = '0';
    win.style.transform  = 'scale(0.95)';
    setTimeout(() => { win.remove(); delete windowStack[appId]; }, 130);
  }
}

// ── START MENU (Smiley = Windows Key) ──────
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  startOpen  = !startOpen;
  menu.classList.toggle('hidden', !startOpen);
  if (startOpen) positionStartMenu();
}

function closeStartMenu() {
  document.getElementById('start-menu').classList.add('hidden');
  startOpen = false;
}

function positionStartMenu() {
  const fm   = document.getElementById('file-manager');
  const menu = document.getElementById('start-menu');
  if (!fm || !menu) return;
  const rect = fm.getBoundingClientRect();
  // Position above the footer of the file manager
  menu.style.left = rect.left + 'px';
  menu.style.top  = (rect.bottom - fm.querySelector('#fm-footer').offsetHeight - menu.offsetHeight - 4) + 'px';
}

document.addEventListener('click', e => {
  const menu = document.getElementById('start-menu');
  const btn  = document.getElementById('start-btn');
  if (startOpen && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
    closeStartMenu();
  }
});

// ── DRAG ───────────────────────────────────
function makeDraggableEl(el, handle) {
  if (!handle) return;
  let dragging = false, ox, oy, sx, sy;

  handle.addEventListener('mousedown', e => {
    if (e.target.closest('.win-controls') || e.target.closest('#fm-win-controls') || e.target.closest('#fm-dots')) return;
    dragging = true;
    sx = parseInt(el.style.left) || el.getBoundingClientRect().left;
    sy = parseInt(el.style.top)  || el.getBoundingClientRect().top;
    ox = e.clientX; oy = e.clientY;
    el.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const maxX = window.innerWidth  - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;
    el.style.left = Math.max(0, Math.min(maxX, sx + e.clientX - ox)) + 'px';
    el.style.top  = Math.max(0, Math.min(maxY, sy + e.clientY - oy)) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });

  // Touch
  handle.addEventListener('touchstart', e => {
    dragging = true;
    sx = parseInt(el.style.left) || 0;
    sy = parseInt(el.style.top)  || 0;
    ox = e.touches[0].clientX; oy = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    el.style.left = Math.max(0, sx + e.touches[0].clientX - ox) + 'px';
    el.style.top  = Math.max(0, sy + e.touches[0].clientY - oy) + 'px';
  }, { passive: true });

  document.addEventListener('touchend', () => { dragging = false; });
}

// ── RESIZE ─────────────────────────────────
function makeResizable(win, handle) {
  if (!handle) return;
  let resizing = false, sx, sy, sw, sh;
  handle.addEventListener('mousedown', e => {
    resizing = true;
    sx = e.clientX; sy = e.clientY;
    sw = win.offsetWidth; sh = win.offsetHeight;
    e.preventDefault(); e.stopPropagation();
  });
  document.addEventListener('mousemove', e => {
    if (!resizing) return;
    win.style.width  = Math.max(320, sw + e.clientX - sx) + 'px';
    win.style.height = Math.max(200, sh + e.clientY - sy) + 'px';
  });
  document.addEventListener('mouseup', () => { resizing = false; });
}

// ── SHUTDOWN ───────────────────────────────
function triggerShutdown() {
  closeStartMenu();
  const overlay = document.createElement('div');
  overlay.id = 'shutdown-overlay';
  overlay.innerHTML = `<div>SYSTEM SHUTDOWN</div><div class="sub">Terminating all processes...</div>`;
  document.body.appendChild(overlay);
  let dots = 0;
  const iv = setInterval(() => {
    overlay.querySelector('.sub').textContent = 'Terminating all processes' + '.'.repeat(++dots % 4);
  }, 500);
  setTimeout(() => { clearInterval(iv); overlay.querySelector('.sub').textContent = 'Connection closed. Stay in the shadows.'; }, 3000);
  setTimeout(() => {
    overlay.style.transition = 'opacity 1s';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 1200);
  }, 5000);
}
