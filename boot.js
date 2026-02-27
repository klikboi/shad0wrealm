// ════════════════════════════════════════════
//  HACK_OS // BOOT SEQUENCE
// ════════════════════════════════════════════

const bootLog = document.getElementById('boot-log');
const bootAccess = document.getElementById('boot-access');
const bootBarWrap = document.getElementById('boot-bar-wrap');
const bootBarFill = document.getElementById('boot-bar-fill');
const bootScreen = document.getElementById('boot-screen');
const desktop = document.getElementById('desktop');

const BOOT_LINES = [
  { text: 'BIOS v1.337 // HACK_OS FIRMWARE', type: 'dim', delay: 0 },
  { text: '──────────────────────────────────────────────', type: 'dim', delay: 80 },
  { text: 'Initializing memory banks............. [512TB]', type: 'ok', delay: 200 },
  { text: 'Loading kernel modules...', type: 'dim', delay: 400 },
  { text: '  [OK] crypto.ko', type: 'ok', delay: 550 },
  { text: '  [OK] netfilter.ko', type: 'ok', delay: 680 },
  { text: '  [OK] ghost_protocol.ko', type: 'ok', delay: 800 },
  { text: '  [WARN] stealth_mode: operating at maximum', type: 'warn', delay: 960 },
  { text: 'Mounting filesystem /root ............. [done]', type: 'ok', delay: 1100 },
  { text: 'Mounting filesystem /classified ....... [done]', type: 'ok', delay: 1220 },
  { text: 'Mounting filesystem /breach_protocols.. [done]', type: 'ok', delay: 1340 },
  { text: 'Starting network daemon...', type: 'dim', delay: 1500 },
  { text: '  [OK] eth0: 192.168.x.x — link UP', type: 'ok', delay: 1650 },
  { text: '  [OK] tun0: VPN tunnel established', type: 'ok', delay: 1780 },
  { text: '  [OK] tor0: anonymization layer ACTIVE', type: 'ok', delay: 1900 },
  { text: 'Checking threat detection systems...', type: 'dim', delay: 2100 },
  { text: '  [OK] IDS: ONLINE', type: 'ok', delay: 2240 },
  { text: '  [OK] Firewall: ONLINE', type: 'ok', delay: 2360 },
  { text: '  [WARN] Anomalous traffic detected on port 31337', type: 'warn', delay: 2500 },
  { text: '  [OK] Packet filtered — threat neutralized', type: 'ok', delay: 2700 },
  { text: 'Loading HACK_OS desktop environment...', type: 'dim', delay: 2900 },
  { text: '──────────────────────────────────────────────', type: 'dim', delay: 3050 },
  { text: 'AUTHENTICATING USER...', type: 'dim', delay: 3200 },
  { text: 'Checking biometrics........................ [✓]', type: 'ok', delay: 3500 },
  { text: 'Verifying cryptographic signature......... [✓]', type: 'ok', delay: 3750 },
  { text: 'Validating clearance level................ [✓]', type: 'ok', delay: 4000 },
];

function appendLog(text, type, extraClass = '') {
  const span = document.createElement('span');
  span.className = `log-line log-${type} ${extraClass}`;
  span.textContent = `  ${text}`;
  bootLog.appendChild(span);
  bootLog.scrollTop = bootLog.scrollHeight;
}

function typeBootLine(text, type, callback) {
  const span = document.createElement('span');
  span.className = `log-line log-${type}`;
  span.textContent = '  ';
  bootLog.appendChild(span);
  bootLog.scrollTop = bootLog.scrollHeight;

  let i = 0;
  const iv = setInterval(() => {
    span.textContent += text[i] || '';
    i++;
    if (i >= text.length) {
      clearInterval(iv);
      if (callback) callback();
    }
  }, 12);
}

async function runBoot() {
  for (const line of BOOT_LINES) {
    await new Promise(r => setTimeout(r, line.delay - (BOOT_LINES[BOOT_LINES.indexOf(line) - 1]?.delay || 0)));
    appendLog(line.text, line.type);
  }

  // Show ACCESS GRANTED
  await new Promise(r => setTimeout(r, 300));
  bootAccess.classList.remove('hidden');

  // Progress bar
  await new Promise(r => setTimeout(r, 500));
  bootBarWrap.classList.remove('hidden');

  let progress = 0;
  await new Promise(r => {
    const iv = setInterval(() => {
      progress += Math.random() * 4 + 1;
      if (progress >= 100) {
        progress = 100;
        bootBarFill.style.width = '100%';
        clearInterval(iv);
        setTimeout(r, 300);
      } else {
        bootBarFill.style.width = progress + '%';
      }
    }, 40);
  });

  // Transition to desktop
  bootScreen.style.transition = 'opacity 0.6s ease';
  bootScreen.style.opacity = '0';
  await new Promise(r => setTimeout(r, 600));
  bootScreen.classList.add('hidden');
  desktop.classList.remove('hidden');

  // Start matrix rain after desktop is shown
  if (typeof initMatrix === 'function') initMatrix();
  if (typeof initOS === 'function') initOS();
}

// Start boot on load
window.addEventListener('DOMContentLoaded', () => {
  // Small delay for dramatic effect
  setTimeout(runBoot, 400);
});
