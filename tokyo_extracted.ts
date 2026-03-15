  tokyo: {
    name: '🗼 Tokyo Nights',
    playerStart: (w, h) => ({ x: 50, y: h * 0.85 }),
    background: (ctx, w, h, time) => {
      // ── Local label helper (same style as Japan scene) ───────────────
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

      // ── 1. NIGHT SKY ─────────────────────────────────────────────────
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.78);
      sky.addColorStop(0,    '#050512');
      sky.addColorStop(0.45, '#0c0825');
      sky.addColorStop(1,    '#180d3a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.78);

      // Stars — 80, seeded, twinkling
      for (let i = 0; i < 80; i++) {
        const sx = (i * 137 + 23) % w;
        const sy = (i * 79  + 11) % (h * 0.62);
        const twinkle = Math.sin(time * 0.0015 + i * 0.9) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.55})`;
        ctx.beginPath();
        ctx.arc(sx, sy, i % 5 === 0 ? 1.5 : 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // Horizon city light pollution (warm orange-amber glow)
      const horizGrad = ctx.createLinearGradient(0, h * 0.62, 0, h * 0.78);
      horizGrad.addColorStop(0, 'rgba(255,100,20,0)');
      horizGrad.addColorStop(1, 'rgba(255,100,20,0.14)');
      ctx.fillStyle = horizGrad;
      ctx.fillRect(0, h * 0.62, w, h * 0.16);

      // ── 2. BACKGROUND BUILDING SKYLINE ───────────────────────────────
      // [x_ratio, top_y_ratio, width_ratio] — gap at 0.44–0.72 for Tokyo Tower
      const bldgs: Array<[number, number, number]> = [
        [0.00, 0.52, 0.06], [0.06, 0.62, 0.05], [0.11, 0.40, 0.07], [0.18, 0.30, 0.06],
        [0.24, 0.54, 0.05], [0.29, 0.60, 0.05], [0.34, 0.44, 0.06], [0.40, 0.58, 0.04],
        [0.73, 0.46, 0.06], [0.79, 0.34, 0.07], [0.86, 0.52, 0.05], [0.91, 0.43, 0.05], [0.96, 0.56, 0.04],
      ];
      for (const [rx, ry, rw] of bldgs) {
        const bx = w * rx, bw2 = w * rw;
        const by = h * ry, bh2 = h * 0.78 - by;
        ctx.fillStyle = '#0a0a1c';
        ctx.fillRect(bx, by, bw2, bh2);
        // Window grid (seeded lit/unlit — ~50% of windows lit)
        const cols = Math.floor(bw2 / 8);
        const rows = Math.floor(bh2 / 10);
        for (let row = 1; row < rows - 1; row++) {
          for (let col = 0; col < cols; col++) {
            if (Math.sin(rx * 100 + row * 13 + col * 7) < 0.05) continue;
            const warm  = Math.sin(rx * 50 + row * 11 + col * 5) > 0.3;
            const alpha = 0.48 + Math.sin(time * 0.0004 + row * 0.3 + col * 0.5) * 0.08;
            ctx.fillStyle = warm
              ? `rgba(255,228,130,${alpha})`
              : `rgba(150,200,255,${alpha * 0.85})`;
            ctx.fillRect(bx + col * 8 + 2, by + row * 10 + 2, 5, 6);
          }
        }
        // Dark rooftop cap
        ctx.fillStyle = '#060610';
        ctx.fillRect(bx, by, bw2, 4);
      }

      // ── 3. TOKYO TOWER (hero element) ────────────────────────────────
      {
        const ttx   = w * 0.63;
        const ttBase = h * 0.78;
        const ttH   = h * 0.52;
        const ttBW  = Math.min(h * 0.13, 84);   // leg spread (wide base)
        const legH  = ttH * 0.27;                // height of leg A-frame section
        const bodyW = ttBW * 0.28;               // body width at leg junction

        // Atmospheric orange-red glow behind tower
        const tg = ctx.createRadialGradient(ttx, ttBase - ttH * 0.32, 8, ttx, ttBase - ttH * 0.32, ttH * 0.60);
        tg.addColorStop(0,   'rgba(255,130,20,0.22)');
        tg.addColorStop(0.4, 'rgba(255,80,10,0.09)');
        tg.addColorStop(1,   'transparent');
        ctx.fillStyle = tg;
        ctx.fillRect(ttx - ttH * 0.65, ttBase - ttH * 0.98, ttH * 1.3, ttH * 0.98);

        ctx.fillStyle = '#dd3300';

        // Outer-left leg
        ctx.beginPath();
        ctx.moveTo(ttx - ttBW / 2,         ttBase);
        ctx.lineTo(ttx - ttBW / 2 + 11,    ttBase);
        ctx.lineTo(ttx - bodyW / 2,         ttBase - legH);
        ctx.lineTo(ttx - bodyW / 2 - 10,    ttBase - legH);
        ctx.closePath(); ctx.fill();

        // Outer-right leg
        ctx.beginPath();
        ctx.moveTo(ttx + ttBW / 2,         ttBase);
        ctx.lineTo(ttx + ttBW / 2 - 11,    ttBase);
        ctx.lineTo(ttx + bodyW / 2,         ttBase - legH);
        ctx.lineTo(ttx + bodyW / 2 + 10,    ttBase - legH);
        ctx.closePath(); ctx.fill();

        // Inner-left leg
        ctx.beginPath();
        ctx.moveTo(ttx - ttBW * 0.24,      ttBase);
        ctx.lineTo(ttx - ttBW * 0.24 + 7,  ttBase);
        ctx.lineTo(ttx - bodyW / 2 + 4,    ttBase - legH);
        ctx.lineTo(ttx - bodyW / 2 - 3,    ttBase - legH);
        ctx.closePath(); ctx.fill();

        // Inner-right leg
        ctx.beginPath();
        ctx.moveTo(ttx + ttBW * 0.24,      ttBase);
        ctx.lineTo(ttx + ttBW * 0.24 - 7,  ttBase);
        ctx.lineTo(ttx + bodyW / 2 - 4,    ttBase - legH);
        ctx.lineTo(ttx + bodyW / 2 + 3,    ttBase - legH);
        ctx.closePath(); ctx.fill();

        // Horizontal cross-strut at mid-leg height
        ctx.fillRect(ttx - ttBW * 0.38, ttBase - legH * 0.54, ttBW * 0.76, 3.5);

        // Main tower body — tapered trapezoid above leg junction
        ctx.beginPath();
        ctx.moveTo(ttx - bodyW / 2, ttBase - legH);
        ctx.lineTo(ttx - 5,         ttBase - ttH);
        ctx.lineTo(ttx + 5,         ttBase - ttH);
        ctx.lineTo(ttx + bodyW / 2, ttBase - legH);
        ctx.closePath(); ctx.fill();

        // Observation deck 1 (at 40% height — ~150 m equivalent)
        const obs1Y = ttBase - ttH * 0.40;
        const obs1HW = bodyW * 0.65 + 14;
        ctx.fillStyle = '#ee4400';
        ctx.fillRect(ttx - obs1HW - 8, obs1Y - 5, obs1HW * 2 + 16, 11);
        ctx.fillStyle = '#dd3300';
        ctx.fillRect(ttx - obs1HW,     obs1Y,      obs1HW * 2,      6);

        // Observation deck 2 (at 63% height — ~250 m equivalent)
        const obs2Y = ttBase - ttH * 0.63;
        ctx.fillStyle = '#ee4400';
        ctx.fillRect(ttx - 22, obs2Y - 4, 44, 9);
        ctx.fillStyle = '#dd3300';
        ctx.fillRect(ttx - 15, obs2Y,     30, 5);

        // White horizontal bands (aviation markers, 6 bands up the body)
        ctx.fillStyle = 'rgba(255,255,255,0.76)';
        const bandStops = [0.32, 0.42, 0.52, 0.62, 0.72, 0.84];
        for (const prog of bandStops) {
          const bY = ttBase - ttH * prog;
          const factor = (prog - 0.27) / 0.73;
          const bW = Math.max(6, bodyW * (1 - factor * 0.84));
          ctx.fillRect(ttx - bW / 2, bY, bW, 2.5);
        }

        // Antenna spire
        ctx.fillStyle = '#cc3300';
        ctx.fillRect(ttx - 2, ttBase - ttH - 28, 4, 30);

        // Aviation blink light (red, flashing)
        const blinkOn = Math.sin(time * 0.004) > 0;
        ctx.fillStyle = blinkOn ? '#ff3300' : '#880000';
        ctx.beginPath();
        ctx.arc(ttx, ttBase - ttH - 25, 3.5, 0, Math.PI * 2);
        ctx.fill();
        if (blinkOn) {
          const bl = ctx.createRadialGradient(ttx, ttBase - ttH - 25, 0, ttx, ttBase - ttH - 25, 14);
          bl.addColorStop(0, 'rgba(255,50,0,0.55)');
          bl.addColorStop(1, 'transparent');
          ctx.fillStyle = bl;
          ctx.beginPath(); ctx.arc(ttx, ttBase - ttH - 25, 14, 0, Math.PI * 2); ctx.fill();
        }

        drawMemoryLabel(ttx, ttBase - ttH - 78, '🗼', 'Tokyo Tower', '333m · lit since 1958');
      }

      // ── 4. UENO PARK — CHERRY TREES (left zone, h ≈ 47–55%) ─────────
      {
        // 35 falling petals (restricted to left 62% of canvas)
        for (let i = 0; i < 35; i++) {
          const px = ((i * 179 + time * (0.013 + (i % 5) * 0.003)) % (w * 0.62));
          const py = ((i * 97  + time * (0.019 + (i % 3) * 0.006)) % (h * 0.82));
          const alpha = 0.26 + Math.sin(time * 0.002 + i * 0.8) * 0.16;
          ctx.fillStyle = `rgba(255,160,195,${alpha})`;
          ctx.beginPath();
          ctx.ellipse(px, py, 3, 2, time * 0.001 + i * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3 cherry trees
        const cherryTrees = [
          { x: w * 0.09, y: h * 0.53, s: 1.0 },
          { x: w * 0.18, y: h * 0.47, s: 1.25 },
          { x: w * 0.27, y: h * 0.54, s: 0.90 },
        ];
        for (const t of cherryTrees) {
          // Upward spotlight glow (trees are lit from below at night in Japan)
          const ug = ctx.createRadialGradient(t.x, t.y + 22, 0, t.x, t.y - 8, 52 * t.s);
          ug.addColorStop(0,   'rgba(255,120,160,0.24)');
          ug.addColorStop(0.5, 'rgba(255,80,140,0.07)');
          ug.addColorStop(1,   'transparent');
          ctx.fillStyle = ug;
          ctx.beginPath(); ctx.arc(t.x, t.y, 56 * t.s, 0, Math.PI * 2); ctx.fill();

          // Trunk
          ctx.fillStyle = '#3d1f0a';
          ctx.fillRect(t.x - 4, t.y, 8, 32 * t.s);

          // Two main branches
          ctx.strokeStyle = '#3d1f0a'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(t.x - 2, t.y + 8); ctx.lineTo(t.x - 22 * t.s, t.y - 10); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(t.x + 2, t.y + 8); ctx.lineTo(t.x + 18 * t.s, t.y - 7);  ctx.stroke();

          // Blossom crown — 7 overlapping pink blobs
          for (let b = 0; b < 7; b++) {
            const angle = (b / 7) * Math.PI * 2;
            const bx = t.x + Math.cos(angle) * 17 * t.s * 0.75;
            const by = t.y - 14 * t.s + Math.sin(angle) * 17 * t.s * 0.5;
            ctx.fillStyle = `rgba(255,148,185,${0.68 + (b % 3) * 0.08})`;
            ctx.beginPath(); ctx.arc(bx, by, 17 * t.s, 0, Math.PI * 2); ctx.fill();
          }
          // Pale highlight top
          ctx.fillStyle = 'rgba(255,215,230,0.42)';
          ctx.beginPath(); ctx.arc(t.x, t.y - 20 * t.s, 13 * t.s, 0, Math.PI * 2); ctx.fill();
        }
        drawMemoryLabel(w * 0.18, h * 0.31, '🌸', 'Ueno Park', 'Cherry Blossom Season');
      }

      // ── 5. GROUND & WET STREET ────────────────────────────────────────
      const gGrad = ctx.createLinearGradient(0, h * 0.78, 0, h);
      gGrad.addColorStop(0, '#090912');
      gGrad.addColorStop(1, '#050508');
      ctx.fillStyle = gGrad;
      ctx.fillRect(0, h * 0.78, w, h * 0.22);

      // Dashed centre-line road marking
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([20, 20]);
      ctx.beginPath(); ctx.moveTo(0, h * 0.90); ctx.lineTo(w, h * 0.90); ctx.stroke();
      ctx.setLineDash([]);

      // Wet neon reflections on road (vertical smears)
      const refs = [
        { x: w * 0.18, r: 255, g: 148, b: 185, a: 0.10, hw: 18 }, // cherry pink
        { x: w * 0.39, r: 255, g: 0,   b: 100, a: 0.12, hw: 20 }, // Shibuya pink
        { x: w * 0.63, r: 255, g: 100, b: 20,  a: 0.17, hw: 28 }, // tower orange
        { x: w * 0.73, r: 0,   g: 200, b: 255, a: 0.10, hw: 16 }, // Akihabara cyan
        { x: w * 0.88, r: 0,   g: 160, b: 80,  a: 0.10, hw: 18 }, // conbini green
      ];
      for (const r of refs) {
        const rg = ctx.createLinearGradient(r.x, h * 0.78, r.x, h);
        rg.addColorStop(0,   `rgba(${r.r},${r.g},${r.b},${r.a})`);
        rg.addColorStop(0.7, `rgba(${r.r},${r.g},${r.b},${r.a * 0.3})`);
        rg.addColorStop(1,   'transparent');
        ctx.fillStyle = rg;
        ctx.fillRect(r.x - r.hw, h * 0.78, r.hw * 2, h * 0.22);
      }

      // ── 6. SHIBUYA SCRAMBLE CROSSING (ground, left-centre) ───────────
      {
        const scx = w * 0.22, scy = h * 0.78;
        const scw = w * 0.28;

        // Zebra stripes (horizontal)
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        for (let s = 0; s < 4; s++) ctx.fillRect(scx, scy + 20 + s * 22, scw, 10);

        // Diagonal scramble stripes (Shibuya has crossing in all directions)
        ctx.save();
        ctx.globalAlpha = 0.055;
        ctx.fillStyle = '#ffffff';
        for (let d = -2; d < 8; d++) {
          ctx.beginPath();
          ctx.moveTo(scx + d * 30,        scy);
          ctx.lineTo(scx + d * 30 + scw * 0.28,        scy + h * 0.22);
          ctx.lineTo(scx + d * 30 + scw * 0.28 + 14,   scy + h * 0.22);
          ctx.lineTo(scx + d * 30 + 14,   scy);
          ctx.fill();
        }
        ctx.restore();

        // 10 walking pedestrian silhouettes
        for (let p = 0; p < 10; p++) {
          const speed = 0.00022 + (p % 4) * 0.00007;
          const walk  = ((p * 0.1 + time * speed) % 1);
          const dir   = p % 2 === 0 ? 1 : -1;
          const px2   = dir === 1 ? scx + walk * scw : scx + scw * (1 - walk);
          const py2   = scy + 24 + (p % 5) * 20;
          ctx.fillStyle = `rgba(210,220,240,${0.60 + (p % 3) * 0.12})`;
          ctx.beginPath(); ctx.arc(px2, py2 - 12, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(px2 - 3.5, py2 - 8, 7, 11);
        }

        // SHIBUYA 109 billboard (above crossing) — animated neon
        const bbX = w * 0.28, bbY = h * 0.58;
        const bbW = w * 0.15, bbH = h * 0.19;
        const bbF = 0.80 + Math.sin(time * 0.006) * 0.20; // flicker
        ctx.fillStyle = '#08080f';
        ctx.fillRect(bbX, bbY, bbW, bbH);
        ctx.strokeStyle = `rgba(255,0,100,${bbF})`;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(bbX, bbY, bbW, bbH);
        const bbG = ctx.createLinearGradient(bbX, bbY, bbX + bbW, bbY);
        bbG.addColorStop(0,   `rgba(255,0,80,${bbF * 0.06})`);
        bbG.addColorStop(0.5, `rgba(255,0,80,${bbF * 0.14})`);
        bbG.addColorStop(1,   `rgba(255,0,80,${bbF * 0.06})`);
        ctx.fillStyle = bbG;
        ctx.fillRect(bbX, bbY, bbW, bbH);
        ctx.textAlign = 'center';
        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = `rgba(255,30,110,${bbF})`;
        ctx.fillText('渋谷', bbX + bbW / 2, bbY + bbH * 0.40);
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = `rgba(255,160,205,${bbF * 0.9})`;
        ctx.fillText('SHIBUYA', bbX + bbW / 2, bbY + bbH * 0.62);
        ctx.font = '8px monospace';
        ctx.fillStyle = `rgba(200,120,160,${bbF * 0.7})`;
        ctx.fillText('スクランブル交差点', bbX + bbW / 2, bbY + bbH * 0.82);
        ctx.textAlign = 'left';

        drawMemoryLabel(scx + scw / 2, scy - 44, '🚶', 'Shibuya Crossing', 'スクランブル交差点');
      }

      // ── 7. AKIHABARA NEON BUILDING (centre, h ≈ 42–78%) ─────────────
      {
        const akx = w * 0.47, aky = h * 0.42;
        const akW = w * 0.12, akH = h * 0.36;

        // Building facade
        ctx.fillStyle = '#080820';
        ctx.fillRect(akx, aky, akW, akH);

        // Stacked neon sign panels
        const neonSigns = [
          { label: '秋葉原', sub: 'AKIHABARA', r: 0,   g: 204, b: 255, bg: '#001530' },
          { label: 'アニメ', sub: 'ANIME',     r: 255, g: 0,   b: 204, bg: '#1a0018' },
          { label: 'ゲーム', sub: 'GAME',      r: 255, g: 204, b: 0,   bg: '#1a1400' },
          { label: 'まんが', sub: 'MANGA',     r: 255, g: 60,  b: 60,  bg: '#1a0000' },
        ];
        const signH = (akH - 12) / neonSigns.length;
        for (let i = 0; i < neonSigns.length; i++) {
          const sg      = neonSigns[i];
          const sy      = aky + 6 + i * signH;
          const flicker = 0.72 + Math.sin(time * (0.0042 + i * 0.0025) + i * 1.8) * 0.28;
          ctx.fillStyle = sg.bg;
          ctx.fillRect(akx + 4, sy + 2, akW - 8, signH - 4);
          ctx.globalAlpha = flicker;
          ctx.strokeStyle = `rgb(${sg.r},${sg.g},${sg.b})`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(akx + 4, sy + 2, akW - 8, signH - 4);
          ctx.font = `bold ${Math.min(14, Math.floor(signH * 0.48))}px monospace`;
          ctx.fillStyle = `rgb(${sg.r},${sg.g},${sg.b})`;
          ctx.textAlign = 'center';
          ctx.fillText(sg.label, akx + akW / 2, sy + signH * 0.46);
          ctx.font = `${Math.min(8, Math.floor(signH * 0.30))}px monospace`;
          ctx.fillText(sg.sub,   akx + akW / 2, sy + signH * 0.75);
          ctx.globalAlpha = 1;
          // Subtle colour bleed onto surrounding facade
          ctx.fillStyle = `rgba(${sg.r},${sg.g},${sg.b},${flicker * 0.06})`;
          ctx.fillRect(akx - 4, sy, akW + 8, signH);
          ctx.textAlign = 'left';
        }
        drawMemoryLabel(akx + akW / 2, aky - 56, '🎌', 'Akihabara', 'Electric Town · 電気街');
      }

      // ── 8. GOLDEN GAI IZAKAYA ALLEY (right mid, h ≈ 55–78%) ─────────
      {
        const gx = w * 0.73, gy = h * 0.55;

        // Overhead power wires (quintessentially Tokyo)
        ctx.strokeStyle = 'rgba(60,60,80,0.55)'; ctx.lineWidth = 1.2;
        for (let wi = 0; wi < 3; wi++) {
          ctx.beginPath();
          ctx.moveTo(w * 0.50, gy - 24 + wi * 7);
          ctx.quadraticCurveTo(w * 0.72, gy - 32 + wi * 7, w * 0.96, gy - 18 + wi * 7);
          ctx.stroke();
        }

        // 3 small izakaya buildings
        for (let b = 0; b < 3; b++) {
          const bx = gx + b * 46;
          const by = gy + (b % 2) * 9;
          // Dark wood body
          ctx.fillStyle = '#12100a';
          ctx.fillRect(bx, by, 40, 70);
          // Wood plank texture
          ctx.strokeStyle = '#0a0805'; ctx.lineWidth = 1;
          for (let pl = 1; pl < 6; pl++) {
            ctx.beginPath(); ctx.moveTo(bx, by + pl * 11); ctx.lineTo(bx + 40, by + pl * 11); ctx.stroke();
          }
          // Warm glowing window
          ctx.fillStyle = 'rgba(255,160,50,0.70)';
          ctx.fillRect(bx + 6, by + 9, 28, 22);
          const wg = ctx.createRadialGradient(bx + 20, by + 20, 0, bx + 20, by + 20, 30);
          wg.addColorStop(0, 'rgba(255,140,30,0.28)');
          wg.addColorStop(1, 'transparent');
          ctx.fillStyle = wg;
          ctx.fillRect(bx - 10, by - 10, 60, 60);
          // Noren curtain below window
          ctx.fillStyle = '#18090a';
          ctx.fillRect(bx + 6, by + 31, 28, 10);
          ctx.strokeStyle = '#aa1800'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(bx + 6, by + 31); ctx.lineTo(bx + 34, by + 31); ctx.stroke();
        }

        // 5 red paper lanterns (gently swaying)
        for (let l = 0; l < 5; l++) {
          const lx = gx + l * 28 + Math.sin(time * 0.0015 + l * 0.9) * 3.5;
          const ly = gy - 16;
          ctx.strokeStyle = 'rgba(100,80,60,0.6)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(lx, gy - 30); ctx.lineTo(lx, ly - 10); ctx.stroke();
          ctx.fillStyle = '#bb1100';
          ctx.beginPath(); ctx.ellipse(lx, ly, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#880000';
          ctx.fillRect(lx - 4, ly - 11, 8, 3);
          ctx.fillRect(lx - 4, ly + 8,  8, 3);
          const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 18);
          lg.addColorStop(0, 'rgba(255,80,10,0.38)');
          lg.addColorStop(1, 'transparent');
          ctx.fillStyle = lg;
          ctx.beginPath(); ctx.arc(lx, ly, 18, 0, Math.PI * 2); ctx.fill();
        }

        // Izakaya sign banner
        ctx.fillStyle = '#6b0a00';
        ctx.fillRect(gx - 2, gy - 38, 140, 20);
        ctx.strokeStyle = '#cc2200'; ctx.lineWidth = 1.5;
        ctx.strokeRect(gx - 2, gy - 38, 140, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('居酒屋  GOLDEN GAI', gx + 4, gy - 24);

        drawMemoryLabel(gx + 70, gy - 92, '🍶', 'Golden Gai', 'Shinjuku izakaya alley');
      }

      // ── 9. CONVENIENCE STORE — conbini glow (right, ground level) ────
      {
        const cvx = w * 0.87, cvy = h * 0.67;
        // Building
        ctx.fillStyle = '#0a0a16';
        ctx.fillRect(cvx, cvy, 70, 60);
        // 7-Eleven style colour stripes
        ctx.fillStyle = '#006633';
        ctx.fillRect(cvx, cvy, 70, 13);
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(cvx, cvy + 13, 70, 5);
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(cvx, cvy + 18, 70, 4);
        // Bright fluorescent interior (conbinis glow intensely at night)
        const cvG = ctx.createLinearGradient(cvx, cvy + 22, cvx + 70, cvy + 22);
        cvG.addColorStop(0,   'rgba(200,220,255,0.20)');
        cvG.addColorStop(0.5, 'rgba(205,225,255,0.32)');
        cvG.addColorStop(1,   'rgba(200,220,255,0.20)');
        ctx.fillStyle = cvG;
        ctx.fillRect(cvx, cvy + 22, 70, 38);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('コンビニ', cvx + 35, cvy + 10);
        ctx.textAlign = 'left';
        // Ground light spill on wet pavement
        const gs = ctx.createRadialGradient(cvx + 35, cvy + 60, 0, cvx + 35, cvy + 60, 50);
        gs.addColorStop(0, 'rgba(200,220,255,0.16)');
        gs.addColorStop(1, 'transparent');
        ctx.fillStyle = gs;
        ctx.beginPath(); ctx.arc(cvx + 35, cvy + 60, 50, 0, Math.PI * 2); ctx.fill();
      }
    },