  tokyo: {
    name: '🗼 Tokyo Nights',
    playerStart: (w, h) => ({ x: 50, y: h * 0.85 }),
    background: (ctx, w, h, time) => {
      // ── Layer 1: Night sky ──────────────────────────────────────────
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0,   '#050510');
      sky.addColorStop(0.4, '#120820');
      sky.addColorStop(1,   '#1a0a30');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Stars (120, seeded, twinkling)
      for (let i = 0; i < 120; i++) {
        const sx = (i * 137 + 23) % w;
        const sy = (i * 79  + 11) % (h * 0.72);
        const twinkle = Math.sin(time * 0.0015 + i * 0.7) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255,255,255,${0.25 + twinkle * 0.65})`;
        ctx.beginPath();
        ctx.arc(sx, sy, i % 3 === 0 ? 1.5 : 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Horizon city glow (orange/pink)
      const horizonGlow = ctx.createRadialGradient(w * 0.5, h * 0.75, 0, w * 0.5, h * 0.75, w * 0.55);
      horizonGlow.addColorStop(0,   'rgba(255,100,30,0.18)');
      horizonGlow.addColorStop(0.5, 'rgba(220,40,120,0.09)');
      horizonGlow.addColorStop(1,   'transparent');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      // ── Layer 2: Background skyline buildings ───────────────────────
      const buildingDefs = [
        { rx: 0.02, rh: 0.55, rw: 0.07 },
        { rx: 0.10, rh: 0.42, rw: 0.06 },
        { rx: 0.17, rh: 0.62, rw: 0.08 },
        { rx: 0.25, rh: 0.38, rw: 0.05 },
        { rx: 0.60, rh: 0.50, rw: 0.07 },
        { rx: 0.68, rh: 0.65, rw: 0.08 },
        { rx: 0.76, rh: 0.40, rw: 0.05 },
        { rx: 0.90, rh: 0.48, rw: 0.07 },
      ];
      for (const b of buildingDefs) {
        const bx = w * b.rx;
        const bw = w * b.rw;
        const bh = h * b.rh;
        const by = h * 0.78 - bh;
        ctx.fillStyle = '#0d0d22';
        ctx.fillRect(bx, by, bw, bh);
        // Windows
        const cols = Math.floor(bw / 9);
        const rows = Math.floor(bh / 12);
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const seed = Math.sin(b.rx * 100 + row * 7 + col * 3) > 0.1;
            if (!seed) continue;
            const wx = bx + col * 9 + 2;
            const wy = by + row * 12 + 3;
            ctx.fillStyle = Math.sin(b.rx * 50 + row + col) > 0 ? 'rgba(255,240,160,0.7)' : 'rgba(180,220,255,0.5)';
            ctx.fillRect(wx, wy, 5, 6);
          }
        }
        // Antenna on tallest building
        if (b.rh > 0.55) {
          ctx.fillStyle = '#333355';
          ctx.fillRect(bx + bw / 2 - 1, by - 18, 2, 18);
          // Blinking red dot
          const blinkOn = Math.sin(time * 0.003) > 0;
          ctx.fillStyle = blinkOn ? '#ff2200' : '#660000';
          ctx.beginPath();
          ctx.arc(bx + bw / 2, by - 18, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Layer 3: Meiji Shrine torii gate (far right, upper) ─────────
      {
        const tx = w * 0.80;
        const ty = h * 0.18;
        const vermillion = '#cc2200';
        // Two vertical posts
        ctx.fillStyle = vermillion;
        ctx.fillRect(tx,      ty, 14, 110);
        ctx.fillRect(tx + 92, ty, 14, 110);
        // Top kasagi beam
        ctx.fillStyle = vermillion;
        ctx.fillRect(tx - 8, ty, 122, 16);
        // Slight upward-curve suggestion at ends (dark underside)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(tx - 8, ty + 12, 14, 4);
        ctx.fillRect(tx + 108, ty + 12, 14, 4);
        // Nuki second beam (22px below)
        ctx.fillStyle = vermillion;
        ctx.fillRect(tx + 5, ty + 38, 98, 10);
        // Stone lanterns flanking
        for (const lx of [tx - 22, tx + 118]) {
          ctx.fillStyle = '#888899';
          ctx.fillRect(lx, ty + 70, 12, 30);  // post
          ctx.fillStyle = '#666677';
          // trapezoid top: simple rect
          ctx.fillRect(lx - 3, ty + 64, 18, 8);
          // Orange window glow
          ctx.fillStyle = 'rgba(255,160,60,0.8)';
          ctx.fillRect(lx + 2, ty + 80, 8, 8);
          const lg = ctx.createRadialGradient(lx + 6, ty + 84, 0, lx + 6, ty + 84, 14);
          lg.addColorStop(0, 'rgba(255,160,60,0.3)');
          lg.addColorStop(1, 'transparent');
          ctx.fillStyle = lg;
          ctx.fillRect(lx - 8, ty + 70, 28, 28);
        }
        // Sign panel between posts: 明治神宮
        ctx.fillStyle = '#8b1000';
        ctx.fillRect(tx + 18, ty + 48, 72, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('明治神宮', tx + 54, ty + 61);
        // Memory label
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(tx - 10, ty - 18, 130, 15);
        ctx.fillStyle = '#ffccaa';
        ctx.font = '8px monospace';
        ctx.fillText('⛩️ Meiji Shrine', tx + 55, ty - 7);
        ctx.textAlign = 'left';
      }

      // ── Layer 4: Ueno Park cherry trees (left-centre) ───────────────
      {
        // Falling petals (40 pink petals, diagonal drift)
        for (let i = 0; i < 40; i++) {
          const px = ((i * 173 + time * (0.015 + (i % 5) * 0.004)) % (w + 20)) - 10;
          const py = ((i * 97  + time * (0.025 + (i % 3) * 0.006)) % (h * 0.9));
          const alpha = 0.4 + Math.sin(time * 0.002 + i) * 0.3;
          ctx.fillStyle = `rgba(255,180,210,${alpha})`;
          ctx.beginPath();
          ctx.ellipse(px, py, 3, 2, time * 0.001 + i, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pagoda silhouette (bg, dark)
        const pgx = w * 0.20;
        const pgy = h * 0.30;
        const tiers = [
          { w: 34, h: 8, dy: 0  },
          { w: 28, h: 8, dy: 14 },
          { w: 22, h: 8, dy: 27 },
          { w: 16, h: 8, dy: 39 },
          { w: 10, h: 8, dy: 50 },
        ];
        for (const t of tiers) {
          ctx.fillStyle = '#0d0d22';
          ctx.fillRect(pgx - t.w / 2, pgy + t.dy, t.w, t.h - 2);
          // Curved roof suggestion (slight wider overhang painted dark)
          ctx.fillStyle = '#1a0a30';
          ctx.fillRect(pgx - t.w / 2 - 4, pgy + t.dy, t.w + 8, 3);
        }
        // Spire
        ctx.fillStyle = '#0d0d22';
        ctx.fillRect(pgx - 1, pgy - 12, 2, 14);

        // 3 cherry trees
        const cherryTrees = [
          { x: w * 0.13, y: h * 0.48 },
          { x: w * 0.21, y: h * 0.44 },
          { x: w * 0.29, y: h * 0.47 },
        ];
        for (const ct of cherryTrees) {
          // Trunk
          ctx.fillStyle = '#6b3a1f';
          ctx.fillRect(ct.x - 3, ct.y, 6, 28);
          // Blossom crown (4 overlapping circles)
          for (let b = 0; b < 5; b++) {
            const angle = (b / 5) * Math.PI * 2;
            const bx = ct.x + Math.cos(angle) * 14;
            const by = ct.y - 12 + Math.sin(angle) * 9;
            ctx.fillStyle = 'rgba(255,150,185,0.80)';
            ctx.beginPath();
            ctx.arc(bx, by, 16, 0, Math.PI * 2);
            ctx.fill();
          }
          // Top highlight
          ctx.fillStyle = 'rgba(255,210,230,0.55)';
          ctx.beginPath();
          ctx.arc(ct.x, ct.y - 20, 11, 0, Math.PI * 2);
          ctx.fill();
        }
        // Memory label
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(w * 0.10, h * 0.38, 100, 15);
        ctx.fillStyle = '#ffccee';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🌸 Ueno Park', w * 0.20 + 20, h * 0.38 + 11);
        ctx.textAlign = 'left';
      }

      // ── Layer 5: Ground + Shibuya crossing ──────────────────────────
      // Ground
      ctx.fillStyle = '#111120';
      ctx.fillRect(0, h * 0.82, w, h * 0.18);

      // Zebra crossing (6 stripes, w*0.28..w*0.62)
      const crossX = w * 0.28;
      const crossW = w * 0.34;
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      for (let s = 0; s < 6; s++) {
        ctx.fillRect(crossX, h * 0.82 + s * 24, crossW, 10);
      }

      // Billboard above crossing
      const bbFlicker = 0.85 + Math.sin(time * 0.007) * 0.15;
      ctx.fillStyle = `rgba(20,0,40,0.92)`;
      ctx.fillRect(w * 0.33, h * 0.70, w * 0.22, h * 0.11);
      ctx.strokeStyle = `rgba(255,0,128,${bbFlicker})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.33, h * 0.70, w * 0.22, h * 0.11);
      ctx.fillStyle = `rgba(255,50,180,${bbFlicker})`;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('渋谷', w * 0.44, h * 0.765);
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = `rgba(255,180,255,${bbFlicker})`;
      ctx.fillText('SHIBUYA', w * 0.44, h * 0.785);
      ctx.textAlign = 'left';

      // Pedestrian silhouettes (8 people walking)
      const people = [
        { offset: 0.05, speed: 0.04, dir: 1 },
        { offset: 0.15, speed: 0.035, dir: -1 },
        { offset: 0.30, speed: 0.05,  dir: 1 },
        { offset: 0.45, speed: 0.03,  dir: -1 },
        { offset: 0.60, speed: 0.045, dir: 1 },
        { offset: 0.70, speed: 0.038, dir: -1 },
        { offset: 0.82, speed: 0.042, dir: 1 },
        { offset: 0.92, speed: 0.033, dir: -1 },
      ];
      for (const p of people) {
        const walk = ((p.offset + time * p.speed * 0.001 * p.dir) % 1 + 1) % 1;
        const px = crossX + walk * crossW;
        const py = h * 0.845;
        ctx.fillStyle = 'rgba(200,200,255,0.75)';
        ctx.beginPath();
        ctx.arc(px, py - 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(px - 4, py - 10, 8, 11);
      }

      // Crossing memory label
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(w * 0.28, h * 0.815, 120, 15);
      ctx.fillStyle = '#aaddff';
      ctx.font = '8px monospace';
      ctx.fillText('🚶 Shibuya Crossing', w * 0.285, h * 0.815 + 11);

      // ── Layer 6: Yakitori bar street (bottom-left) ───────────────────
      {
        const ysx = w * 0.06;
        const ysy = h * 0.68;

        // 3 stalls
        for (let s = 0; s < 3; s++) {
          const sx = ysx + s * 36;
          ctx.fillStyle = '#2a1a08';
          ctx.fillRect(sx, ysy, 30, 28);
          // Counter ledge
          ctx.fillStyle = '#4a2e10';
          ctx.fillRect(sx - 3, ysy + 24, 36, 4);
          // Warm window glow
          ctx.fillStyle = 'rgba(255,160,60,0.65)';
          ctx.fillRect(sx + 4, ysy + 6, 20, 14);
          const wg = ctx.createRadialGradient(sx + 14, ysy + 13, 0, sx + 14, ysy + 13, 22);
          wg.addColorStop(0, 'rgba(255,160,60,0.25)');
          wg.addColorStop(1, 'transparent');
          ctx.fillStyle = wg;
          ctx.fillRect(sx - 8, ysy, 46, 40);
        }

        // Smoke puffs rising
        for (let s = 0; s < 3; s++) {
          for (let p = 0; p < 2; p++) {
            const smokeAge = ((time * 0.0008 + s * 0.4 + p * 0.2) % 1);
            const sx2 = ysx + s * 36 + 14 + p * 8;
            const sy2 = ysy - smokeAge * 30;
            const alpha = (1 - smokeAge) * 0.35;
            ctx.fillStyle = `rgba(200,180,150,${alpha})`;
            ctx.beginPath();
            ctx.arc(sx2, sy2, 4 + smokeAge * 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Hanging red lanterns (5, above stalls)
        for (let l = 0; l < 5; l++) {
          const lx = ysx + l * 22 + Math.sin(time * 0.0015 + l) * 3;
          const ly = ysy - 18;
          // String
          ctx.strokeStyle = '#555';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(lx, ysy - 30);
          ctx.lineTo(lx, ly - 7);
          ctx.stroke();
          // Lantern body
          ctx.fillStyle = '#cc1100';
          ctx.beginPath();
          ctx.ellipse(lx, ly, 7, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Glow
          const lg2 = ctx.createRadialGradient(lx, ly, 0, lx, ly, 16);
          lg2.addColorStop(0, 'rgba(255,80,0,0.25)');
          lg2.addColorStop(1, 'transparent');
          ctx.fillStyle = lg2;
          ctx.beginPath();
          ctx.arc(lx, ly, 16, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sign board
        ctx.fillStyle = '#8b1000';
        ctx.fillRect(ysx, ysy - 32, 108, 14);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('焼き鳥  YAKITORI', ysx + 4, ysy - 22);

        // Memory label
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(ysx, ysy + 32, 130, 15);
        ctx.fillStyle = '#ffddaa';
        ctx.font = '8px monospace';
        ctx.fillText('🍢 Yakitori Bar Street', ysx + 3, ysy + 43);
      }

      // ── Layer 7: Akihabara section (mid, platforms 2–3 area) ─────────
      {
        const akx = w * 0.38;
        const aky = h * 0.45;

        // Neon billboard Panel A (tall, cyan)
        const flickA = 0.8 + Math.sin(time * 0.011) * 0.2;
        ctx.fillStyle = `rgba(0,30,50,0.92)`;
        ctx.fillRect(akx, aky, 58, 80);
        ctx.strokeStyle = `rgba(0,204,255,${flickA})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(akx, aky, 58, 80);
        ctx.fillStyle = `rgba(0,204,255,${flickA})`;
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('電気街', akx + 29, aky + 24);
        ctx.font = 'bold 8px monospace';
        ctx.fillText('AKIHABARA', akx + 29, aky + 40);

        // Panel B (hot pink, anime)
        const flickB = 0.8 + Math.sin(time * 0.009 + 1) * 0.2;
        ctx.fillStyle = `rgba(40,0,30,0.92)`;
        ctx.fillRect(akx + 64, aky + 10, 70, 40);
        ctx.strokeStyle = `rgba(255,0,128,${flickB})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(akx + 64, aky + 10, 70, 40);
        ctx.fillStyle = `rgba(255,0,200,${flickB})`;
        ctx.font = 'bold 12px monospace';
        ctx.fillText('アニメ', akx + 99, aky + 32);
        // Star bursts
        for (let s = 0; s < 3; s++) {
          ctx.fillStyle = `rgba(255,220,0,${flickB * 0.8})`;
          ctx.beginPath();
          ctx.arc(akx + 70 + s * 20, aky + 44, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Panel C (yellow, manga)
        const flickC = 0.8 + Math.sin(time * 0.013 + 2) * 0.2;
        ctx.fillStyle = `rgba(30,20,0,0.92)`;
        ctx.fillRect(akx + 64, aky + 56, 70, 36);
        ctx.strokeStyle = `rgba(255,200,0,${flickC})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(akx + 64, aky + 56, 70, 36);
        ctx.fillStyle = `rgba(255,220,0,${flickC})`;
        ctx.font = 'bold 10px monospace';
        ctx.fillText('ANIME  漫画', akx + 99, aky + 79);

        // Dragon Ball Z / Goku-like figure
        const gokux = w * 0.50;
        const gokuy = h * 0.52 + Math.sin(time * 0.002) * 3;
        // Aura (pulsing gold glow)
        const auraPulse = 18 + Math.sin(time * 0.003) * 6;
        const aura = ctx.createRadialGradient(gokux, gokuy, 0, gokux, gokuy, auraPulse * 2);
        aura.addColorStop(0, 'rgba(255,200,0,0.4)');
        aura.addColorStop(0.5, 'rgba(255,150,0,0.15)');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(gokux, gokuy, auraPulse * 2, 0, Math.PI * 2);
        ctx.fill();
        // Body (orange jacket)
        ctx.fillStyle = '#e87020';
        ctx.fillRect(gokux - 7, gokuy, 14, 20);
        // Head
        ctx.fillStyle = '#f5c07a';
        ctx.beginPath();
        ctx.arc(gokux, gokuy - 6, 8, 0, Math.PI * 2);
        ctx.fill();
        // Spiky hair (5 gold/orange triangles)
        ctx.fillStyle = '#f0a000';
        const hairSpikes = [-2, -1, 0, 1, 2];
        for (const hs of hairSpikes) {
          const hx = gokux + hs * 5;
          ctx.beginPath();
          ctx.moveTo(hx, gokuy - 12);
          ctx.lineTo(hx - 4, gokuy - 4);
          ctx.lineTo(hx + 4, gokuy - 4);
          ctx.closePath();
          ctx.fill();
        }
        // Name badge
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(gokux - 36, gokuy + 22, 72, 13);
        ctx.fillStyle = '#ffdd44';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ドラゴンボール Z', gokux, gokuy + 32);

        // Akihabara memory label
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(akx, aky - 18, 100, 15);
        ctx.fillStyle = '#00eeff';
        ctx.font = '8px monospace';
        ctx.fillText('🎌 Akihabara', akx + 50, aky - 7);
        ctx.textAlign = 'left';
      }

      // ── Layer 8: Street-level Japanese signs ────────────────────────
      const signs = [
        { x: w * 0.03, y: h * 0.55, bg: '#111144', text: '東京',     fg: '#ffffff', w2: 36 },
        { x: w * 0.35, y: h * 0.60, bg: '#aa1100', text: 'ラーメン', fg: '#ffff88', w2: 52 },
        { x: w * 0.65, y: h * 0.58, bg: '#4a2800', text: '居酒屋',   fg: '#ffcc66', w2: 46 },
        { x: w * 0.72, y: h * 0.74, bg: '#ccaa00', text: 'タクシー', fg: '#111111', w2: 48 },
        { x: w * 0.85, y: h * 0.60, bg: '#006622', text: 'コンビニ', fg: '#ffffff', w2: 50 },
      ];
      for (const sg of signs) {
        ctx.fillStyle = sg.bg;
        ctx.fillRect(sg.x, sg.y, sg.w2, 16);
        ctx.fillStyle = sg.fg;
        ctx.font = 'bold 10px monospace';
        ctx.fillText(sg.text, sg.x + 3, sg.y + 12);
      }
    },

    platforms: (w, h) => [
      { x: w * 0.05, y: h * 0.80, width: w * 0.22, height: 18 },
      { x: w * 0.30, y: h * 0.65, width: w * 0.20, height: 18 },
      { x: w * 0.55, y: h * 0.50, width: w * 0.20, height: 18 },
      { x: w * 0.75, y: h * 0.35, width: w * 0.20, height: 18 },
    ],

    drawPlatforms: (ctx, platforms) => {
      for (const p of platforms) {
        // Concrete body
        ctx.fillStyle = '#2a2a3e';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        // Neon top edge (hot pink)
        ctx.fillStyle = '#ff0080';
        ctx.fillRect(p.x, p.y, p.width, 3);
        // Glow under neon
        ctx.fillStyle = 'rgba(255,0,128,0.15)';
        ctx.fillRect(p.x, p.y + 3, p.width, 6);
      }
    },

    memory: (w, h) => ({ x: w * 0.82, y: h * 0.35 - 60, type: 'portal', description: 'Tokyo — the city that never sleeps' }),
    drawMemory: (ctx, mem, time) => {
      const pulse = Math.sin(time * 0.003) * 5;
      // Torii-red spinning rings
      for (let i = 5; i > 0; i--) {
        ctx.strokeStyle = `rgba(204,34,0,${0.15 + i * 0.1})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(mem.x, mem.y, 15 + i * 6 + pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Orbiting cherry blossom petals (pink dots)
      for (let i = 0; i < 6; i++) {
        const angle = time * 0.0025 + (i * Math.PI * 2) / 6;
        const orbitR = 38 + pulse;
        const px = mem.x + Math.cos(angle) * orbitR;
        const py = mem.y + Math.sin(angle) * orbitR;
        ctx.fillStyle = 'rgba(255,150,185,0.9)';
        ctx.beginPath();
        ctx.ellipse(px, py, 4, 3, angle, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
};