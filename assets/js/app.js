// SHAD0WREALM_V3 (static) — no build tools needed.

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── BOOT SEQUENCE ──────────────────────
async function runBoot() {
  const splash = document.getElementById("boot-splash");
  const access = document.getElementById("boot-access");
  const barWrap = document.getElementById("boot-bar-wrap");
  const barFill = document.getElementById("boot-bar-fill");
  const desktop = document.getElementById("desktop");

  if (!splash || !access || !barWrap || !barFill || !desktop) return;

  // t=0: ASCII + subtitle already visible
  // t=1100ms: ACCESS GRANTED fades in
  await delay(1100);
  access.classList.add("show");

  // t=1400ms: progress bar fires
  await delay(300);
  barWrap.classList.add("show");

  await new Promise((resolve) => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12 + 6;
      if (p >= 100) {
        p = 100;
        barFill.style.width = "100%";
        clearInterval(iv);
        setTimeout(resolve, 100);
      } else {
        barFill.style.width = `${p}%`;
      }
    }, 24);
  });

  // ~2.25s: fade splash, reveal desktop
  await delay(50);
  splash.classList.add("fade-out");
  desktop.classList.add("visible");
  await delay(450);
  splash.style.display = "none";
}

// ── FOLDER TOGGLE + FILE SELECT (no inline onclick) ─────────────
function setupTreeInteractions() {
  const tree = document.getElementById("file-tree");
  if (!tree) return;

  const activate = (el) => {
    if (!el) return;

    // Toggle folder if it has data-toggle
    const toggleId = el.getAttribute("data-toggle");
    if (toggleId) {
      const node = document.getElementById(toggleId);
      if (node) node.classList.toggle("open");
    }

    // Select file-entry if it has data-select
    const selectId = el.getAttribute("data-select");
    if (selectId) {
      document.querySelectorAll(".file-entry").forEach((n) => n.classList.remove("selected"));
      // Note: the clickable element might be inside an <a>; add class to the closest .file-entry
      const row = el.classList.contains("file-entry") ? el : el.closest(".file-entry");
      if (row) row.classList.add("selected");
      // Debug hook
      // console.log("open:", selectId);
    }
  };

  // Mouse clicks
  tree.addEventListener("click", (e) => {
    const target = e.target.closest("[data-toggle], [data-select]");
    if (!target) return;
    activate(target);
  });

  // Keyboard accessibility: Enter / Space
  tree.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const target = e.target.closest("[data-toggle], [data-select]");
    if (!target) return;
    e.preventDefault();
    activate(target);
  });
}

// ── CLOCK ──────────────────────────────
function startClock() {
  const clk = document.getElementById("clk");
  const dt = document.getElementById("dt");
  if (!clk || !dt) return;

  const pad2 = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const now = new Date();
    clk.textContent = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
    dt.textContent = `${pad2(now.getMonth() + 1)}/${pad2(now.getDate())}/${now.getFullYear()}`;
  };

  tick();
  setInterval(tick, 1000);
}

// ── INIT ───────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  runBoot();
  setupTreeInteractions();
  startClock();
});