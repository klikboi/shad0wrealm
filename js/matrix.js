// ════════════════════════════════════════════
//  HACK_OS // MATRIX RAIN
// ════════════════════════════════════════════

function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:・."=*+-<>¦｜╌01アイウエオカキクケコサシスセソタチツテトナニヌネノ0101HACK3XPL01T3D'.split('');

  let cols, drops;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cols = Math.floor(canvas.width / 14);
    drops = new Array(cols).fill(0).map(() => Math.random() * -80);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  resize();

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < cols; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * 14;
      const y = drops[i] * 14;

      // Lead character — bright white/green
      const alpha = Math.min(1, drops[i] / 5);
      if (Math.random() > 0.98) {
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      } else {
        ctx.fillStyle = `rgba(0,255,65,${alpha})`;
      }

      ctx.font = '13px "Share Tech Mono", monospace';
      ctx.fillText(char, x, y);

      // Dim trail char
      if (Math.random() > 0.6) {
        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = 'rgba(0,143,17,0.4)';
        ctx.fillText(trailChar, x, y - 14);
      }

      // Reset drop
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.6 + Math.random() * 0.4;
    }
  }

  setInterval(draw, 50);
}
