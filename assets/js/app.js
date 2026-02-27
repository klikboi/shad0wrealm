  <script>
    // ── BOOT SEQUENCE ──────────────────────
    const splash  = document.getElementById('boot-splash');
    const access  = document.getElementById('boot-access');
    const barWrap = document.getElementById('boot-bar-wrap');
    const barFill = document.getElementById('boot-bar-fill');
    const desktop = document.getElementById('desktop');

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function runBoot() {
      // t=0:      ASCII + subtitle on screen
      // t=1100ms: ACCESS GRANTED fades in
      await delay(1100);
      access.classList.add('show');

      // t=1400ms: progress bar fires
      await delay(300);
      barWrap.classList.add('show');

      await new Promise(r => {
        let p = 0;
        const iv = setInterval(() => {
          p += Math.random() * 12 + 6;
          if (p >= 100) {
            p = 100;
            barFill.style.width = '100%';
            clearInterval(iv);
            setTimeout(r, 100);
          } else {
            barFill.style.width = p + '%';
          }
        }, 24);
      });

      // ~2.25s: fade splash, reveal desktop
      await delay(50);
      splash.classList.add('fade-out');
      desktop.classList.add('visible');
      await delay(450);
      splash.style.display = 'none';
    }

    runBoot();

    // ── FOLDER TOGGLE ──────────────────────
    function toggleFolder(id) {
      document.getElementById(id).classList.toggle('open');
    }

    // ── FILE SELECT ────────────────────────
    function handleFile(el, appId) {
      document.querySelectorAll('.file-entry').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      console.log('open:', appId);
    }

    // ── CLOCK ──────────────────────────────
    function tick() {
      const now = new Date();
      const p = n => String(n).padStart(2,'0');
      document.getElementById('clk').textContent = `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
      document.getElementById('dt').textContent  = `${p(now.getMonth()+1)}/${p(now.getDate())}/${now.getFullYear()}`;
    }
    tick(); setInterval(tick, 1000);
  </script>