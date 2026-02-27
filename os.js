// ════════════════════════════════════════════
//  HACK_OS // WINDOW MANAGER + OS CORE
// ════════════════════════════════════════════

const APP_CONFIG = {
  about:    { title: 'ABOUT.exe',     icon: '👾', w: 560, h: 420 },
  resume:   { title: 'RESUME.dat',    icon: '📄', w: 600, h: 500 },
  projects: { title: 'PROJECTS/',     icon: '💀', w: 720, h: 480 },
  terminal: { title: 'TERMINAL.sh',   icon: '⌨️', w: 640, h: 400 },
  contact:  { title: 'CONTACT.cfg',   icon: '📡', w: 500, h: 440 },
};

let windowStack = {};
let windowZBase = 100;
let startOpen = false;
let bootTime = Date.now();

function initOS() {
  initClock();
  bindDesktopIcons();
}

// ── CLOCK ──────────────────────────────────
function initClock() {
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();

    document.getElementById('clock-time').textContent = `${h}:${m}:${s}`;
    document.getElementById('clock-date').textContent = `${mo}/${d}/${y}`;

    // Update uptime if about window open
    const up = document.getElementById('uptime-counter');
    if (up) {
      const elapsed = Math.floor((Date.now() - bootTime) / 1000);
      const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const ss = String(elapsed % 60).padStart(2, '0');
      up.textContent = `${hh}:${mm}:${ss}`;
    }
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// ── DESKTOP ICONS ──────────────────────────
function bindDesktopIcons() {
  document.querySelectorAll('.desk-icon').forEach(icon => {
    let clicks = 0;
    icon.addEventListener('click', () => {
      clicks++;
      setTimeout(() => {
        if (clicks >= 2) openApp(icon.dataset.app);
        clicks = 0;
      }, 280);
    });
  });
}

// ── APP OPEN ───────────────────────────────
function openApp(appId) {
  closeStartMenu();

  // If already exists, focus/restore
  if (windowStack[appId]) {
    const win = windowStack[appId];
    win.classList.remove('minimized');
    focusWindow(appId);
    return;
  }

  const cfg = APP_CONFIG[appId];
  if (!cfg) return;

  const tpl = document.getElementById(`tpl-${appId}`);
  if (!tpl) return;

  const content = tpl.content.cloneNode(true);
  const win = createWindow(appId, cfg, content);
  document.getElementById('windows-container').appendChild(win);
  windowStack[appId] = win;
  addTaskbarTask(appId, cfg);
  focusWindow(appId);

  // Post-init for specific apps
  if (appId === 'terminal') initTerminal();
}

// ── CREATE WINDOW ──────────────────────────
function createWindow(appId, cfg, content) {
  const vw = window.innerWidth;
  const vh = window.innerHeight - 44;
  const w = Math.min(cfg.w, vw - 40);
  const h = Math.min(cfg.h, vh - 40);
  const x = Math.max(20, Math.floor(Math.random() * (vw - w - 60)) + 30);
  const y = Math.max(20, Math.floor(Math.random() * (vh - h - 40)) + 20);

  const win = document.createElement('div');
  win.className = 'os-window focused';
  win.id = `win-${appId}`;
  win.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;

  win.innerHTML = `
    <div class="win-titlebar" data-app="${appId}">
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
    <div class="win-resize" data-app="${appId}"></div>
  `;

  win.querySelector('.win-body').appendChild(content);
  makeDraggable(win, win.querySelector('.win-titlebar'));
  makeResizable(win, win.querySelector('.win-resize'));
  win.addEventListener('mousedown', () => focusWindow(appId));

  return win;
}

// ── FOCUS ──────────────────────────────────
function focusWindow(appId) {
  Object.values(windowStack).forEach(w => w.classList.remove('focused'));
  const win = windowStack[appId];
  if (win) {
    win.classList.add('focused');
    win.style.zIndex = ++windowZBase;
  }
  document.querySelectorAll('.taskbar-task').forEach(t => t.classList.remove('active'));
  const task = document.querySelector(`.taskbar-task[data-app="${appId}"]`);
  if (task) task.classList.add('active');
}

// ── MINIMIZE ───────────────────────────────
function minimizeWindow(appId) {
  const win = windowStack[appId];
  if (win) win.classList.add('minimized');
  document.querySelector(`.taskbar-task[data-app="${appId}"]`)?.classList.remove('active');
}

// ── MAXIMIZE ───────────────────────────────
function maximizeWindow(appId) {
  const win = windowStack[appId];
  if (!win) return;
  if (win.dataset.maxed === '1') {
    win.style.left   = win.dataset.prevLeft;
    win.style.top    = win.dataset.prevTop;
    win.style.width  = win.dataset.prevW;
    win.style.height = win.dataset.prevH;
    win.dataset.maxed = '0';
  } else {
    win.dataset.prevLeft = win.style.left;
    win.dataset.prevTop  = win.style.top;
    win.dataset.prevW    = win.style.width;
    win.dataset.prevH    = win.style.height;
    win.style.left   = '0px';
    win.style.top    = '0px';
    win.style.width  = '100vw';
    win.style.height = (window.innerHeight - 44) + 'px';
    win.dataset.maxed = '1';
  }
}

// ── CLOSE ──────────────────────────────────
function closeWindow(appId) {
  const win = windowStack[appId];
  if (win) {
    win.style.transition = 'opacity 0.1s, transform 0.1s';
    win.style.opacity = '0';
    win.style.transform = 'scale(0.95)';
    setTimeout(() => {
      win.remove();
      delete windowStack[appId];
      removeTaskbarTask(appId);
    }, 150);
  }
}

// ── TASKBAR TASKS ──────────────────────────
function addTaskbarTask(appId, cfg) {
  const tasks = document.getElementById('taskbar-tasks');
  const task = document.createElement('button');
  task.className = 'taskbar-task active';
  task.dataset.app = appId;
  task.textContent = `${cfg.icon} ${cfg.title}`;
  task.onclick = () => {
    const win = windowStack[appId];
    if (!win) return;
    if (win.classList.contains('minimized')) {
      win.classList.remove('minimized');
      focusWindow(appId);
    } else if (win.classList.contains('focused')) {
      minimizeWindow(appId);
    } else {
      focusWindow(appId);
    }
  };
  tasks.appendChild(task);
}

function removeTaskbarTask(appId) {
  document.querySelector(`.taskbar-task[data-app="${appId}"]`)?.remove();
}

// ── START MENU ─────────────────────────────
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  startOpen = !startOpen;
  menu.classList.toggle('hidden', !startOpen);
}

function closeStartMenu() {
  document.getElementById('start-menu').classList.add('hidden');
  startOpen = false;
}

document.addEventListener('click', e => {
  const menu = document.getElementById('start-menu');
  const btn = document.getElementById('start-btn');
  if (startOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
    closeStartMenu();
  }
});

// ── DRAG ───────────────────────────────────
function makeDraggable(win, handle) {
  let ox, oy, sx, sy, dragging = false;

  handle.addEventListener('mousedown', e => {
    if (e.target.closest('.win-controls')) return;
    dragging = true;
    sx = parseInt(win.style.left) || 0;
    sy = parseInt(win.style.top) || 0;
    ox = e.clientX; oy = e.clientY;
    win.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - ox;
    const dy = e.clientY - oy;
    const maxX = window.innerWidth  - win.offsetWidth;
    const maxY = window.innerHeight - 44 - win.offsetHeight;
    win.style.left = Math.max(0, Math.min(maxX, sx + dx)) + 'px';
    win.style.top  = Math.max(0, Math.min(maxY, sy + dy)) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });

  // Touch support
  handle.addEventListener('touchstart', e => {
    if (e.target.closest('.win-controls')) return;
    dragging = true;
    sx = parseInt(win.style.left) || 0;
    sy = parseInt(win.style.top) || 0;
    ox = e.touches[0].clientX;
    oy = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - ox;
    const dy = e.touches[0].clientY - oy;
    win.style.left = Math.max(0, sx + dx) + 'px';
    win.style.top  = Math.max(0, sy + dy) + 'px';
  }, { passive: true });

  document.addEventListener('touchend', () => { dragging = false; });
}

// ── RESIZE ─────────────────────────────────
function makeResizable(win, handle) {
  let resizing = false, sx, sy, sw, sh;

  handle.addEventListener('mousedown', e => {
    resizing = true;
    sx = e.clientX; sy = e.clientY;
    sw = win.offsetWidth; sh = win.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', e => {
    if (!resizing) return;
    win.style.width  = Math.max(320, sw + e.clientX - sx) + 'px';
    win.style.height = Math.max(220, sh + e.clientY - sy) + 'px';
  });

  document.addEventListener('mouseup', () => { resizing = false; });
}

// ── SHUTDOWN ───────────────────────────────
function triggerShutdown() {
  closeStartMenu();
  const overlay = document.createElement('div');
  overlay.id = 'shutdown-overlay';
  overlay.innerHTML = `
    <div>SYSTEM SHUTDOWN</div>
    <div class="sub">Terminating all processes...</div>
  `;
  document.body.appendChild(overlay);

  let dots = 0;
  const iv = setInterval(() => {
    overlay.querySelector('.sub').textContent = 'Terminating all processes' + '.'.repeat(++dots % 4);
  }, 500);

  setTimeout(() => {
    clearInterval(iv);
    overlay.querySelector('.sub').textContent = 'Connection closed. Stay in the shadows.';
  }, 3000);

  setTimeout(() => {
    overlay.style.transition = 'opacity 1s';
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.remove(); }, 1200);
  }, 5000);
}
