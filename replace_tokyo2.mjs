import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/game/scenes.ts';
let src = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// ── Replacement A: image list ─────────────────────────────────────────────
const oldImages = `    for (const [k, s] of [
      ['arc',    '/PNG_Japan/Arc.png'],
      ['sakura', '/PNG_Japan/Sakura Tree.gif'],
      ['fuji',   '/PNG_Japan/Volcano Fuji.png'],
      ['city',   '/PNG_Japan/City.png'],
      ['trees',  '/PNG_Japan/Background Trees.png'],
      ['tower',  '/PNG_Japan/Tower.png'],
      ['house',  '/PNG_Japan/House Outside.png'],
      ['cart',   '/PNG_Japan/Trading Cart.png'],
      ['boy',    '/PNG_Japan/Boy.gif'],
      ['girl',   '/PNG_Japan/Girl.gif'],
      ['bushes', '/PNG_Japan/Bushes.gif'],
    ] as [string, string][]) { const img = new Image(); img.src = s; I[k] = img; }`;

const newImages = `    for (const [k, s] of [
      ['fuji',    '/PNG_Japan/Volcano Fuji.png'],
      ['trees',   '/PNG_Japan/Background Trees.png'],
      ['sakura',  '/PNG_Japan/Sakura Tree.gif'],
      ['arc',     '/PNG_Japan/Arc.png'],
      ['pagoda',  '/PNG_Japan/Tower.png'],
      ['cart',    '/PNG_Japan/Trading Cart.png'],
      ['shop1',   '/Tokyo_neo/r_2045.png'],
      ['shop2',   '/Tokyo_neo/r_2042.png'],
      ['bldg1',   '/Tokyo_neo/r_2034.png'],
      ['lamp',    '/Tokyo_neo/r_2092.png'],
      ['lantern', '/Tokyo_neo/r_2083.png'],
      ['vend',    '/Tokyo_neo/r_2021.png'],
    ] as [string, string][]) { const img = new Image(); img.src = s; I[k] = img; }`;

if (!src.includes(oldImages)) {
  console.error('ERROR: Could not find Replacement A target (image list). Aborting.');
  process.exit(1);
}
src = src.replace(oldImages, newImages);
console.log('✓ Replacement A done (image list)');

// ── Replacement B: background function ───────────────────────────────────
// Anchor to the tokyo IIFE to avoid matching earlier scenes' background functions
const tokyoAnchor = '  tokyo: (() => {';
const tokyoIdx = src.indexOf(tokyoAnchor);
if (tokyoIdx === -1) {
  console.error('ERROR: Could not find tokyo IIFE. Aborting.');
  process.exit(1);
}

const bgMarker = '    background: (ctx, w, h, time) => {\n';
const startIdx = src.indexOf(bgMarker, tokyoIdx);
if (startIdx === -1) {
  console.error('ERROR: Could not find background function start after tokyo anchor. Aborting.');
  process.exit(1);
}

// Find the closing },  followed by platforms:
const bgEnd = '\n    },\n\n    platforms:';
const endIdx = src.indexOf(bgEnd, startIdx);
if (endIdx === -1) {
  console.error('ERROR: Could not find background function end. Aborting.');
  process.exit(1);
}

const newBackground = `    background: (ctx, w, h, time) => {
      const ground = h * 0.78;

      // ── LABEL HELPER ──────────────────────────────────────────────────
      const drawMemoryLabel = (lx: number, ly: number, emoji: string, title: string, detail: string) => {
        const pad = 14;
        ctx.font = 'bold 15px monospace';
        const tw = ctx.measureText(emoji + ' ' + title).width;
        ctx.font = '12px monospace';
        const dw = detail ? ctx.measureText(detail).width : 0;
        const bw = Math.max(tw, dw) + pad * 2;
        const bh = detail ? 50 : 30;
        ctx.fillStyle = 'rgba(0,0,0,0.32)';
        ctx.beginPath(); ctx.roundRect(lx - bw / 2 + 3, ly + 3, bw, bh, 10); ctx.fill();
        ctx.fillStyle = 'rgba(8,20,45,0.90)';
        ctx.beginPath(); ctx.roundRect(lx - bw / 2, ly, bw, bh, 10); ctx.fill();
        ctx.strokeStyle = 'rgba(180,220,255,0.45)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(lx - bw / 2, ly, bw, bh, 10); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(emoji + ' ' + title, lx, ly + 20);
        if (detail) {
          ctx.fillStyle = 'rgba(180,220,255,0.95)';
          ctx.font = '12px monospace';
          ctx.fillText(detail, lx, ly + 39);
        }
        ctx.textAlign = 'left';
      };

      // ── SPRITE HELPER ──────────────────────────────────────────────────
      const di = (img: HTMLImageElement, x: number, y: number, dw: number, dh: number, blend?: string) => {
        if (!img.complete || img.naturalWidth === 0) return;
        if (blend) ctx.globalCompositeOperation = blend as GlobalCompositeOperation;
        ctx.drawImage(img, x, y, dw, dh);
        if (blend) ctx.globalCompositeOperation = 'source-over';
      };

      // ── 1. SUNSET SKY ──────────────────────────────────────────────────
      const sky = ctx.createLinearGradient(0, 0, 0, ground);
      sky.addColorStop(0,    '#1a0a2e');   // deep indigo at top
      sky.addColorStop(0.28, '#3d1060');   // violet
      sky.addColorStop(0.58, '#b83050');   // deep rose
      sky.addColorStop(0.80, '#e8622a');   // burnt orange
      sky.addColorStop(1,    '#f5a82e');   // warm gold at horizon
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, ground);

      // Warm glow on lower ground area
      const groundG = ctx.createLinearGradient(0, ground, 0, h);
      groundG.addColorStop(0, '#c04818');
      groundG.addColorStop(1, '#1a0808');
      ctx.fillStyle = groundG;
      ctx.fillRect(0, ground, w, h - ground);

      // ── 2. SETTING SUN ─────────────────────────────────────────────────
      const sunX = w * 0.62, sunY = ground - h * 0.03;
      // Wide atmospheric haze
      const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.32);
      sg.addColorStop(0,    'rgba(255,210,60,0.75)');
      sg.addColorStop(0.18, 'rgba(255,120,30,0.42)');
      sg.addColorStop(0.50, 'rgba(200,50,20,0.12)');
      sg.addColorStop(1,    'transparent');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, w, ground);
      // Sun disc
      ctx.fillStyle = 'rgba(255,235,110,0.95)';
      ctx.beginPath(); ctx.arc(sunX, sunY, 28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,190,0.70)';
      ctx.beginPath(); ctx.arc(sunX, sunY, 17, 0, Math.PI * 2); ctx.fill();

      // ── 3. CLOUDS ──────────────────────────────────────────────────────
      const clouds: Array<[number, number, number, number, string]> = [
        [0.09, 0.11, 0.13, 0.028, 'rgba(215,125,155,0.42)'],
        [0.31, 0.06, 0.10, 0.022, 'rgba(195,100,135,0.32)'],
        [0.70, 0.14, 0.11, 0.026, 'rgba(200,115,95,0.28)'],
        [0.50, 0.04, 0.08, 0.018, 'rgba(175,95,135,0.22)'],
      ];
      for (const [cx, cy, rx, ry, col] of clouds) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.ellipse(w * cx, h * cy, w * rx, h * ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 4. MT. FUJI ────────────────────────────────────────────────────
      // White bg dissolves into warm sky via multiply; dark Fuji shape remains
      di(I.fuji, w * 0.20, h * 0.14, w * 0.62, h * 0.56, 'multiply');

      // ── 5. FAR TREE LINE (Ueno Park) ───────────────────────────────────
      di(I.trees, 0, h * 0.60, w * 0.32, h * 0.18, 'multiply');

      // ── 6. PAGODA (small, left sky, depth) ─────────────────────────────
      di(I.pagoda, w * 0.09, h * 0.38, 52, 72, 'multiply');

      // ── 7. BACKGROUND BUILDING DEPTH ───────────────────────────────────
      di(I.bldg1, w * 0.15, ground - h * 0.30, w * 0.14, h * 0.30, 'multiply');

      // ── 8. TOKYO TOWER ─────────────────────────────────────────────────
      {
        const ttx    = w * 0.61;
        const ttBase = ground;
        const ttH    = h * 0.70;
        const ttBW   = Math.min(h * 0.14, 90);
        const legH   = ttH * 0.26;
        const bodyW  = ttBW * 0.26;

        // Atmospheric warm glow
        const tg = ctx.createRadialGradient(ttx, ttBase - ttH * 0.30, 5, ttx, ttBase - ttH * 0.30, ttH * 0.55);
        tg.addColorStop(0,   'rgba(255,140,30,0.30)');
        tg.addColorStop(0.5, 'rgba(230,80,20,0.09)');
        tg.addColorStop(1,   'transparent');
        ctx.fillStyle = tg;
        ctx.fillRect(ttx - ttH * 0.6, ttBase - ttH, ttH * 1.2, ttH);

        ctx.fillStyle = '#cc3200';
        // Outer-left leg
        ctx.beginPath();
        ctx.moveTo(ttx - ttBW / 2,         ttBase);
        ctx.lineTo(ttx - ttBW / 2 + 11,    ttBase);
        ctx.lineTo(ttx - bodyW / 2,         ttBase - legH);
        ctx.lineTo(ttx - bodyW / 2 - 9,     ttBase - legH);
        ctx.closePath(); ctx.fill();
        // Outer-right leg
        ctx.beginPath();
        ctx.moveTo(ttx + ttBW / 2,         ttBase);
        ctx.lineTo(ttx + ttBW / 2 - 11,    ttBase);
        ctx.lineTo(ttx + bodyW / 2,         ttBase - legH);
        ctx.lineTo(ttx + bodyW / 2 + 9,     ttBase - legH);
        ctx.closePath(); ctx.fill();
        // Inner-left leg
        ctx.beginPath();
        ctx.moveTo(ttx - ttBW * 0.22,      ttBase);
        ctx.lineTo(ttx - ttBW * 0.22 + 7,  ttBase);
        ctx.lineTo(ttx - bodyW / 2 + 4,    ttBase - legH);
        ctx.lineTo(ttx - bodyW / 2 - 3,    ttBase - legH);
        ctx.closePath(); ctx.fill();
        // Inner-right leg
        ctx.beginPath();
        ctx.moveTo(ttx + ttBW * 0.22,      ttBase);
        ctx.lineTo(ttx + ttBW * 0.22 - 7,  ttBase);
        ctx.lineTo(ttx + bodyW / 2 - 4,    ttBase - legH);
        ctx.lineTo(ttx + bodyW / 2 + 3,    ttBase - legH);
        ctx.closePath(); ctx.fill();
        // Cross-strut
        ctx.fillRect(ttx - ttBW * 0.36, ttBase - legH * 0.52, ttBW * 0.72, 3.5);

        // Main body
        ctx.beginPath();
        ctx.moveTo(ttx - bodyW / 2, ttBase - legH);
        ctx.lineTo(ttx - 5,         ttBase - ttH);
        ctx.lineTo(ttx + 5,         ttBase - ttH);
        ctx.lineTo(ttx + bodyW / 2, ttBase - legH);
        ctx.closePath(); ctx.fill();

        // Observation decks
        const o1Y = ttBase - ttH * 0.40;
        const o1W = bodyW * 0.70 + 14;
        ctx.fillStyle = '#ee4500';
        ctx.fillRect(ttx - o1W - 8, o1Y - 5, o1W * 2 + 16, 12);
        ctx.fillStyle = '#cc3200';
        ctx.fillRect(ttx - o1W,     o1Y,      o1W * 2,       6);
        const o2Y = ttBase - ttH * 0.63;
        ctx.fillStyle = '#ee4500';
        ctx.fillRect(ttx - 22, o2Y - 4, 44, 9);
        ctx.fillStyle = '#cc3200';
        ctx.fillRect(ttx - 15, o2Y,     30, 5);

        // White bands
        ctx.fillStyle = 'rgba(255,255,255,0.76)';
        for (const prog of [0.32, 0.43, 0.54, 0.64, 0.74, 0.85]) {
          const bY  = ttBase - ttH * prog;
          const fac = (prog - 0.26) / 0.74;
          const bW  = Math.max(5, bodyW * (1 - fac * 0.83));
          ctx.fillRect(ttx - bW / 2, bY, bW, 2.5);
        }
        // Antenna + blinking light
        ctx.fillStyle = '#cc3200';
        ctx.fillRect(ttx - 2, ttBase - ttH - 28, 4, 30);
        const blinkOn = Math.sin(time * 0.004) > 0;
        ctx.fillStyle = blinkOn ? '#ff2200' : '#880000';
        ctx.beginPath(); ctx.arc(ttx, ttBase - ttH - 25, 3.5, 0, Math.PI * 2); ctx.fill();
        if (blinkOn) {
          const bl = ctx.createRadialGradient(ttx, ttBase - ttH - 25, 0, ttx, ttBase - ttH - 25, 16);
          bl.addColorStop(0, 'rgba(255,40,0,0.55)'); bl.addColorStop(1, 'transparent');
          ctx.fillStyle = bl;
          ctx.beginPath(); ctx.arc(ttx, ttBase - ttH - 25, 16, 0, Math.PI * 2); ctx.fill();
        }
        drawMemoryLabel(ttx, ttBase - ttH - 80, '🗼', 'Tokyo Tower', '333m above the city');
      }

      // ── 9. TRADITIONAL SHOPFRONT LEFT ─────────────────────────────────
      di(I.shop1, w * 0.01, ground - h * 0.34, w * 0.15, h * 0.34, 'multiply');

      // ── 10. SHUTTERED SHOPFRONT RIGHT ──────────────────────────────────
      di(I.shop2, w * 0.78, ground - h * 0.28, w * 0.21, h * 0.28, 'multiply');

      // ── 11. TORII GATE ─────────────────────────────────────────────────
      di(I.arc, w * 0.535, h * 0.50, 82, 70);

      // ── 12. SAKURA TREES ───────────────────────────────────────────────
      di(I.sakura, w * 0.005, ground - h * 0.27, h * 0.27, h * 0.27);
      di(I.sakura, w * 0.09,  ground - h * 0.32, h * 0.32, h * 0.32);

      // ── 13. GROUND PLANE ───────────────────────────────────────────────
      // Warm sandstone sidewalk
      ctx.fillStyle = '#6a3a18';
      ctx.fillRect(0, ground, w, h * 0.028);
      // Subtle tile grid
      ctx.strokeStyle = 'rgba(255,180,100,0.06)'; ctx.lineWidth = 1;
      for (let tx2 = 0; tx2 < w; tx2 += 32) {
        ctx.beginPath(); ctx.moveTo(tx2, ground); ctx.lineTo(tx2, ground + h * 0.028); ctx.stroke();
      }
      // Dark warm asphalt
      const stG = ctx.createLinearGradient(0, ground + h * 0.028, 0, h);
      stG.addColorStop(0, '#1e0e06');
      stG.addColorStop(1, '#0e0606');
      ctx.fillStyle = stG;
      ctx.fillRect(0, ground + h * 0.028, w, h - ground - h * 0.028);
      // Sunset reflection on wet street
      const ref = ctx.createLinearGradient(w * 0.30, 0, w * 0.80, 0);
      ref.addColorStop(0,   'transparent');
      ref.addColorStop(0.5, 'rgba(255,130,35,0.16)');
      ref.addColorStop(1,   'transparent');
      ctx.fillStyle = ref;
      ctx.fillRect(0, ground + h * 0.028, w, h * 0.07);

      // ── 14. STREET LAMPS ───────────────────────────────────────────────
      di(I.lamp, w * 0.27 - h * 0.22 * 0.36, ground - h * 0.22, h * 0.22 * 0.72, h * 0.22);
      di(I.lamp, w * 0.69 - h * 0.22 * 0.36, ground - h * 0.22, h * 0.22 * 0.72, h * 0.22);

      // ── 15. PAPER LANTERN ──────────────────────────────────────────────
      di(I.lantern, w * 0.10, ground - h * 0.175, h * 0.10, h * 0.135);

      // ── 16. VENDING MACHINE ────────────────────────────────────────────
      di(I.vend, w * 0.46, ground - h * 0.125, h * 0.125 * 0.52, h * 0.125);

      // ── 17. TRADING CART ───────────────────────────────────────────────
      di(I.cart, w * 0.32, ground - h * 0.092, h * 0.092 * 1.62, h * 0.092);

      // ── 18. FALLING SAKURA PETALS ──────────────────────────────────────
      for (let i = 0; i < 28; i++) {
        const px = ((i * 179 + time * (0.012 + (i % 5) * 0.003)) % (w * 0.55));
        const py = ((i * 97  + time * (0.017 + (i % 3) * 0.005)) % (h * 0.80));
        const al = 0.28 + Math.sin(time * 0.002 + i * 0.8) * 0.14;
        ctx.fillStyle = \`rgba(255,158,195,\${al})\`;
        ctx.beginPath(); ctx.ellipse(px, py, 3, 2, time * 0.001 + i * 0.4, 0, Math.PI * 2); ctx.fill();
      }

      drawMemoryLabel(w * 0.10, ground - h * 0.38, '🌸', 'Ueno Park', 'Cherry Blossom Season');
    }`;

// Splice out the old background function and replace with new one
// endIdx points to start of '\n    },\n\n    platforms:'
// We want to keep the '\n\n    platforms:' part, so advance past '\n    },'
const before = src.slice(0, startIdx);
const after  = src.slice(endIdx + '\n    },'.length);  // keep '\n\n    platforms:...'
src = before + newBackground + after;

console.log('✓ Replacement B done (background function)');

writeFileSync(filePath, src, 'utf8');
console.log('✓ Written to', filePath);
