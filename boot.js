// ════════════════════════════════════════════
//  SHAD0WREALM // CINEMATIC BOOT SPLASH
// ════════════════════════════════════════════

const bootLog    = document.getElementById('boot-log');
const bootAccess = document.getElementById('boot-access');
const bootBarWrap= document.getElementById('boot-bar-wrap');
const bootBarFill= document.getElementById('boot-bar-fill');
const bootScreen = document.getElementById('boot-screen');
const desktop    = document.getElementById('desktop');

const BOOT_LINES = [
  { text: 'SHAD0WREALM BIOS v1.337 // klikbait edition',  type: 'ok',   delay: 0   },
  { text: '────────────────────────────────────────────',  type: 'dim',  delay: 55  },
  { text: 'Memory check: 512TB ....................... [OK]', type: 'ok', delay: 100 },
  { text: 'Loading crypto.ko .......................... [OK]', type: 'ok',delay: 145 },
  { text: 'Loading ghost_protocol.ko .................. [OK]', type: 'ok',delay: 185 },
  { text: 'stealth_mode: MAXIMUM ................. [WARNING]', type: 'warn',delay: 225},
  { text: 'Mounting /root ............................. [OK]', type: 'ok', delay: 265 },
  { text: 'Mounting /classified ....................... [OK]', type: 'ok', delay: 300 },
  { text: 'VPN tunnel: ESTABLISHED .................... [OK]', type: 'ok', delay: 335 },
  { text: 'Tor anonymization: ACTIVE .................. [OK]', type: 'ok', delay: 370 },
  { text: 'IDS/Firewall: ONLINE ....................... [OK]', type: 'ok', delay: 405 },
  { text: 'Port 31337: anomalous traffic ........ [FILTERED]', type: 'warn',delay: 450},
  { text: 'Biometrics ........................... [PASS ✓]',   type: 'ok', delay: 530 },
  { text: 'Cryptographic signature .............. [PASS ✓]',   type: 'ok', delay: 610 },
  { text: 'Clearance level ................... [VERIFIED ✓]',  type: 'ok', delay: 690 },
];

function appendLog(text, type) {
  const span = document.createElement('span');
  span.className = `log-line log-${type}`;
  span.textContent = `  ${text}`;
  bootLog.appendChild(span);
  bootLog.scrollTop = bootLog.scrollHeight;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runBoot() {
  // Fire all log lines by their absolute delay from boot start
  BOOT_LINES.forEach(line => {
    setTimeout(() => appendLog(line.text, line.type), line.delay);
  });

  // Wait for last log line + brief pause
  await delay(880);

  // ACCESS GRANTED slam
  bootAccess.classList.remove('hidden');
  await delay(400);

  // Progress bar rips fast
  bootBarWrap.classList.remove('hidden');
  await new Promise(r => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 10 + 5;
      if (p >= 100) {
        p = 100;
        bootBarFill.style.width = '100%';
        clearInterval(iv);
        setTimeout(r, 120);
      } else {
        bootBarFill.style.width = p + '%';
      }
    }, 28);
  });

  // Fade out, reveal desktop
  await delay(150);
  bootScreen.style.transition = 'opacity 0.35s ease';
  bootScreen.style.opacity = '0';
  await delay(360);
  bootScreen.classList.add('hidden');
  desktop.classList.remove('hidden');

  if (typeof initMatrix === 'function') initMatrix();
  if (typeof initOS    === 'function') initOS();
}

window.addEventListener('DOMContentLoaded', () => setTimeout(runBoot, 150));
