// SHAD0WREALM_V3 (static) — no build tools needed.

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* =========================================================
   BOOT SEQUENCE — typed terminal boot (vibe A: ASCII visible)
   ========================================================= */
async function runBoot() {
  const splash = document.getElementById("boot-splash");
  const typed = document.getElementById("boot-typed");
  const barFill = document.getElementById("boot-bar-fill");
  const desktop = document.getElementById("desktop");

  if (!splash || !typed || !barFill || !desktop) return;

  const lines = [
    "> init: systemd starting (v252) ... [ OK ]",
    "> kernel: loading modules ... [ OK ]",
    "> net: link up (eth0) ... [ OK ]",
    "> fs: mount /dev/obsidian -> /realm ... [ OK ]",
    "> auth: handshake accepted ... [ OK ]",
    "> ui: shad0wrealm tty attached ... [ OK ]",
    "> access: granted.",
  ];

  const accentTokens = ['.', ',', '!', '"', "{", "}", "[", "]", ":\\", "::", "!?"];

  const appendText = (text) => {
    const cursor = typed.querySelector(".boot-cursor");
    if (cursor) cursor.insertAdjacentText("beforebegin", text);
    else typed.textContent += text;
  };

  const appendAccent = (token) => {
    const cursor = typed.querySelector(".boot-cursor");
    const span = document.createElement("span");
    const r = Math.random();
    span.className =
      r < 0.55 ? "boot-accent-cyan" : r < 0.85 ? "boot-accent-purple" : "boot-accent-white";
    span.textContent = token;

    if (cursor) cursor.before(span);
    else typed.appendChild(span);
  };

  // Setup typed area + cursor
  typed.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = "boot-cursor";
  cursor.textContent = "▮";
  typed.appendChild(cursor);

  // Progress bar fills during typing
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 10 + 7;
    if (p >= 100) p = 100;
    barFill.style.width = `${p}%`;
    if (p >= 100) clearInterval(iv);
  }, 55);

  // Type the boot log (~2.5s)
  const fullText = lines.join("\n") + "\n";
  const start = performance.now();

  for (let i = 0; i < fullText.length; i++) {
    const ch = fullText[i];

    // occasional colored punctuation token
    if (i > 0 && i % 24 === 0 && Math.random() < 0.7) {
      appendText(" ");
      appendAccent(accentTokens[Math.floor(Math.random() * accentTokens.length)]);
      appendText(" ");
    }

    appendText(ch);

    // fast typing feel
    const base = ch === "\n" ? 65 : ch === " " ? 10 : 16;
    const jitter = Math.random() * 22;
    await delay(base + jitter);
  }

  // Hold so total feels ~2.5s (snappy)
  const elapsed = performance.now() - start;
  const targetMs = 2500;
  if (elapsed < targetMs) await delay(targetMs - elapsed);

  // Ensure bar completes
  barFill.style.width = "100%";
  clearInterval(iv);

  // Fade splash -> show desktop
  splash.classList.add("fade-out");
  desktop.classList.add("visible");
  await delay(450);
  splash.style.display = "none";
}

/* =========================================================
   FILE TREE — toggle folders + selection highlight
   ========================================================= */
function setupTreeInteractions() {
  const tree = document.getElementById("file-tree");
  if (!tree) return;

  const activate = (el) => {
    if (!el) return;

    const toggleId = el.getAttribute("data-toggle");
    if (toggleId) {
      const node = document.getElementById(toggleId);
      if (node) node.classList.toggle("open");
    }

    const selectId = el.getAttribute("data-select");
    if (selectId) {
      document.querySelectorAll(".file-entry").forEach((n) => n.classList.remove("selected"));
      const row = el.classList.contains("file-entry") ? el : el.closest(".file-entry");
      if (row) row.classList.add("selected");
    }
  };

  tree.addEventListener("click", (e) => {
    const target = e.target.closest("[data-toggle], [data-select]");
    if (!target) return;
    activate(target);
  });

  tree.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const target = e.target.closest("[data-toggle], [data-select]");
    if (!target) return;
    e.preventDefault();
    activate(target);
  });
}

/* =========================================================
   CLOCK — updates status bar time/date
   ========================================================= */
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

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  runBoot();
  setupTreeInteractions();
  startClock();
});