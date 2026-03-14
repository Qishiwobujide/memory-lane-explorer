import { Scene } from './types';

// Pre-load the Naked Castle logo (used in castle scene background)
const _ncLogo = new Image();
_ncLogo.src = '/NakedCastleLogo.png';

// Pre-load the Naked Stable logo (used above the hilltop chalets)
const _nsLogo = new Image();
_nsLogo.src = '/NakedStableLogo.png';

export const scenes: Record<string, Scene> = {
  japan: {
    name: '⛷️ Snowboarding in Japan',
    snowboarding: true,
    playerStart: (w, h) => ({ x: 50, y: h * 0.25 }),
    background: (ctx, w, h, time) => {
      // Sky gradient - deep mountain blue
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1a3a5c');
      grad.addColorStop(0.35, '#3a6e9e');
      grad.addColorStop(0.65, '#a8d0e8');
      grad.addColorStop(1, '#dff0f8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sun glow
      const sunX = w * 0.82;
      const sunY = h * 0.1;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 120);
      sunGlow.addColorStop(0, 'rgba(255,255,210,0.9)');
      sunGlow.addColorStop(0.25, 'rgba(255,240,160,0.35)');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(sunX - 130, sunY - 130, 260, 260);
      ctx.fillStyle = 'rgba(255,255,220,0.97)';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
      ctx.fill();

      // Distant mountain peaks
      const peaks = [
        { x: 0.05, peak: 0.28, w: 0.28 },
        { x: 0.2, peak: 0.18, w: 0.32 },
        { x: 0.45, peak: 0.22, w: 0.28 },
        { x: 0.62, peak: 0.14, w: 0.3 },
        { x: 0.8, peak: 0.24, w: 0.25 },
      ];
      for (const p of peaks) {
        ctx.fillStyle = '#4a7da0';
        ctx.beginPath();
        ctx.moveTo(w * p.x, h * 0.62);
        ctx.lineTo(w * (p.x + p.w / 2), h * p.peak);
        ctx.lineTo(w * (p.x + p.w), h * 0.62);
        ctx.fill();
        // Snow cap
        ctx.fillStyle = 'rgba(230,245,255,0.92)';
        ctx.beginPath();
        ctx.moveTo(w * (p.x + p.w / 2), h * p.peak);
        ctx.lineTo(w * (p.x + p.w / 2 - 0.04), h * (p.peak + 0.1));
        ctx.lineTo(w * (p.x + p.w / 2 + 0.04), h * (p.peak + 0.1));
        ctx.fill();
      }

      // Main snow slope — big diagonal hill left-top to right-bottom
      const slopeGrad = ctx.createLinearGradient(0, h * 0.2, w, h);
      slopeGrad.addColorStop(0, '#e8f6ff');
      slopeGrad.addColorStop(0.5, '#d0eaf8');
      slopeGrad.addColorStop(1, '#c0e0f0');
      ctx.fillStyle = slopeGrad;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.22);
      ctx.bezierCurveTo(w * 0.25, h * 0.3, w * 0.5, h * 0.55, w * 0.75, h * 0.72);
      ctx.lineTo(w, h * 0.82);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Slope shading / shadow strip
      ctx.fillStyle = 'rgba(80,130,180,0.12)';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.22);
      ctx.bezierCurveTo(w * 0.25, h * 0.3, w * 0.5, h * 0.55, w * 0.75, h * 0.72);
      ctx.lineTo(w, h * 0.82);
      ctx.lineTo(w, h * 0.87);
      ctx.bezierCurveTo(w * 0.75, h * 0.77, w * 0.5, h * 0.6, w * 0.25, h * 0.35);
      ctx.lineTo(0, h * 0.27);
      ctx.fill();

      // Ski tracks (parallel lines down the slope)
      ctx.strokeStyle = 'rgba(160,210,240,0.5)';
      ctx.lineWidth = 2;
      for (let t = 0; t < 6; t++) {
        const offset = t * 0.05;
        ctx.beginPath();
        ctx.moveTo(0, h * (0.24 + offset));
        ctx.bezierCurveTo(w * 0.25, h * (0.32 + offset), w * 0.5, h * (0.57 + offset * 0.5), w, h * (0.84 + offset * 0.3));
        ctx.stroke();
      }

      // Pine trees along the slope edges
      const treeData = [
        { xi: 0.0, yi: 0.28, spacing: 0.055, count: 8, side: 'left' },
        { xi: 0.55, yi: 0.65, spacing: 0.05, count: 9, side: 'right' },
      ];
      for (const row of treeData) {
        for (let i = 0; i < row.count; i++) {
          const tx = w * (row.xi + i * row.spacing);
          const ty = h * row.yi + i * h * 0.025;
          const treeH = 38 + (i % 3) * 12;
          const s = 0.7 + (i % 3) * 0.15;
          ctx.fillStyle = '#5c3d1a';
          ctx.fillRect(tx - 3 * s, ty, 6 * s, treeH * 0.3);
          for (let j = 0; j < 3; j++) {
            const lw = (14 - j * 3) * s;
            ctx.fillStyle = j === 0 ? '#1e3d0f' : j === 1 ? '#2d5a1a' : '#3d7825';
            ctx.beginPath();
            ctx.moveTo(tx, ty - treeH * s + j * 13 * s);
            ctx.lineTo(tx - lw, ty - j * 6 * s);
            ctx.lineTo(tx + lw, ty - j * 6 * s);
            ctx.fill();
            ctx.fillStyle = 'rgba(220,240,255,0.75)';
            ctx.beginPath();
            ctx.moveTo(tx, ty - treeH * s + j * 13 * s);
            ctx.lineTo(tx - (7 - j) * s, ty - treeH * s + j * 13 * s + 9 * s);
            ctx.lineTo(tx + (7 - j) * s, ty - treeH * s + j * 13 * s + 9 * s);
            ctx.fill();
          }
        }
      }

      // Wooden coffee shop (bottom-left area, near the slope)
      const cx = w * 0.08;
      const cy = h * 0.78;
      // Snow on ground around shop
      ctx.fillStyle = 'rgba(220,240,255,0.6)';
      ctx.beginPath();
      ctx.ellipse(cx + 30, cy + 62, 55, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      // Main building
      ctx.fillStyle = '#7b4f2e';
      ctx.fillRect(cx, cy, 60, 55);
      // Wood plank lines
      ctx.strokeStyle = '#5c3518';
      ctx.lineWidth = 1.5;
      for (let pl = 0; pl < 5; pl++) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + 10 + pl * 10);
        ctx.lineTo(cx + 60, cy + 10 + pl * 10);
        ctx.stroke();
      }
      // Roof (dark wood, snowy)
      ctx.fillStyle = '#4a2e12';
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 30, cy - 28);
      ctx.lineTo(cx + 68, cy);
      ctx.fill();
      // Snow on roof
      ctx.fillStyle = 'rgba(225,242,255,0.92)';
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 30, cy - 28);
      ctx.lineTo(cx + 68, cy);
      ctx.lineTo(cx + 68, cy - 5);
      ctx.lineTo(cx + 30, cy - 33);
      ctx.lineTo(cx - 8, cy - 5);
      ctx.fill();
      // Door
      ctx.fillStyle = '#3b1f08';
      ctx.fillRect(cx + 22, cy + 30, 16, 25);
      ctx.strokeStyle = '#6b3a1a';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx + 22, cy + 30, 16, 25);
      // Door handle
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(cx + 35, cy + 43, 2, 0, Math.PI * 2);
      ctx.fill();
      // Window left
      ctx.fillStyle = 'rgba(255,230,150,0.7)';
      ctx.fillRect(cx + 5, cy + 10, 14, 12);
      ctx.strokeStyle = '#5c3518';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx + 5, cy + 10, 14, 12);
      ctx.beginPath();
      ctx.moveTo(cx + 12, cy + 10);
      ctx.lineTo(cx + 12, cy + 22);
      ctx.moveTo(cx + 5, cy + 16);
      ctx.lineTo(cx + 19, cy + 16);
      ctx.stroke();
      // Window right
      ctx.fillStyle = 'rgba(255,230,150,0.7)';
      ctx.fillRect(cx + 41, cy + 10, 14, 12);
      ctx.strokeStyle = '#5c3518';
      ctx.strokeRect(cx + 41, cy + 10, 14, 12);
      ctx.beginPath();
      ctx.moveTo(cx + 48, cy + 10);
      ctx.lineTo(cx + 48, cy + 22);
      ctx.moveTo(cx + 41, cy + 16);
      ctx.lineTo(cx + 55, cy + 16);
      ctx.stroke();
      // Chimney
      ctx.fillStyle = '#5c3518';
      ctx.fillRect(cx + 42, cy - 40, 10, 20);
      ctx.fillStyle = '#3b1f08';
      ctx.fillRect(cx + 40, cy - 43, 14, 5);
      // Chimney smoke puffs
      for (let s = 0; s < 3; s++) {
        const puffY = cy - 48 - s * 14 - (time * 0.02 + s * 8) % 30;
        const puffAlpha = 0.35 - s * 0.1;
        ctx.fillStyle = `rgba(200,200,200,${puffAlpha})`;
        ctx.beginPath();
        ctx.arc(cx + 47 + Math.sin(time * 0.001 + s) * 4, puffY, 6 + s * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Sign above door
      ctx.fillStyle = '#5c3518';
      ctx.fillRect(cx + 15, cy - 8, 30, 10);
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold 6px monospace`;
      ctx.fillText('CAFÉ ☕', cx + 17, cy);

      // Two skiers moving slowly from the coffee shop toward the last memory (w*0.87)
      const skierStartX = cx + 80;
      const skierEndX = w * 0.87;
      const skierRange = skierEndX - skierStartX;
      const skiers = [
        { speed: 18, phaseOffset: 0,           jacket: '#2980b9', hat: '#1a5276' },
        { speed: 13, phaseOffset: skierRange * 0.45, jacket: '#8e44ad', hat: '#6c3483' },
      ];
      for (const sk of skiers) {
        const x = skierStartX + (time * sk.speed / 1000 + sk.phaseOffset) % skierRange;
        const progress = (x - skierStartX) / skierRange;
        const baseY = cy + 20 + progress * h * 0.04;
        const bobY = baseY + Math.sin(time * 0.004 + sk.phaseOffset) * 2;
        ctx.save();
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.ellipse(x, bobY + 14, 18, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Skis (two planks)
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(x - 18, bobY + 10, 15, 3);
        ctx.fillRect(x + 3,  bobY + 10, 15, 3);
        // Legs
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x - 6, bobY - 2, 5, 12);
        ctx.fillRect(x + 1, bobY - 2, 5, 12);
        // Body
        ctx.fillStyle = sk.jacket;
        ctx.fillRect(x - 7, bobY - 20, 14, 18);
        // Head
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath();
        ctx.arc(x, bobY - 25, 7, 0, Math.PI * 2);
        ctx.fill();
        // Beanie hat
        ctx.fillStyle = sk.hat;
        ctx.beginPath();
        ctx.arc(x, bobY - 28, 7, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(x - 7, bobY - 30, 14, 5);
        // Ski poles
        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 9, bobY - 15);
        ctx.lineTo(x - 16, bobY + 8);
        ctx.moveTo(x + 9, bobY - 15);
        ctx.lineTo(x + 16, bobY + 8);
        ctx.stroke();
        // Pole tips
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.arc(x - 16, bobY + 8, 2, 0, Math.PI * 2);
        ctx.arc(x + 16, bobY + 8, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Snowflakes with wind drift
      for (let i = 0; i < 280; i++) {
        const size = 1 + (i % 4) * 0.7;
        const wind = time * 0.05 * (1 + (i % 3) * 0.4);
        const fall = time * 0.028 * (1 + (i % 2) * 0.6);
        const sx = ((i * 97 + wind) % (w + 20) + w + 20) % (w + 20);
        const sy = ((i * 53 + fall) % h + h) % h;
        const alpha = 0.5 + (i % 5) * 0.1;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    platforms: (w, h) => [
      { x: w * 0.05, y: h * 0.35, width: w * 0.25, height: 20 },
      { x: w * 0.25, y: h * 0.5,  width: w * 0.25, height: 20 },
      { x: w * 0.45, y: h * 0.65, width: w * 0.25, height: 20 },
      { x: w * 0.65, y: h * 0.8,  width: w * 0.3,  height: 20 },
    ],
    drawPlatforms: (ctx, platforms) => {
      for (const p of platforms) {
        // Snow ramp body
        const rampGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
        rampGrad.addColorStop(0, '#dff2fc');
        rampGrad.addColorStop(1, '#aad4ec');
        ctx.fillStyle = rampGrad;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + p.height);
        ctx.lineTo(p.x + 10, p.y);
        ctx.lineTo(p.x + p.width, p.y);
        ctx.lineTo(p.x + p.width, p.y + p.height);
        ctx.fill();
        // Icy top surface
        ctx.fillStyle = 'rgba(200,235,255,0.9)';
        ctx.fillRect(p.x + 10, p.y, p.width - 10, 5);
        // Shadow underside
        ctx.fillStyle = 'rgba(60,110,160,0.25)';
        ctx.fillRect(p.x, p.y + p.height - 6, p.width, 6);
        // Sparkle dots
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for (let s = 0; s < 4; s++) {
          ctx.beginPath();
          ctx.arc(p.x + 20 + s * (p.width / 5), p.y + 2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    memories: (w, h) => [
      { x: w * 0.27, y: h * 0.35 - 60, type: 'snowboard', videoSrc: '/Snowboard.mp4',   description: 'First run down the powder slopes' },
      { x: w * 0.47, y: h * 0.5 - 60,  type: 'helmet',    videoSrc: '/Snowboard2.mp4',  description: 'Geared up & ready to shred' },
      { x: w * 0.87, y: h * 0.8 - 70,  type: 'gate',      videoSrc: '/Snowboard3.jpeg', description: 'The sacred torii at the mountain base' },
    ],
    drawMemory: (ctx, mem, time) => {
      const mx = mem.x;
      const my = mem.y;
      const pulse = Math.sin(time * 0.003) * 3;

      if (mem.type === 'snowboard') {
        // Floating snowboard
        ctx.save();
        ctx.translate(mx, my + pulse);
        // Board body
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.roundRect(-28, -6, 56, 12, 6);
        ctx.fill();
        // Board stripe
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-20, -2, 40, 4);
        // Bindings
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(-12, -7, 8, 14);
        ctx.fillRect(4, -7, 8, 14);
        // Glow
        ctx.shadowColor = '#e74c3c';
        ctx.shadowBlur = 10 + pulse;
        ctx.strokeStyle = 'rgba(255,100,100,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-30, -8, 60, 16, 7);
        ctx.stroke();
        ctx.restore();

      } else if (mem.type === 'helmet') {
        // Floating helmet
        ctx.save();
        ctx.translate(mx, my + pulse);
        // Shell
        ctx.fillStyle = '#2980b9';
        ctx.beginPath();
        ctx.arc(0, -2, 18, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-18, -2, 36, 10);
        // Chin strap base
        ctx.fillStyle = '#1a5276';
        ctx.fillRect(-18, 6, 36, 5);
        // Goggle strap
        ctx.fillStyle = '#1a252f';
        ctx.fillRect(-18, 0, 36, 7);
        // Goggle lens
        ctx.fillStyle = 'rgba(100,200,255,0.55)';
        ctx.fillRect(-14, 1, 28, 5);
        // Goggle shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillRect(-12, 2, 10, 2);
        // Glow
        ctx.shadowColor = '#3498db';
        ctx.shadowBlur = 10 + pulse;
        ctx.strokeStyle = 'rgba(100,180,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -2, 20, Math.PI, 0);
        ctx.stroke();
        ctx.restore();

      } else if (mem.type === 'gate') {
        // Torii gate
        ctx.save();
        ctx.translate(mx, my + pulse * 0.5);
        // Posts
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(-20, -10, 6, 50);
        ctx.fillRect(14, -10, 6, 50);
        // Top beam
        ctx.fillRect(-26, -18, 52, 7);
        // Second beam
        ctx.fillRect(-22, -6, 44, 5);
        // Beam tips curve up
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(-26, -18);
        ctx.quadraticCurveTo(-22, -28, -14, -24);
        ctx.lineTo(-14, -18);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(26, -18);
        ctx.quadraticCurveTo(22, -28, 14, -24);
        ctx.lineTo(14, -18);
        ctx.fill();
        // Glow
        ctx.shadowColor = '#e74c3c';
        ctx.shadowBlur = 12 + pulse;
        ctx.strokeStyle = 'rgba(255,80,80,0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-27, -29, 54, 79);
        ctx.restore();
      }
    },
  },

  castle: {
    name: '🏰 Naked Castle, Moganshan',
    playerStart: (w, h) => ({ x: 50, y: h * 0.76 }),
    background: (ctx, w, h, time) => {
      // --- Dusk/twilight sky (matches the photo's blue-grey evening tone) ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      skyGrad.addColorStop(0,   '#1c2a3a');
      skyGrad.addColorStop(0.4, '#2e4058');
      skyGrad.addColorStop(0.75,'#4a6070');
      skyGrad.addColorStop(1,   '#6a8090');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.7);

      // Faint horizon glow (sunset remnant)
      const horizGlow = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.65);
      horizGlow.addColorStop(0,   'rgba(180,140,90,0.18)');
      horizGlow.addColorStop(1,   'transparent');
      ctx.fillStyle = horizGlow;
      ctx.fillRect(0, h * 0.45, w, h * 0.2);

      // A handful of early stars (dusk — not full night)
      for (let i = 0; i < 55; i++) {
        const sx = (i * 173 + 31) % w;
        const sy = (i * 97  + 11) % (h * 0.38);
        const tw = Math.sin(time * 0.0008 + i) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255,255,240,${tw * 0.55})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8 + (i % 2) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Full moon — upper right sky ---
      const moonX = w * 0.80;
      const moonY = h * 0.11;
      const moonR = 30;
      // Atmospheric halo rings (outermost first)
      for (let ring = 4; ring >= 1; ring--) {
        const hr = moonR + ring * 22;
        const ha = 0.025 + (4 - ring) * 0.018;
        const hg = ctx.createRadialGradient(moonX, moonY, moonR, moonX, moonY, hr);
        hg.addColorStop(0,   `rgba(190,215,255,${ha})`);
        hg.addColorStop(0.6, `rgba(160,190,240,${ha * 0.4})`);
        hg.addColorStop(1,   'transparent');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(moonX, moonY, hr, 0, Math.PI * 2); ctx.fill();
      }
      // Close glow
      const mglow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 2.0);
      mglow.addColorStop(0,   'rgba(220,235,255,0.38)');
      mglow.addColorStop(0.45,'rgba(200,220,248,0.16)');
      mglow.addColorStop(1,   'transparent');
      ctx.fillStyle = mglow; ctx.beginPath(); ctx.arc(moonX, moonY, moonR * 2, 0, Math.PI * 2); ctx.fill();
      // Moon disc (soft radial gradient, off-centre bright spot for realism)
      const mdisc = ctx.createRadialGradient(moonX - moonR * 0.28, moonY - moonR * 0.28, 0, moonX, moonY, moonR);
      mdisc.addColorStop(0,    '#f2f6ff');
      mdisc.addColorStop(0.45, '#e0eaf8');
      mdisc.addColorStop(0.85, '#c8d8ee');
      mdisc.addColorStop(1,    '#b0c4e4');
      ctx.fillStyle = mdisc; ctx.beginPath(); ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2); ctx.fill();
      // Subtle craters
      ctx.fillStyle = 'rgba(150,170,205,0.28)';
      ctx.beginPath(); ctx.arc(moonX + moonR * 0.22, moonY - moonR * 0.18, moonR * 0.17, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(moonX - moonR * 0.28, moonY + moonR * 0.22, moonR * 0.11, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(moonX + moonR * 0.05, moonY + moonR * 0.32, moonR * 0.09, 0, Math.PI * 2); ctx.fill();

      // --- Layered Moganshan mountain ridges (dusk blue-greens) ---
      const ridges = [
        { col: '#2a3d4a', pts: [0,0.52, 0.15,0.30, 0.30,0.42, 0.48,0.26, 0.65,0.38, 0.80,0.28, 1.0,0.44] },
        { col: '#233628', pts: [0,0.60, 0.10,0.42, 0.25,0.52, 0.42,0.36, 0.58,0.48, 0.74,0.38, 0.90,0.50, 1.0,0.56] },
        { col: '#1c2e1e', pts: [0,0.66, 0.18,0.54, 0.35,0.62, 0.52,0.48, 0.68,0.58, 0.85,0.52, 1.0,0.62] },
        { col: '#162418', pts: [0,0.72, 0.22,0.62, 0.42,0.68, 0.60,0.56, 0.78,0.66, 1.0, 0.70] },
      ];
      for (const r of ridges) {
        ctx.fillStyle = r.col;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let i = 0; i < r.pts.length; i += 2) {
          ctx.lineTo(r.pts[i] * w, r.pts[i + 1] * h);
        }
        ctx.lineTo(w, h);
        ctx.fill();
      }

      // --- Mist layers drifting between ridges ---
      for (let m = 0; m < 5; m++) {
        const mistY = h * (0.50 + m * 0.055);
        const drift  = Math.sin(time * 0.00025 + m * 1.2) * w * 0.03;
        const alpha  = 0.07 + m * 0.025;
        const mg = ctx.createLinearGradient(drift, mistY, drift, mistY + h * 0.06);
        mg.addColorStop(0,   `rgba(160,190,185,${alpha})`);
        mg.addColorStop(0.5, `rgba(160,190,185,${alpha * 0.6})`);
        mg.addColorStop(1,   'transparent');
        ctx.fillStyle = mg;
        ctx.fillRect(0, mistY, w, h * 0.09);
      }

      // --- Castle promontory hill — gives the castle a solid elevated hilltop ---
      const cHillCx = w * 0.44;       // center under castle
      const cHillPeak = h * 0.32;     // just below the castle's base
      // Main hill body — dark forest green, like the Moganshan hillside
      const cHillG = ctx.createLinearGradient(0, cHillPeak, 0, h * 0.70);
      cHillG.addColorStop(0,    '#1b3019');
      cHillG.addColorStop(0.55, '#152614');
      cHillG.addColorStop(1,    '#101c10');
      ctx.fillStyle = cHillG;
      ctx.beginPath();
      ctx.moveTo(w * 0.16, h * 0.74);
      ctx.bezierCurveTo(w * 0.24, h * 0.52, w * 0.33, h * 0.35, cHillCx - 58, cHillPeak);
      ctx.lineTo(cHillCx + 176, cHillPeak);
      ctx.bezierCurveTo(cHillCx + 228, h * 0.38, w * 0.74, h * 0.53, w * 0.82, h * 0.74);
      ctx.closePath();
      ctx.fill();
      // Lighter grassy rim just at the hilltop edge (catches the moonlight)
      ctx.fillStyle = '#24401e';
      ctx.beginPath();
      ctx.moveTo(w * 0.22, h * 0.64);
      ctx.bezierCurveTo(w * 0.29, h * 0.46, w * 0.36, h * 0.35, cHillCx - 40, cHillPeak);
      ctx.lineTo(cHillCx + 162, cHillPeak);
      ctx.bezierCurveTo(cHillCx + 206, h * 0.40, w * 0.68, h * 0.52, w * 0.76, h * 0.64);
      ctx.closePath();
      ctx.fill();
      // Scrub bushes along the hillside rim
      ctx.fillStyle = '#1c3418';
      for (let sb = 0; sb < 8; sb++) {
        const sbx = w * 0.26 + sb * w * 0.062;
        const sby = cHillPeak + 6 + (sb % 3) * 5;
        ctx.beginPath();
        ctx.arc(sbx, sby, 5 + (sb % 3) * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // -------------------------------------------------------
      // THE CASTLE  — cream stone, dark slate roofs, right tower
      // Positioned center-right on its hilltop, matching photo
      // -------------------------------------------------------
      const bx = w * 0.38;   // left edge of castle complex
      const by = h * 0.16;   // top of tallest element

      // Warm ambient glow from all the lit windows
      const glow = ctx.createRadialGradient(bx + 120, by + 110, 0, bx + 120, by + 110, 200);
      glow.addColorStop(0,   'rgba(255,200,100,0.18)');
      glow.addColorStop(0.5, 'rgba(255,180,80,0.07)');
      glow.addColorStop(1,   'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(bx - 80, by - 20, 440, 320);

      // Helper — cream stone wall with subtle block texture
      const drawStoneWall = (x: number, y: number, ww: number, wh: number) => {
        // Base cream stone
        const sg = ctx.createLinearGradient(x, y, x + ww, y + wh);
        sg.addColorStop(0,   '#d8cdb8');
        sg.addColorStop(0.5, '#e4d8c4');
        sg.addColorStop(1,   '#ccc0a8');
        ctx.fillStyle = sg;
        ctx.fillRect(x, y, ww, wh);
        // Horizontal mortar lines
        ctx.strokeStyle = 'rgba(140,120,95,0.35)';
        ctx.lineWidth = 0.8;
        const rowH = 10;
        for (let r = 0; r * rowH < wh; r++) {
          ctx.beginPath();
          ctx.moveTo(x, y + r * rowH);
          ctx.lineTo(x + ww, y + r * rowH);
          ctx.stroke();
          // Vertical joints, offset every other row
          const off = r % 2 === 0 ? 0 : 14;
          for (let c = 0; c * 28 + off < ww; c++) {
            ctx.beginPath();
            ctx.moveTo(x + c * 28 + off, y + r * rowH);
            ctx.lineTo(x + c * 28 + off, y + r * rowH + rowH);
            ctx.stroke();
          }
        }
      };

      // Helper — dark slate gabled roof
      const drawRoof = (x: number, y: number, ww: number, rh: number) => {
        ctx.fillStyle = '#3a3e42';
        ctx.beginPath();
        ctx.moveTo(x - 4,       y);
        ctx.lineTo(x + ww / 2,  y - rh);
        ctx.lineTo(x + ww + 4,  y);
        ctx.fill();
        // Slate texture lines
        ctx.strokeStyle = 'rgba(20,20,22,0.35)';
        ctx.lineWidth = 0.8;
        for (let s = 1; s < 5; s++) {
          const t = s / 5;
          ctx.beginPath();
          ctx.moveTo(x - 4 + t * (ww / 2 + 4),       y - rh * t);
          ctx.lineTo(x + ww + 4 - t * (ww / 2 + 4),  y - rh * t);
          ctx.stroke();
        }
        // Ridge cap
        ctx.fillStyle = '#2c2e30';
        ctx.fillRect(x + ww / 2 - 2, y - rh - 2, 4, rh * 0.15 + 4);
      };

      // Helper — arched window with amber glow
      const drawWin = (wx: number, wy: number, ww: number, wh: number) => {
        // Amber interior
        ctx.fillStyle = 'rgba(255,190,70,0.9)';
        ctx.fillRect(wx, wy + wh * 0.38, ww, wh * 0.62);
        ctx.beginPath();
        ctx.arc(wx + ww / 2, wy + wh * 0.38, ww / 2, Math.PI, 0);
        ctx.fill();
        // Bright centre shine
        ctx.fillStyle = 'rgba(255,240,160,0.45)';
        ctx.fillRect(wx + 2, wy + wh * 0.45, ww * 0.35, wh * 0.45);
        // Dark stone frame
        ctx.strokeStyle = '#7a6a50';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(wx, wy + wh * 0.38, ww, wh * 0.62);
        ctx.beginPath();
        ctx.arc(wx + ww / 2, wy + wh * 0.38, ww / 2, Math.PI, 0);
        ctx.stroke();
      };

      // ---- LEFT LOWER ANNEX (descends the hillside to the left) ----
      drawStoneWall(bx - 60, by + 145, 75, 75);
      drawRoof(bx - 63, by + 145, 81, 22);
      drawWin(bx - 50, by + 158, 13, 20);
      drawWin(bx - 25, by + 158, 13, 20);

      // Small connector wing
      drawStoneWall(bx, by + 120, 40, 100);
      drawRoof(bx - 2, by + 120, 44, 18);
      drawWin(bx + 10, by + 135, 12, 18);

      // ---- MAIN CASTLE BODY ----
      const mw = 155; const mh = 125;
      drawStoneWall(bx + 38, by + 45, mw, mh);
      drawRoof(bx + 35, by + 45, mw + 6, 32);

      // Main body windows — two rows
      drawWin(bx + 48,  by + 66, 16, 26);
      drawWin(bx + 76,  by + 66, 16, 26);
      drawWin(bx + 104, by + 66, 16, 26);
      drawWin(bx + 132, by + 66, 16, 26);
      drawWin(bx + 52,  by + 106, 15, 22);
      drawWin(bx + 82,  by + 106, 15, 22);
      drawWin(bx + 112, by + 106, 15, 22);
      drawWin(bx + 142, by + 106, 15, 22);

      // Main arched entrance door
      ctx.fillStyle = '#1e1408';
      ctx.fillRect(bx + 103, by + 135, 22, 35);
      ctx.beginPath();
      ctx.arc(bx + 114, by + 135, 11, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#8a7050';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx + 103, by + 135, 22, 35);

      // Stone corner quoins (darker blocks at corners = European castle detail)
      ctx.fillStyle = '#b8a888';
      for (let q = 0; q < 7; q++) {
        ctx.fillRect(bx + 38,        by + 50 + q * 17, 6, 10);
        ctx.fillRect(bx + 38 + mw - 6, by + 50 + q * 17, 6, 10);
      }

      // ---- BELL TOWER (right side, taller — matches photo) ----
      const tx = bx + 38 + mw - 8;
      const tw2 = 48;
      const tBase = by + 45;
      drawStoneWall(tx, tBase - 80, tw2, 205);

      // Tower arched belfry openings near top
      ctx.fillStyle = '#12100c';
      ctx.fillRect(tx + 8,      tBase - 68, 14, 24);
      ctx.beginPath(); ctx.arc(tx + 15, tBase - 68, 7, Math.PI, 0); ctx.fill();
      ctx.fillRect(tx + tw2 - 22, tBase - 68, 14, 24);
      ctx.beginPath(); ctx.arc(tx + tw2 - 15, tBase - 68, 7, Math.PI, 0); ctx.fill();

      // Tower windows going down
      drawWin(tx + 14, tBase - 30, 14, 20);
      drawWin(tx + 14, tBase + 10, 14, 20);
      drawWin(tx + 14, tBase + 52, 14, 20);
      drawWin(tx + 14, tBase + 95, 14, 20);

      // Tower quoins
      ctx.fillStyle = '#b0a080';
      for (let q = 0; q < 12; q++) {
        ctx.fillRect(tx,           tBase - 78 + q * 14, 5, 9);
        ctx.fillRect(tx + tw2 - 5, tBase - 78 + q * 14, 5, 9);
      }

      // Tower dark slate pointed spire (square base → pointed top)
      ctx.fillStyle = '#2e3235';
      ctx.beginPath();
      ctx.moveTo(tx - 3,          tBase - 80);
      ctx.lineTo(tx + tw2 / 2,    tBase - 140);
      ctx.lineTo(tx + tw2 + 3,    tBase - 80);
      ctx.fill();
      // Spire slate lines
      ctx.strokeStyle = 'rgba(15,15,18,0.4)';
      ctx.lineWidth = 0.8;
      for (let s = 1; s < 5; s++) {
        const t = s / 5;
        ctx.beginPath();
        ctx.moveTo(tx - 3 + t * (tw2 / 2 + 3),       tBase - 80 - 60 * t);
        ctx.lineTo(tx + tw2 + 3 - t * (tw2 / 2 + 3), tBase - 80 - 60 * t);
        ctx.stroke();
      }
      // Spire tip finial
      ctx.fillStyle = '#555a5e';
      ctx.beginPath();
      ctx.arc(tx + tw2 / 2, tBase - 140, 3, 0, Math.PI * 2);
      ctx.fill();

      // ---- NAKED CASTLE LOGO — circular sign floating above the castle ----
      const logoX = bx + 100;         // centered over castle main body
      const logoY = by - 62;          // above the rooflines
      const logoR = 52;               // sign radius

      ctx.save();

      if (_ncLogo.complete && _ncLogo.naturalWidth > 0) {
        const iw = _ncLogo.naturalWidth;
        const ih = _ncLogo.naturalHeight;
        // Scale image so the logo circle (76% of image width) fills our canvas circle exactly
        const scale = (logoR * 2) / (iw * 0.76);
        const dw = iw * scale;
        const dh = ih * scale;
        // Circle center sits at ~50% x, ~47% y of the image
        const dx = logoX - iw * 0.50 * scale;
        const dy = logoY - ih * 0.47 * scale;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Clip to circle so white corners of the PNG are hidden
        ctx.beginPath();
        ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(_ncLogo, dx, dy, dw, dh);
      } else {
        // Fallback pixel-art version while image loads
        ctx.fillStyle = '#111111';
        ctx.beginPath(); ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(logoX, logoY, logoR - 3, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(logoX, logoY, logoR - 10, 0, Math.PI * 2); ctx.stroke();
        ctx.font = 'italic 10px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('naked', logoX, logoY - 6);
        ctx.font = 'bold 15px Arial, sans-serif';
        ctx.fillText('CASTLE', logoX, logoY + 10);
        ctx.font = '11px Arial, sans-serif';
        ctx.fillText('裸心堡', logoX, logoY + 26);
        ctx.textAlign = 'left';
      }

      ctx.restore();

      // ---- INFINITY POOL ON THE HILLSIDE ----
      const px = w * 0.10;
      const py = h * 0.56;
      const pw = 148;
      const pdepth = 52;

      // Blue ambient glow radiating from pool onto terrain (draw first, behind everything)
      const poolGlow = ctx.createRadialGradient(px + pw * 0.45, py + pdepth * 0.5, 0, px + pw * 0.45, py + pdepth * 0.5, 130);
      poolGlow.addColorStop(0,   'rgba(20,150,220,0.22)');
      poolGlow.addColorStop(0.5, 'rgba(10,100,180,0.10)');
      poolGlow.addColorStop(1,   'transparent');
      ctx.fillStyle = poolGlow;
      ctx.fillRect(px - 60, py - 50, pw + 160, pdepth + 130);

      // Hillside terrain behind pool — carved earth bank
      ctx.fillStyle = '#182814';
      ctx.beginPath();
      ctx.moveTo(px - 30, py - 30);
      ctx.quadraticCurveTo(px + pw * 0.5, py - 48, px + pw + 20, py - 22);
      ctx.lineTo(px + pw + 20, py + 2);
      ctx.lineTo(px - 30, py + 2);
      ctx.fill();
      // Low shrubs along the back bank
      ctx.fillStyle = '#1e3418';
      for (let sh = 0; sh < 6; sh++) {
        ctx.beginPath();
        ctx.arc(px + 10 + sh * 24, py - 12 - (sh % 2) * 6, 8 + (sh % 3) * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wide stone terrace deck on the LEFT of pool (with sunbeds)
      const deckX = px - 52;
      const deckW = 54;
      const deckG = ctx.createLinearGradient(deckX, py, deckX, py + pdepth);
      deckG.addColorStop(0,   '#cfc4a8');
      deckG.addColorStop(1,   '#b8ac90');
      ctx.fillStyle = deckG;
      ctx.fillRect(deckX, py, deckW, pdepth);
      // Deck tile grid
      ctx.strokeStyle = 'rgba(100,88,68,0.3)';
      ctx.lineWidth = 0.8;
      for (let tr = 0; tr <= 4; tr++) {
        ctx.beginPath(); ctx.moveTo(deckX, py + tr * 13); ctx.lineTo(deckX + deckW, py + tr * 13); ctx.stroke();
      }
      for (let tc = 0; tc <= 3; tc++) {
        ctx.beginPath(); ctx.moveTo(deckX + tc * 18, py); ctx.lineTo(deckX + tc * 18, py + pdepth); ctx.stroke();
      }
      // Two sunbeds (wooden slats + headrest)
      const drawSunbed = (bx2: number, by2: number) => {
        ctx.fillStyle = '#a08858';
        ctx.fillRect(bx2, by2, 22, 7);
        for (let sl = 0; sl < 4; sl++) ctx.fillRect(bx2 + sl * 6, by2, 4, 7);
        ctx.fillStyle = '#8a7245';
        ctx.fillRect(bx2, by2 - 4, 8, 5);
        // White towel
        ctx.fillStyle = 'rgba(240,238,230,0.85)';
        ctx.fillRect(bx2 + 2, by2 + 1, 18, 4);
      };
      drawSunbed(deckX + 4,  py + 8);
      drawSunbed(deckX + 4,  py + 28);
      // Small side table between chairs
      ctx.fillStyle = '#7a6840';
      ctx.beginPath(); ctx.arc(deckX + 36, py + 22, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,200,80,0.7)';
      ctx.beginPath(); ctx.arc(deckX + 36, py + 22, 3, 0, Math.PI * 2); ctx.fill(); // drink

      // Pool LEFT side wall (stone, perspective)
      const leftWallG = ctx.createLinearGradient(px - 12, py, px, py);
      leftWallG.addColorStop(0, '#a89878');
      leftWallG.addColorStop(1, '#c4b898');
      ctx.fillStyle = leftWallG;
      ctx.beginPath();
      ctx.moveTo(px - 12, py + 4);
      ctx.lineTo(px,      py);
      ctx.lineTo(px,      py + pdepth);
      ctx.lineTo(px - 12, py + pdepth + 6);
      ctx.fill();

      // Pool NEAR wall (front face, stone tiles)
      const frontG = ctx.createLinearGradient(px, py + pdepth, px, py + pdepth + 18);
      frontG.addColorStop(0, '#c4b898');
      frontG.addColorStop(1, '#9e9278');
      ctx.fillStyle = frontG;
      ctx.beginPath();
      ctx.moveTo(px - 12, py + pdepth + 6);
      ctx.lineTo(px,      py + pdepth);
      ctx.lineTo(px + pw, py + pdepth);
      ctx.lineTo(px + pw + 6, py + pdepth + 6);
      ctx.lineTo(px + pw - 4, py + pdepth + 18);
      ctx.lineTo(px - 8,  py + pdepth + 18);
      ctx.fill();
      // Front wall tile lines
      ctx.strokeStyle = 'rgba(80,70,52,0.3)';
      ctx.lineWidth = 0.7;
      for (let ft = 0; ft < 3; ft++) {
        ctx.beginPath();
        ctx.moveTo(px - 12 + ft * 2, py + pdepth + 6 + ft * 4);
        ctx.lineTo(px + pw + 6 - ft, py + pdepth + 6 + ft * 4);
        ctx.stroke();
      }

      // Water body — rich blue with depth gradient
      const waterG = ctx.createLinearGradient(px, py, px, py + pdepth);
      waterG.addColorStop(0,   '#28d8f0');
      waterG.addColorStop(0.3, '#12b0d8');
      waterG.addColorStop(0.7, '#0888b0');
      waterG.addColorStop(1,   '#065878');
      ctx.fillStyle = waterG;
      ctx.fillRect(px, py, pw, pdepth);

      // Underwater pool lights — glowing circles near the bottom corners
      for (let ul = 0; ul < 3; ul++) {
        const ux = px + 18 + ul * (pw * 0.4);
        const uy = py + pdepth - 8;
        const ulG = ctx.createRadialGradient(ux, uy, 0, ux, uy, 20);
        ulG.addColorStop(0,   'rgba(120,220,255,0.5)');
        ulG.addColorStop(0.5, 'rgba(60,180,240,0.15)');
        ulG.addColorStop(1,   'transparent');
        ctx.fillStyle = ulG;
        ctx.beginPath(); ctx.arc(ux, uy, 20, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(200,240,255,0.8)';
        ctx.beginPath(); ctx.arc(ux, uy, 3, 0, Math.PI * 2); ctx.fill();
      }

      // Caustic light pattern on pool floor
      ctx.strokeStyle = 'rgba(120,230,255,0.18)';
      ctx.lineWidth = 1;
      for (let c = 0; c < 8; c++) {
        const cx2 = px + 10 + c * 18 + Math.sin(time * 0.0008 + c) * 4;
        const cy2 = py + 15 + (c % 3) * 10;
        ctx.beginPath();
        ctx.ellipse(cx2, cy2, 6 + (c % 3) * 3, 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Animated surface shimmer lines (perspective-foreshortened)
      ctx.strokeStyle = 'rgba(180,245,255,0.28)';
      ctx.lineWidth = 1;
      for (let r = 0; r < 5; r++) {
        const prog = ((time * 0.0006 + r * 0.2) % 1);
        const sy   = py + prog * pdepth;
        const hw   = pw * 0.46 * prog + pw * 0.08;
        ctx.beginPath();
        ctx.moveTo(px + pw * 0.5 - hw, sy);
        ctx.lineTo(px + pw * 0.5 + hw, sy);
        ctx.stroke();
      }

      // Moonlight / sky reflection — long shimmering vertical strip
      const refX2 = px + pw * 0.52 + Math.sin(time * 0.0009) * 10;
      const refG3 = ctx.createLinearGradient(refX2, py, refX2, py + pdepth);
      refG3.addColorStop(0,   'rgba(255,252,210,0)');
      refG3.addColorStop(0.25,'rgba(255,252,210,0.42)');
      refG3.addColorStop(0.75,'rgba(255,252,210,0.42)');
      refG3.addColorStop(1,   'rgba(255,252,210,0)');
      ctx.fillStyle = refG3;
      ctx.fillRect(refX2 - 4, py, 8, pdepth);

      // Infinity overflow — RIGHT edge: water thins and vanishes into hillside view
      for (let ie = 0; ie < 4; ie++) {
        const ieAlpha = 0.7 - ie * 0.18;
        const ieG = ctx.createLinearGradient(px + pw, py, px + pw + 30, py);
        ieG.addColorStop(0,   `rgba(20,180,220,${ieAlpha})`);
        ieG.addColorStop(0.5, `rgba(14,140,190,${ieAlpha * 0.4})`);
        ieG.addColorStop(1,   'transparent');
        ctx.fillStyle = ieG;
        ctx.fillRect(px + pw, py + ie * 4, 30, pdepth - ie * 8);
      }

      // Near rim — wide travertine stone coping (top edge of pool)
      const copingG = ctx.createLinearGradient(px - 14, py - 8, px - 14, py);
      copingG.addColorStop(0, '#ddd4bc');
      copingG.addColorStop(1, '#c8bc9e');
      ctx.fillStyle = copingG;
      ctx.beginPath();
      ctx.moveTo(px - 14, py - 8);
      ctx.lineTo(px + pw, py - 8);
      ctx.lineTo(px + pw, py);
      ctx.lineTo(px,      py);
      ctx.lineTo(px - 14, py + 2);
      ctx.fill();
      // Coping tile joints
      ctx.strokeStyle = 'rgba(100,88,68,0.35)';
      ctx.lineWidth = 0.8;
      for (let cj = 0; cj < 8; cj++) {
        ctx.beginPath();
        ctx.moveTo(px + cj * 19, py - 8);
        ctx.lineTo(px + cj * 19, py);
        ctx.stroke();
      }

      // LEFT coping cap
      const lcG = ctx.createLinearGradient(px - 14, py - 8, px - 14, py + 2);
      lcG.addColorStop(0, '#ccc0a0');
      lcG.addColorStop(1, '#a89e82');
      ctx.fillStyle = lcG;
      ctx.fillRect(px - 14, py - 8, 14, 10);

      // Warm LED strip lights along near coping
      for (let l = 0; l < 9; l++) {
        const lx = px + l * 16 + 4;
        ctx.fillStyle = `rgba(255,210,80,${0.6 + Math.sin(time * 0.002 + l) * 0.2})`;
        ctx.fillRect(lx, py - 4, 8, 2);
      }

      // Stone retaining wall below pool
      const rwG = ctx.createLinearGradient(px - 14, py + pdepth + 18, px - 14, py + pdepth + 44);
      rwG.addColorStop(0, '#a89878');
      rwG.addColorStop(1, '#7a7060');
      ctx.fillStyle = rwG;
      ctx.beginPath();
      ctx.moveTo(px - 14,    py + pdepth + 18);
      ctx.lineTo(px + pw - 4, py + pdepth + 18);
      ctx.lineTo(px + pw,     py + pdepth + 44);
      ctx.lineTo(px - 18,     py + pdepth + 44);
      ctx.fill();
      ctx.strokeStyle = 'rgba(60,52,40,0.35)';
      ctx.lineWidth = 0.8;
      for (let rl = 1; rl < 3; rl++) {
        ctx.beginPath();
        ctx.moveTo(px - 14, py + pdepth + 18 + rl * 9);
        ctx.lineTo(px + pw, py + pdepth + 18 + rl * 9);
        ctx.stroke();
      }

      // Pool hillside terracing — steps connect the pool terrace to ground level
      const ptBase = py + pdepth + 44; // bottom of stone retaining wall
      // Step 1 — wide stone ledge
      const step1G = ctx.createLinearGradient(px - 20, ptBase, px - 20, ptBase + 20);
      step1G.addColorStop(0, '#a09480'); step1G.addColorStop(1, '#7e7060');
      ctx.fillStyle = step1G;
      ctx.beginPath();
      ctx.moveTo(px - 20, ptBase);
      ctx.lineTo(px + pw + 18, ptBase);
      ctx.lineTo(px + pw + 34, ptBase + 20);
      ctx.lineTo(px - 34, ptBase + 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(60,50,38,0.3)'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(px - 20, ptBase + 10); ctx.lineTo(px + pw + 26, ptBase + 10); ctx.stroke();
      // Green slope 1
      ctx.fillStyle = '#1c2e18';
      ctx.beginPath();
      ctx.moveTo(px - 34, ptBase + 20);
      ctx.lineTo(px + pw + 34, ptBase + 20);
      ctx.lineTo(px + pw + 52, ptBase + 46);
      ctx.lineTo(px - 50, ptBase + 46);
      ctx.fill();
      // Step 2 — wider lower ledge
      const step2G = ctx.createLinearGradient(px - 50, ptBase + 46, px - 50, ptBase + 66);
      step2G.addColorStop(0, '#908070'); step2G.addColorStop(1, '#6e6050');
      ctx.fillStyle = step2G;
      ctx.beginPath();
      ctx.moveTo(px - 50, ptBase + 46);
      ctx.lineTo(px + pw + 52, ptBase + 46);
      ctx.lineTo(px + pw + 68, ptBase + 66);
      ctx.lineTo(px - 64, ptBase + 66);
      ctx.fill();
      ctx.strokeStyle = 'rgba(55,46,34,0.28)'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(px - 50, ptBase + 56); ctx.lineTo(px + pw + 60, ptBase + 56); ctx.stroke();
      // Lower green slope to ground
      ctx.fillStyle = '#162418';
      ctx.beginPath();
      ctx.moveTo(px - 64, ptBase + 66);
      ctx.lineTo(px + pw + 68, ptBase + 66);
      ctx.lineTo(Math.min(w * 0.42, px + pw + 120), h * 0.80);
      ctx.lineTo(Math.max(0, px - 90), h * 0.80);
      ctx.fill();
      // Low shrubs on terracing steps
      ctx.fillStyle = '#1e3018';
      const shrubPositions = [px - 28, px + 30, px + 80, px + pw + 10, px + pw + 44];
      for (const sx of shrubPositions) {
        ctx.beginPath(); ctx.arc(sx, ptBase + 18, 4 + Math.abs(sx % 3), 0, Math.PI * 2); ctx.fill();
      }

      // ---- People enjoying the pool ----

      // Person 1 — swimming in the water (just head + arm stroke visible)
      const swimX = px + pw * 0.38 + Math.sin(time * 0.0007) * 6;
      const swimY = py + pdepth * 0.45;
      // Arm stroke ripple
      ctx.strokeStyle = 'rgba(180,240,255,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(swimX - 10, swimY + 2, 10, 3, -0.3, 0, Math.PI * 2); ctx.stroke();
      // Head (bobbing slightly)
      ctx.fillStyle = '#FFDAB9';
      ctx.beginPath(); ctx.arc(swimX, swimY, 5, 0, Math.PI * 2); ctx.fill();
      // Swim cap
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath(); ctx.arc(swimX, swimY - 2, 5, Math.PI, 0); ctx.fill();
      // Goggles
      ctx.fillStyle = 'rgba(20,60,120,0.7)';
      ctx.fillRect(swimX - 4, swimY, 8, 3);
      // Arm out of water
      ctx.strokeStyle = '#FFDAB9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(swimX + 4, swimY + 1);
      ctx.lineTo(swimX + 14, swimY - 5);
      ctx.stroke();

      // Person 2 — sitting on the near coping edge, legs dangling in water
      const sit1X = px + pw * 0.68;
      const sit1Y = py - 2;
      // Legs in water
      ctx.strokeStyle = '#FFDAB9';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(sit1X - 4, sit1Y); ctx.lineTo(sit1X - 5, sit1Y + 18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sit1X + 4, sit1Y); ctx.lineTo(sit1X + 5, sit1Y + 18); ctx.stroke();
      // Body seated
      ctx.fillStyle = '#3498db'; // blue swimsuit
      ctx.fillRect(sit1X - 7, sit1Y - 16, 14, 14);
      // Head
      ctx.fillStyle = '#FFDAB9';
      ctx.beginPath(); ctx.arc(sit1X, sit1Y - 22, 6, 0, Math.PI * 2); ctx.fill();
      // Hair
      ctx.fillStyle = '#3d1f08';
      ctx.beginPath(); ctx.arc(sit1X, sit1Y - 25, 6, Math.PI, 0); ctx.fill();
      // Arm resting back
      ctx.strokeStyle = '#FFDAB9';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sit1X + 6, sit1Y - 12); ctx.lineTo(sit1X + 14, sit1Y - 8); ctx.stroke();

      // Person 3 — on the deck, leaning back on sunbed, holding a drink
      const sit2X = deckX + 30;
      const sit2Y = py + 14;
      // Reclining body
      ctx.fillStyle = '#e8c88a'; // warm skin
      ctx.fillRect(sit2X - 10, sit2Y - 3, 20, 6);
      // Head
      ctx.beginPath(); ctx.arc(sit2X - 12, sit2Y - 1, 5, 0, Math.PI * 2); ctx.fill();
      // Sunglasses
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(sit2X - 16, sit2Y - 3, 9, 3);
      // Swimsuit top
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(sit2X - 10, sit2Y - 3, 10, 4);
      // Drink in hand
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(sit2X + 10, sit2Y - 6, 4, 8);
      ctx.fillStyle = 'rgba(255,200,60,0.8)';
      ctx.beginPath(); ctx.arc(sit2X + 12, sit2Y - 6, 3, Math.PI, 0); ctx.fill(); // drink top
      // Straw
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sit2X + 13, sit2Y - 6); ctx.lineTo(sit2X + 16, sit2Y - 13); ctx.stroke();

      // ---- DENSE MIXED FOREST (rounded canopy blobs, like photo) ----
      const treeColors = ['#1a2e18','#1e3620','#243c22','#1c2e1a','#213818'];

      // Forest helper — draw a dense canopy blob
      const drawCanopy = (cx2: number, cy2: number, r: number, col: string) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(cx2,     cy2,     r,       0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.arc(cx2 - r * 0.55, cy2 + r * 0.3, r * 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.arc(cx2 + r * 0.55, cy2 + r * 0.3, r * 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.arc(cx2,     cy2 + r * 0.5,  r * 0.6,  0, Math.PI * 2); ctx.fill();
      };

      // Left forest bank (covers the hillside left of castle)
      const leftTrees = [
        [0.02,0.72,28],[0.07,0.68,32],[0.13,0.65,26],[0.19,0.70,30],[0.25,0.67,28],
        [0.03,0.80,26],[0.09,0.76,30],[0.16,0.74,28],[0.22,0.78,24],[0.28,0.72,26],
        [0.01,0.88,22],[0.06,0.85,28],[0.12,0.82,24],[0.18,0.86,22],[0.24,0.83,26],
        [0.30,0.69,24],[0.35,0.73,22],[0.05,0.92,26],[0.14,0.90,22],[0.21,0.92,24],
      ];
      for (const [fx, fy, fr] of leftTrees) {
        drawCanopy(fx * w, fy * h, fr as number, treeColors[Math.floor((fx * 100) % 5)]);
      }

      // Right forest bank
      const rightTrees = [
        [0.82,0.68,30],[0.87,0.72,26],[0.92,0.66,28],[0.96,0.70,24],[0.99,0.74,20],
        [0.80,0.76,26],[0.85,0.78,28],[0.90,0.74,24],[0.94,0.78,22],[0.98,0.80,20],
        [0.83,0.84,24],[0.88,0.82,26],[0.93,0.86,22],[0.97,0.84,20],
      ];
      for (const [fx, fy, fr] of rightTrees) {
        drawCanopy(fx * w, fy * h, fr as number, treeColors[Math.floor((fx * 100) % 5)]);
      }

      // Forest behind/around the castle base
      const behindTrees = [
        [0.36,0.62,18],[0.40,0.60,16],[0.72,0.60,20],[0.76,0.62,18],[0.79,0.65,16],
        [0.34,0.70,22],[0.42,0.65,18],[0.70,0.66,18],[0.74,0.68,20],
      ];
      for (const [fx, fy, fr] of behindTrees) {
        drawCanopy(fx * w, fy * h, fr as number, treeColors[Math.floor((fx * 100) % 5)]);
      }

      // Ground — dark mossy hillside
      const groundGrad = ctx.createLinearGradient(0, h * 0.80, 0, h);
      groundGrad.addColorStop(0, '#141f12');
      groundGrad.addColorStop(1, '#0c1509');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, h * 0.80, w, h * 0.20);

      // Stone driveway — the approach road the MG drives along
      const roadG = ctx.createLinearGradient(0, h * 0.80, 0, h * 0.826);
      roadG.addColorStop(0, '#62584c'); roadG.addColorStop(1, '#4e4438');
      ctx.fillStyle = roadG;
      ctx.fillRect(0, h * 0.80, w, h * 0.026);
      // Road edge lines
      ctx.strokeStyle = 'rgba(180,162,126,0.28)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, h * 0.80);    ctx.lineTo(w, h * 0.80);    ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, h * 0.826);   ctx.lineTo(w, h * 0.826);   ctx.stroke();
      // Faint dashed centre line
      ctx.strokeStyle = 'rgba(200,182,140,0.18)'; ctx.lineWidth = 1.5;
      ctx.setLineDash([44, 34]);
      ctx.beginPath(); ctx.moveTo(0, h * 0.813); ctx.lineTo(w, h * 0.813); ctx.stroke();
      ctx.setLineDash([]);

      // === RIGHT HILLSIDE — NakedStable-style stone terraces, pool & suites ===
      const trL = w * 0.725;   // left edge of terrace zone
      const trR = w * 1.01;    // extends to right edge (bleeds off-screen)

      // ── Hilltop suites nestled among the tree canopy ──────────────────────
      const sBaseY = h * 0.598;
      const suiteDefs: { sx: number; sw: number; wins: number }[] = [
        { sx: w * 0.770, sw: 44, wins: 2 },
        { sx: w * 0.842, sw: 40, wins: 2 },
        { sx: w * 0.908, sw: 46, wins: 2 },
        { sx: w * 0.970, sw: 36, wins: 1 },
      ];
      for (const s of suiteDefs) {
        // Dark charcoal body
        ctx.fillStyle = '#1c1e1e';
        ctx.fillRect(s.sx - s.sw / 2, sBaseY, s.sw, 24);
        // Flat roof overhang
        ctx.fillStyle = '#101212';
        ctx.fillRect(s.sx - s.sw / 2 - 4, sBaseY - 5, s.sw + 8, 6);
        // Amber windows
        ctx.fillStyle = 'rgba(255,195,90,0.88)';
        if (s.wins === 2) {
          ctx.fillRect(s.sx - 15, sBaseY + 5, 11, 9);
          ctx.fillRect(s.sx + 4,  sBaseY + 5, 11, 9);
        } else {
          ctx.fillRect(s.sx - 8, sBaseY + 5, 16, 9);
        }
        // Window frames
        ctx.strokeStyle = '#5a6464'; ctx.lineWidth = 0.7;
        if (s.wins === 2) {
          ctx.strokeRect(s.sx - 15, sBaseY + 5, 11, 9);
          ctx.strokeRect(s.sx + 4,  sBaseY + 5, 11, 9);
        } else {
          ctx.strokeRect(s.sx - 8, sBaseY + 5, 16, 9);
        }
        // Balcony rail
        ctx.strokeStyle = '#4a5454'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(s.sx - s.sw / 2 - 2, sBaseY + 23);
        ctx.lineTo(s.sx + s.sw / 2 + 2, sBaseY + 23);
        ctx.stroke();
        for (let rp = -Math.floor(s.sw / 2); rp <= Math.floor(s.sw / 2); rp += 7) {
          ctx.beginPath(); ctx.moveTo(s.sx + rp, sBaseY + 23); ctx.lineTo(s.sx + rp, sBaseY + 29); ctx.stroke();
        }
      }

      // ── Naked Stable logo above the hilltop chalets ──────────────────────
      const nsLogoX = w * 0.865;
      const nsLogoY = sBaseY - 58;
      const nsLogoR = 52;
      // Glow ring drawn before clipping so the logo itself stays sharp
      ctx.save();
      ctx.shadowColor = 'rgba(255,255,255,0.5)';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = 'rgba(255,255,255,0.0)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(nsLogoX, nsLogoY, nsLogoR, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      ctx.save();
      if (_nsLogo.complete && _nsLogo.naturalWidth > 0) {
        const iw = _nsLogo.naturalWidth;
        const ih = _nsLogo.naturalHeight;
        // Scale image so the logo circle (76% of image width) fills our canvas circle exactly
        const scale = (nsLogoR * 2) / (iw * 0.76);
        const dw = iw * scale;
        const dh = ih * scale;
        // Circle center sits at ~50% x, ~47% y of the image
        const dx = nsLogoX - iw * 0.50 * scale;
        const dy = nsLogoY - ih * 0.47 * scale;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.beginPath();
        ctx.arc(nsLogoX, nsLogoY, nsLogoR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(_nsLogo, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = '#111111';
        ctx.beginPath(); ctx.arc(nsLogoX, nsLogoY, nsLogoR, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(nsLogoX, nsLogoY, nsLogoR - 3, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(nsLogoX, nsLogoY, nsLogoR - 10, 0, Math.PI * 2); ctx.stroke();
        ctx.font = 'italic 9px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff';
        ctx.fillText('naked', nsLogoX, nsLogoY - 7);
        ctx.font = 'bold 13px Arial, sans-serif';
        ctx.fillText('STABLE', nsLogoX, nsLogoY + 8);
        ctx.font = '9px Arial, sans-serif';
        ctx.fillText('裸心马厩', nsLogoX, nsLogoY + 22);
        ctx.textAlign = 'left';
      }
      ctx.restore();

      // ── 4 curved stone terraces (amphitheatre ascending the slope) ────────
      const numT   = 4;
      const tBase2 = h * 0.738;    // bottom edge of the lowest terrace
      const tStep  = h * 0.030;    // height of each terrace (wall + grass)
      const wallTh = h * 0.009;    // stone wall thickness

      for (let t = 0; t < numT; t++) {
        const wallTopY  = tBase2 - t * tStep;
        const grassTopY = wallTopY - tStep + wallTh;
        const lx2 = trL + t * w * 0.012;   // slight narrowing toward top
        const bow  = h * 0.007 + t * h * 0.003; // arc curvature increases up the hill

        // Grass platform
        const gg = ctx.createLinearGradient(0, grassTopY, 0, wallTopY);
        gg.addColorStop(0, `hsl(110,50%,${34 - t * 2}%)`);
        gg.addColorStop(1, `hsl(110,44%,${26 - t * 2}%)`);
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.moveTo(lx2, grassTopY + bow);
        ctx.quadraticCurveTo((lx2 + trR) / 2, grassTopY - bow, trR, grassTopY + bow);
        ctx.lineTo(trR, wallTopY);
        ctx.lineTo(lx2, wallTopY);
        ctx.fill();

        // Stone retaining wall
        const wg = ctx.createLinearGradient(0, wallTopY, 0, wallTopY + wallTh);
        wg.addColorStop(0,   '#8c8480'); wg.addColorStop(0.5, '#6e6460'); wg.addColorStop(1, '#524c48');
        ctx.fillStyle = wg;
        ctx.beginPath();
        ctx.moveTo(lx2, wallTopY);
        ctx.quadraticCurveTo((lx2 + trR) / 2, wallTopY - bow * 0.85, trR, wallTopY);
        ctx.lineTo(trR, wallTopY + wallTh);
        ctx.quadraticCurveTo((lx2 + trR) / 2, wallTopY + wallTh - bow * 0.5, lx2, wallTopY + wallTh);
        ctx.fill();

        // Mortar line
        ctx.strokeStyle = 'rgba(44,38,34,0.42)'; ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(lx2, wallTopY + wallTh * 0.5);
        ctx.quadraticCurveTo((lx2 + trR) / 2, wallTopY + wallTh * 0.5 - bow * 0.35, trR, wallTopY + wallTh * 0.5);
        ctx.stroke();

        // Vertical stone joints
        ctx.strokeStyle = 'rgba(44,38,34,0.22)'; ctx.lineWidth = 0.5;
        for (let jt = 1; jt <= 5; jt++) {
          const jx2 = lx2 + (trR - lx2) * (jt / 6) + (t % 2 === 0 ? 0 : (trR - lx2) / 12);
          ctx.beginPath(); ctx.moveTo(jx2, wallTopY); ctx.lineTo(jx2, wallTopY + wallTh); ctx.stroke();
        }
      }

      // ── Infinity pool embedded in terrace 2 ───────────────────────────────
      const pTerrace  = 1;   // 2nd terrace from bottom (0-indexed)
      const pWallTopY = tBase2 - pTerrace * tStep;
      const pTopY     = pWallTopY - tStep * 0.62;
      const pBotY     = pWallTopY - wallTh * 1.5;
      const pLeft     = trL + pTerrace * w * 0.012 + w * 0.004;
      const pMidX     = (pLeft + trR) / 2;

      // Water glow
      const pglow2 = ctx.createRadialGradient(pMidX, (pTopY + pBotY) / 2, 0, pMidX, (pTopY + pBotY) / 2, (trR - pLeft) * 0.5);
      pglow2.addColorStop(0, 'rgba(40,160,220,0.30)'); pglow2.addColorStop(1, 'transparent');
      ctx.fillStyle = pglow2;
      ctx.fillRect(pLeft - 18, pTopY - 8, trR - pLeft + 36, pBotY - pTopY + 16);

      // Stone pool coping (near edge, left wall)
      ctx.fillStyle = '#8a9088';
      ctx.fillRect(pLeft, pTopY, trR - pLeft, wallTh * 1.4);
      ctx.fillRect(pLeft - 5, pTopY, 6, pBotY - pTopY);

      // Water fill
      const pw3 = ctx.createLinearGradient(0, pTopY + wallTh, 0, pBotY);
      pw3.addColorStop(0, '#2898d0'); pw3.addColorStop(0.5, '#1872a8'); pw3.addColorStop(1, '#0e4880');
      ctx.fillStyle = pw3;
      ctx.fillRect(pLeft + 1, pTopY + wallTh, trR - pLeft - 1, pBotY - pTopY - wallTh);

      // Infinity overflow edge (right side bleeds off)
      for (let ie2 = 0; ie2 < 3; ie2++) {
        const ieG2 = ctx.createLinearGradient(trR - 2, 0, trR + 22, 0);
        ieG2.addColorStop(0, `rgba(24,138,195,${0.65 - ie2 * 0.18})`); ieG2.addColorStop(1, 'transparent');
        ctx.fillStyle = ieG2;
        ctx.fillRect(trR - 2, pTopY + ie2 * 3, 24, pBotY - pTopY - ie2 * 6);
      }

      // Shimmer lines
      ctx.strokeStyle = 'rgba(160,230,255,0.26)'; ctx.lineWidth = 1;
      for (let sh = 0; sh < 4; sh++) {
        const prog2 = ((time * 0.0006 + sh * 0.25) % 1);
        const shW2  = (trR - pLeft) * (0.06 + prog2 * 0.3);
        const shY2  = pTopY + wallTh + (pBotY - pTopY - wallTh) * (0.25 + sh * 0.18);
        ctx.beginPath(); ctx.moveTo(pMidX - shW2, shY2); ctx.lineTo(pMidX + shW2, shY2); ctx.stroke();
      }

      // Moon reflection in pool
      const mrPulse2 = Math.sin(time * 0.0011) * 3;
      ctx.fillStyle = 'rgba(205,228,255,0.48)';
      ctx.beginPath();
      ctx.ellipse(pMidX + mrPulse2, (pTopY + pBotY) / 2, 5, (pBotY - pTopY) * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── Stone steps on left edge connecting terrace levels ────────────────
      const stepsX = trL + w * 0.010;
      for (let st = 0; st < numT - 1; st++) {
        const stY2 = tBase2 - (st + 1) * tStep + wallTh;
        const stW2 = w * 0.024;
        const stH2 = tStep - wallTh;
        ctx.fillStyle = '#787270';
        ctx.fillRect(stepsX, stY2, stW2, stH2);
        ctx.strokeStyle = 'rgba(50,44,40,0.38)'; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(stepsX, stY2 + stH2 / 2); ctx.lineTo(stepsX + stW2, stY2 + stH2 / 2); ctx.stroke();
        // Handrail post
        ctx.strokeStyle = '#505050'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(stepsX + stW2 - 4, stY2); ctx.lineTo(stepsX + stW2 - 4, stY2 - tStep * 0.7); ctx.stroke();
      }
      // Handrail line
      ctx.strokeStyle = '#606060'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(stepsX + w * 0.020, tBase2 - (numT - 1) * tStep - tStep * 0.4);
      ctx.lineTo(stepsX + w * 0.020, tBase2 - wallTh);
      ctx.stroke();

      // === ROADSIDE & TERRACE FLOWERS ===
      const drawFlower = (fx: number, fy: number, petalCol: string, sz: number) => {
        // Stem
        ctx.strokeStyle = '#3a6020'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(fx, fy + sz * 0.8); ctx.lineTo(fx, fy + sz * 0.8 + 8); ctx.stroke();
        // 5 petals
        ctx.fillStyle = petalCol;
        for (let p = 0; p < 5; p++) {
          const ang = (p / 5) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.ellipse(fx + Math.cos(ang) * sz * 0.88, fy + Math.sin(ang) * sz * 0.88, sz * 0.65, sz * 0.42, ang, 0, Math.PI * 2);
          ctx.fill();
        }
        // Centre disc
        ctx.fillStyle = '#FFE040';
        ctx.beginPath(); ctx.arc(fx, fy, sz * 0.42, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#CC7800';
        ctx.beginPath(); ctx.arc(fx, fy, sz * 0.18, 0, Math.PI * 2); ctx.fill();
      };

      const flowerBeds: [number, number, string, number][] = [
        // Left road edge
        [w * 0.05,  h * 0.797, '#FF9EC8', 4.5],
        [w * 0.085, h * 0.793, '#FFD700', 4.0],
        [w * 0.12,  h * 0.798, '#FFFFFF', 4.5],
        [w * 0.16,  h * 0.794, '#FF9EC8', 4.0],
        [w * 0.30,  h * 0.796, '#FFD700', 4.5],
        [w * 0.34,  h * 0.793, '#FFFFFF', 4.0],
        [w * 0.38,  h * 0.797, '#FF9EC8', 4.5],
        // Right road edge
        [w * 0.72,  h * 0.796, '#FFFFFF', 4.5],
        [w * 0.755, h * 0.793, '#FF9EC8', 4.0],
        [w * 0.79,  h * 0.797, '#FFD700', 4.5],
        // Lake bank flowers
        [w * 0.818, h * 0.838, '#FFFFFF', 3.5],
        [w * 0.850, h * 0.842, '#FF9EC8', 3.5],
        [w * 0.882, h * 0.839, '#FFD700', 3.5],
        [w * 0.932, h * 0.840, '#FFFFFF', 3.5],
        [w * 0.962, h * 0.837, '#FF9EC8', 3.5],
      ];
      for (const [fx, fy, col, sz] of flowerBeds) {
        drawFlower(fx, fy, col, sz);
      }
    },
    platforms: (w, h) => [
      // Ground — stone road, full width base
      { x: 0,        y: h * 0.826, width: w,        height: 16 },

      // Pool side — left terracing (matches the pool terrace visual)
      { x: 0,        y: h * 0.68,  width: w * 0.20, height: 16 }, // terrace step
      { x: 0,        y: h * 0.56,  width: w * 0.24, height: 16 }, // pool deck

      // Castle hill — left ascent (each step ≤187px above the last, jump-reachable)
      { x: w * 0.18, y: h * 0.72,  width: w * 0.13, height: 16 }, // hill foot
      { x: w * 0.26, y: h * 0.60,  width: w * 0.12, height: 16 }, // hill mid
      { x: w * 0.33, y: h * 0.48,  width: w * 0.12, height: 16 }, // hill upper
      { x: w * 0.38, y: h * 0.32,  width: w * 0.22, height: 16 }, // hilltop / castle entrance

      // Castle hill — right descent
      { x: w * 0.57, y: h * 0.44,  width: w * 0.12, height: 16 }, // upper right
      { x: w * 0.62, y: h * 0.56,  width: w * 0.13, height: 16 }, // mid right
      { x: w * 0.60, y: h * 0.66,  width: w * 0.18, height: 16 }, // chalet level
      { x: w * 0.72, y: h * 0.74,  width: w * 0.13, height: 16 }, // hill foot right
    ],
    drawPlatforms: () => {},
    memories: (w, h) => [
      { x: w * 0.10 + 74, y: h * 0.56 + 26, type: 'pool', videoSrc: '/NakedCastelPool.mp4', description: 'The infinity pool overlooking Moganshan' },
      { x: w * 0.68, y: h * 0.66,           type: 'chalet',  description: 'A cozy wooden retreat tucked in the bamboo hills' },
      { x: w * 0.52, y: h * 0.80 - 18,      type: 'mg', description: 'The red MG Cyberster — wind in your hair' },
      { x: w * 0.48, y: h * 0.26,            type: 'castle', videoSrc: '/NakedCastle.mp4', description: 'Naked Castle — Moganshan\'s crown jewel since 1910' },
    ],
    drawMemory: (ctx, mem, time) => {
      const mx = mem.x;
      const my = mem.y;
      const pulse = Math.sin(time * 0.0025) * 3;

      if (mem.type === 'castle') {
        ctx.save();
        ctx.translate(mx, my + pulse);
        // Glow
        ctx.shadowColor = '#d4a853';
        ctx.shadowBlur = 14 + pulse;
        // Tower
        ctx.fillStyle = '#3a3020';
        ctx.fillRect(-8, -30, 16, 44);
        // Tower crenels
        ctx.fillStyle = '#2a2010';
        for (let c = 0; c < 3; c++) ctx.fillRect(-8 + c * 6, -36, 4, 8);
        // Main body
        ctx.fillStyle = '#4a3e28';
        ctx.fillRect(-22, -8, 44, 40);
        // Crenels on main body
        for (let c = 0; c < 5; c++) ctx.fillRect(-22 + c * 9, -15, 6, 9);
        // Windows (lit amber)
        ctx.fillStyle = 'rgba(255,190,60,0.9)';
        ctx.fillRect(-16, 0,  8, 10);
        ctx.fillRect(  8, 0,  8, 10);
        ctx.fillRect( -4, 0,  8, 10);
        // Door
        ctx.fillStyle = '#1a1008';
        ctx.fillRect(-4, 16, 8, 16);
        ctx.beginPath();
        ctx.arc(0, 16, 4, Math.PI, 0);
        ctx.fill();
        // Art deco gold band
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-22, -9, 44, 2);
        ctx.restore();

      } else if (mem.type === 'pool') {
        // The pool itself is drawn in the background — just show a subtle pulsing glow
        ctx.save();
        const glowRadius = 55 + pulse * 2;
        const glowAlpha = 0.18 + Math.sin(time * 0.0025) * 0.06;
        const poolGlow = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
        poolGlow.addColorStop(0,   `rgba(30,190,220,${glowAlpha * 2})`);
        poolGlow.addColorStop(0.5, `rgba(30,190,220,${glowAlpha})`);
        poolGlow.addColorStop(1,   'transparent');
        ctx.fillStyle = poolGlow;
        ctx.beginPath();
        ctx.ellipse(mx, my, glowRadius, glowRadius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (mem.type === 'chalet') {
        ctx.save();
        ctx.translate(mx, my + pulse * 0.4);
        ctx.shadowColor = '#a0c880';
        ctx.shadowBlur = 14 + pulse;

        // --- Bamboo forest behind (background layer) ---
        const bambooColors = ['#3a5a28', '#4a7030', '#2e4820', '#5a8038'];
        for (let b = 0; b < 14; b++) {
          const bx = -52 + b * 8 + (b % 3) * 2;
          const bh = 38 + (b % 4) * 10;
          const by = 28 - bh;
          ctx.fillStyle = bambooColors[b % bambooColors.length];
          ctx.fillRect(bx, by, 3, bh);
          // Bamboo nodes
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          for (let n = 0; n < 4; n++) ctx.fillRect(bx - 0.5, by + n * (bh / 4), 4, 1.5);
          // Leaves
          ctx.fillStyle = bambooColors[(b + 1) % bambooColors.length];
          ctx.beginPath();
          ctx.ellipse(bx + 1 + (b % 2 === 0 ? 7 : -7), by + 4, 7, 2.5, b % 2 === 0 ? 0.4 : -0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // --- Lower unit (wider, ground level) ---
        // Dark charcoal body
        ctx.fillStyle = '#1e2020';
        ctx.fillRect(-44, 4, 88, 26);
        // Flat roof overhang
        ctx.fillStyle = '#161818';
        ctx.fillRect(-47, 1, 94, 5);
        // Large panoramic windows — lit amber/warm
        ctx.fillStyle = 'rgba(255,210,120,0.82)';
        ctx.fillRect(-38, 7, 24, 14);
        ctx.fillRect(-8,  7, 24, 14);
        ctx.fillRect(20,  7, 16, 14);
        // Window frames (light grey)
        ctx.strokeStyle = '#8a9090';
        ctx.lineWidth = 1;
        ctx.strokeRect(-38, 7, 24, 14);
        ctx.strokeRect(-8,  7, 24, 14);
        ctx.strokeRect(20,  7, 16, 14);
        // Window mullions
        ctx.beginPath();
        ctx.moveTo(-26, 7); ctx.lineTo(-26, 21);
        ctx.moveTo( 4,  7); ctx.lineTo( 4,  21);
        ctx.stroke();
        // Terrace railing (thin horizontal bar + posts)
        ctx.strokeStyle = '#606868';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-47, 28); ctx.lineTo(47, 28);
        ctx.stroke();
        for (let p = -44; p <= 44; p += 8) {
          ctx.beginPath(); ctx.moveTo(p, 29); ctx.lineTo(p, 36); ctx.stroke();
        }
        ctx.fillStyle = '#161818';
        ctx.fillRect(-48, 36, 96, 4); // base deck edge

        // --- Upper unit (stepped back, slightly raised) ---
        ctx.fillStyle = '#1a1c1c';
        ctx.fillRect(-30, -20, 60, 24);
        // Flat roof
        ctx.fillStyle = '#111313';
        ctx.fillRect(-33, -23, 66, 5);
        // Windows
        ctx.fillStyle = 'rgba(255,210,120,0.75)';
        ctx.fillRect(-24, -17, 18, 12);
        ctx.fillRect( -2, -17, 18, 12);
        ctx.strokeStyle = '#8a9090';
        ctx.lineWidth = 1;
        ctx.strokeRect(-24, -17, 18, 12);
        ctx.strokeRect( -2, -17, 18, 12);
        // Mullion
        ctx.beginPath();
        ctx.moveTo(-15, -17); ctx.lineTo(-15, -5);
        ctx.moveTo(  7, -17); ctx.lineTo(  7, -5);
        ctx.stroke();
        // Terrace balcony railing on upper unit
        ctx.strokeStyle = '#505858';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-33, 3); ctx.lineTo(33, 3); ctx.stroke();
        for (let p = -30; p <= 30; p += 7) {
          ctx.beginPath(); ctx.moveTo(p, 4); ctx.lineTo(p, 9); ctx.stroke();
        }

        // --- Warm interior glow leak ---
        ctx.globalAlpha = 0.12 + Math.sin(time * 0.0018) * 0.04;
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 55);
        glow.addColorStop(0, '#ffcc66');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.ellipse(0, 5, 55, 30, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        ctx.restore();

      } else if (mem.type === 'mg') {
        ctx.save();
        ctx.translate(mx, my);
        ctx.shadowColor = '#ff1a1a';
        ctx.shadowBlur = 18 + pulse * 2;

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.beginPath();
        ctx.ellipse(0, 16, 50, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // --- Main body (vibrant red, wedge/roadster profile) ---
        ctx.fillStyle = '#cc1010';
        ctx.beginPath();
        ctx.moveTo(-44,  0);   // front bumper bottom
        ctx.lineTo(-47, -7);   // front upper
        ctx.lineTo(-38, -13);  // hood base
        ctx.lineTo(-14, -17);  // hood top
        ctx.lineTo( -6, -23);  // windshield base front
        ctx.lineTo(  3, -25);  // windshield top
        ctx.lineTo( 12, -22);  // windshield base rear
        ctx.lineTo( 28, -18);  // rear deck
        ctx.lineTo( 40, -10);  // rear top
        ctx.lineTo( 44,  -3);  // rear corner
        ctx.lineTo( 44,   0);  // rear bottom
        ctx.closePath();
        ctx.fill();

        // Top highlight (lighter red)
        ctx.fillStyle = '#e82020';
        ctx.beginPath();
        ctx.moveTo(-14, -17);
        ctx.lineTo( -6, -23);
        ctx.lineTo(  3, -25);
        ctx.lineTo( 12, -22);
        ctx.lineTo( 28, -18);
        ctx.lineTo( 26, -15);
        ctx.lineTo( 10, -19);
        ctx.lineTo(  1, -22);
        ctx.lineTo( -7, -20);
        ctx.lineTo(-13, -14);
        ctx.fill();

        // Black side sill / lower trim
        ctx.fillStyle = '#111';
        ctx.fillRect(-44, -3, 88, 5);

        // Windshield glass (blue-tinted)
        ctx.fillStyle = 'rgba(120,180,220,0.65)';
        ctx.beginPath();
        ctx.moveTo(-6,  -23);
        ctx.lineTo( 3,  -25);
        ctx.lineTo(12,  -22);
        ctx.lineTo( 8,  -19);
        ctx.lineTo(-3,  -19);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Windshield frame / A-pillar
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, -23); ctx.lineTo(-3, -19);
        ctx.moveTo(12, -22); ctx.lineTo( 8, -19);
        ctx.stroke();

        // --- LED headlight — angular slash style ---
        ctx.fillStyle = '#fffce8';
        ctx.beginPath();
        ctx.moveTo(-47, -11);
        ctx.lineTo(-38, -13);
        ctx.lineTo(-36,  -9);
        ctx.lineTo(-46,  -8);
        ctx.fill();
        // DRL bar
        ctx.strokeStyle = '#ffe566';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-47, -10);
        ctx.lineTo(-37, -12);
        ctx.stroke();
        // Lower intake vent
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(-44, -5, 14, 3);
        ctx.fillRect(-44, -1, 10, 2);

        // --- Rear light ---
        ctx.fillStyle = '#ff3333';
        ctx.fillRect(39, -9, 5, 6);
        ctx.fillStyle = '#ffaaaa';
        ctx.fillRect(40, -8, 3, 4);

        // --- Wheel arches (dark cutout) ---
        ctx.fillStyle = '#0d0d0d';
        ctx.beginPath(); ctx.arc(-24, 2, 13, Math.PI, 0, true); ctx.fill();
        ctx.beginPath(); ctx.arc( 22, 2, 13, Math.PI, 0, true); ctx.fill();

        // --- Wheels ---
        for (const wx of [-24, 22]) {
          // Tyre
          ctx.fillStyle = '#111';
          ctx.beginPath(); ctx.arc(wx, 5, 11, 0, Math.PI * 2); ctx.fill();
          // Tyre highlight
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(wx, 5, 10, 0, Math.PI * 2); ctx.stroke();
          // Alloy rim
          ctx.fillStyle = '#888';
          ctx.beginPath(); ctx.arc(wx, 5, 7, 0, Math.PI * 2); ctx.fill();
          // Spokes (5-spoke)
          ctx.strokeStyle = '#bbb';
          ctx.lineWidth = 1.5;
          for (let sp = 0; sp < 5; sp++) {
            const ang = (sp / 5) * Math.PI * 2 + time * 0.001;
            ctx.beginPath();
            ctx.moveTo(wx, 5);
            ctx.lineTo(wx + Math.cos(ang) * 6, 5 + Math.sin(ang) * 6);
            ctx.stroke();
          }
          // Red brake caliper
          ctx.fillStyle = '#cc0000';
          ctx.beginPath(); ctx.arc(wx - 3, 5, 2.5, 0, Math.PI * 2); ctx.fill();
          // Centre hub
          ctx.fillStyle = '#ddd';
          ctx.beginPath(); ctx.arc(wx, 5, 2, 0, Math.PI * 2); ctx.fill();
        }

        // --- MG badge (octagon on front) ---
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(-50, -9, 5, 5);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 4px monospace';
        ctx.fillText('MG', -50, -5);

        // Gullwing door hint (subtle dark line)
        ctx.strokeStyle = 'rgba(80,0,0,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-10, -19); ctx.lineTo(-14, -3);
        ctx.moveTo( 10, -19); ctx.lineTo( 18, -3);
        ctx.stroke();

        ctx.restore();
      }
    },
    backgroundLabels: (w, h) => [
      { x: w * 0.10 + 74, y: h * 0.56 + 26, radius: 80, title: 'Infinity Pool', subtitle: 'Naked Castle · Moganshan' },
    ],
  },

  concert: (() => {
    const bgImg = new Image();
    bgImg.src = '/JazzClub.png';

    // Pre-baked offscreen canvas for static bar elements
    let staticCache: OffscreenCanvas | null = null;
    let cachedW = 0, cachedH = 0;

    function buildStatic(w: number, h: number) {
      if (staticCache && cachedW === w && cachedH === h) return staticCache;
      cachedW = w; cachedH = h;
      staticCache = new OffscreenCanvas(w, h);
      const c = staticCache.getContext('2d')!;

      // Deep warm base
      const base = c.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, '#0e0604'); base.addColorStop(0.3, '#1a0a04');
      base.addColorStop(0.7, '#281208'); base.addColorStop(1, '#140a04');
      c.fillStyle = base; c.fillRect(0, 0, w, h);

      // Exposed brick wall texture
      c.fillStyle = 'rgba(80,30,12,0.35)';
      for (let row = 0; row < 18; row++) {
        const offset = (row % 2) * 22;
        for (let col = -1; col < w / 44 + 1; col++) {
          const bx = col * 44 + offset;
          const by = row * 18 + 2;
          if (by > h * 0.55) break;
          c.fillRect(bx + 1, by + 1, 40, 14);
        }
      }
      // Brick mortar lines
      c.strokeStyle = 'rgba(20,8,4,0.4)'; c.lineWidth = 1;
      for (let row = 0; row <= 18; row++) {
        const by = row * 18 + 2;
        if (by > h * 0.55) break;
        c.beginPath(); c.moveTo(0, by); c.lineTo(w, by); c.stroke();
        const offset = (row % 2) * 22;
        for (let col = 0; col < w / 44 + 1; col++) {
          const bx = col * 44 + offset;
          c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + 18); c.stroke();
        }
      }

      // Warm ambient wall glow
      const wallGlow = c.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, w * 0.6);
      wallGlow.addColorStop(0, 'rgba(180,80,20,0.15)');
      wallGlow.addColorStop(0.5, 'rgba(120,40,8,0.06)');
      wallGlow.addColorStop(1, 'transparent');
      c.fillStyle = wallGlow; c.fillRect(0, 0, w, h);

      // Stage floor (dark polished wood)
      const floorG = c.createLinearGradient(0, h * 0.73, 0, h);
      floorG.addColorStop(0, '#2e1408'); floorG.addColorStop(0.3, '#241006');
      floorG.addColorStop(1, '#140804');
      c.fillStyle = floorG; c.fillRect(0, h * 0.73, w, h * 0.27);
      // Wood planks
      c.strokeStyle = 'rgba(60,25,8,0.45)'; c.lineWidth = 1;
      for (let v = 0; v < 18; v++) {
        c.beginPath(); c.moveTo(w * v / 18, h * 0.73); c.lineTo(w * v / 18 + 14, h); c.stroke();
      }
      for (let p = 1; p < 7; p++) {
        c.beginPath(); c.moveTo(0, h * 0.73 + p * (h * 0.27 / 7)); c.lineTo(w, h * 0.73 + p * (h * 0.27 / 7)); c.stroke();
      }
      // Stage edge highlight
      const edgeG = c.createLinearGradient(0, h * 0.73, 0, h * 0.76);
      edgeG.addColorStop(0, 'rgba(200,90,20,0.3)'); edgeG.addColorStop(1, 'transparent');
      c.fillStyle = edgeG; c.fillRect(0, h * 0.73, w, h * 0.03);

      // Side curtains (deep velvet red)
      for (let side = 0; side < 2; side++) {
        const cGrad = side === 0
          ? c.createLinearGradient(0, 0, w * 0.08, 0)
          : c.createLinearGradient(w * 0.92, 0, w, 0);
        cGrad.addColorStop(side === 0 ? 0 : 1, '#2a0404');
        cGrad.addColorStop(side === 0 ? 1 : 0, 'transparent');
        c.fillStyle = cGrad;
        c.fillRect(side === 0 ? 0 : w * 0.92, 0, w * 0.08, h);
        // Curtain fold lines
        c.strokeStyle = 'rgba(60,10,10,0.3)'; c.lineWidth = 1;
        const startX = side === 0 ? w * 0.02 : w * 0.94;
        for (let f = 0; f < 3; f++) {
          c.beginPath();
          c.moveTo(startX + f * 8, 0);
          c.quadraticCurveTo(startX + f * 8 + 4, h * 0.5, startX + f * 8, h);
          c.stroke();
        }
      }

      // ── Overhead lighting rig ────────────────────────────────────
      {
        const rigY = h * 0.04;
        // Ceiling chain mounts
        c.strokeStyle = '#555'; c.lineWidth = 1.5;
        for (const mx of [w*0.25, w*0.5, w*0.75]) {
          c.beginPath(); c.moveTo(mx, 0); c.lineTo(mx, rigY); c.stroke();
        }
        // Truss beam (dark metallic gradient)
        const trussG = c.createLinearGradient(w*0.03, rigY, w*0.03, rigY + 8);
        trussG.addColorStop(0, '#4a4a4a'); trussG.addColorStop(1, '#2a2a2a');
        c.fillStyle = trussG;
        c.fillRect(w*0.03, rigY, w*0.94, 8);
        // Diagonal cross-bracing
        c.strokeStyle = '#555'; c.lineWidth = 0.8;
        const segW = w * 0.94 / 12;
        for (let i = 0; i < 12; i++) {
          const x1 = w*0.03 + i * segW;
          c.beginPath(); c.moveTo(x1, rigY); c.lineTo(x1 + segW, rigY + 8); c.stroke();
          c.beginPath(); c.moveTo(x1, rigY + 8); c.lineTo(x1 + segW, rigY); c.stroke();
        }
        // PAR can lights (alternating red / amber)
        const parX = [w*0.12, w*0.28, w*0.50, w*0.72, w*0.88];
        const parCol = ['#8b0000','#c07808','#8b0000','#c07808','#8b0000'];
        for (let i = 0; i < parX.length; i++) {
          const lx = parX[i], ly = rigY + 8;
          // Housing box
          c.fillStyle = '#2a2a2a';
          c.fillRect(lx - 6, ly, 12, 10);
          // Coloured lens
          c.fillStyle = parCol[i]; c.globalAlpha = 0.8;
          c.beginPath(); c.ellipse(lx, ly + 10, 6, 3.5, 0, 0, Math.PI * 2); c.fill();
          c.globalAlpha = 1;
          // Downward beam cone
          const bG = c.createLinearGradient(lx, ly + 10, lx, ly + 90);
          bG.addColorStop(0, parCol[i] + '55'); bG.addColorStop(1, 'transparent');
          c.fillStyle = bG;
          c.beginPath();
          c.moveTo(lx - 6, ly + 10); c.lineTo(lx + 6, ly + 10);
          c.lineTo(lx + 18, ly + 90); c.lineTo(lx - 18, ly + 90);
          c.closePath(); c.fill();
        }
      }

      // Bar counter
      const barY = h * 0.56;
      const barH = 16;
      // Back wall bar section (darker)
      c.fillStyle = '#120804';
      c.fillRect(w * 0.02, barY - 65, w * 0.96, 65);
      // Bottle shelves
      c.fillStyle = '#3a1808';
      c.fillRect(w * 0.04, barY - 60, w * 0.92, 3);
      c.fillRect(w * 0.04, barY - 32, w * 0.92, 3);
      // Mirror behind bar
      c.fillStyle = 'rgba(40,30,25,0.6)';
      c.fillRect(w * 0.15, barY - 58, w * 0.70, 24);
      c.strokeStyle = 'rgba(180,140,80,0.3)'; c.lineWidth = 1;
      c.strokeRect(w * 0.15, barY - 58, w * 0.70, 24);
      // Bottles on shelves
      const bottleData = [
        { c: '#1a6b3a', h: 22 }, { c: '#8b1a1a', h: 20 }, { c: '#c8860a', h: 24 },
        { c: '#1a4a7a', h: 18 }, { c: '#6a2a6a', h: 21 }, { c: '#1a8a6a', h: 19 },
        { c: '#b86a08', h: 23 }, { c: '#8a1a1a', h: 20 }, { c: '#1a5a8a', h: 22 },
        { c: '#5a1a5a', h: 18 }, { c: '#a08a10', h: 24 }, { c: '#1a6a3a', h: 20 },
      ];
      for (let b = 0; b < bottleData.length; b++) {
        const bx = w * 0.06 + b * (w * 0.88 / 12);
        const shelf = b < 6 ? barY - 60 : barY - 32;
        const bd = bottleData[b];
        c.fillStyle = bd.c; c.globalAlpha = 0.55;
        // Body
        c.beginPath();
        c.roundRect(bx - 3, shelf - bd.h, 6, bd.h - 2, 1);
        c.fill();
        // Neck
        c.fillRect(bx - 1.5, shelf - bd.h - 6, 3, 7);
        // Label
        c.fillStyle = 'rgba(255,255,240,0.25)';
        c.fillRect(bx - 2.5, shelf - bd.h + 5, 5, 6);
        c.globalAlpha = 1;
      }
      // Bar counter top
      const barGrad = c.createLinearGradient(0, barY, 0, barY + barH);
      barGrad.addColorStop(0, '#6a3210');
      barGrad.addColorStop(0.4, '#4a2208');
      barGrad.addColorStop(1, '#2a1004');
      c.fillStyle = barGrad;
      c.beginPath(); c.roundRect(w * 0.02, barY, w * 0.96, barH, 2); c.fill();
      // Bar edge shine
      c.strokeStyle = 'rgba(220,160,70,0.4)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(w * 0.02, barY + 1); c.lineTo(w * 0.98, barY + 1); c.stroke();
      // Bar front panel
      c.fillStyle = '#160a04';
      c.fillRect(w * 0.02, barY + barH, w * 0.96, h * 0.17);

      // JazzClub poster on back wall
      const pw = Math.min(w * 0.24, 280);
      const ph = pw * (800 / 1200);
      const px = w * 0.5 - pw / 2;
      const py = h * 0.06;
      c.fillStyle = 'rgba(0,0,0,0.5)';
      c.fillRect(px - 5, py - 5, pw + 10, ph + 10);
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        c.drawImage(bgImg, px, py, pw, ph);
      }
      const fW = 5;
      c.strokeStyle = '#9a7408'; c.lineWidth = fW;
      c.strokeRect(px - fW / 2, py - fW / 2, pw + fW, ph + fW);
      c.strokeStyle = '#d4a828'; c.lineWidth = 1;
      c.strokeRect(px + 2, py + 2, pw - 4, ph - 4);

      // --- Wall-mounted acoustic guitar (left of poster) ---
      (() => {
        const gx = px - 60, gy = h * 0.18;
        c.save(); c.translate(gx, gy); c.rotate(0.12);
        // Neck
        c.fillStyle = '#5a2a08'; c.fillRect(-3, -55, 6, 45);
        // Frets
        c.strokeStyle = '#c8a040'; c.lineWidth = 1;
        for (let f = 0; f < 6; f++) { c.beginPath(); c.moveTo(-3, -52 + f * 7); c.lineTo(3, -52 + f * 7); c.stroke(); }
        // Headstock
        c.fillStyle = '#3a1604'; c.fillRect(-5, -62, 10, 10);
        c.fillStyle = '#c8a030';
        for (let p = 0; p < 3; p++) { c.beginPath(); c.arc(-7, -59 + p * 4, 2, 0, Math.PI * 2); c.fill(); }
        for (let p = 0; p < 3; p++) { c.beginPath(); c.arc(7, -59 + p * 4, 2, 0, Math.PI * 2); c.fill(); }
        // Body - upper bout
        const sb = c.createRadialGradient(0, 0, 2, 0, 0, 28);
        sb.addColorStop(0, '#e8a040'); sb.addColorStop(0.5, '#b06810'); sb.addColorStop(1, '#6a3808');
        c.fillStyle = sb;
        c.beginPath(); c.ellipse(0, -4, 18, 14, 0, 0, Math.PI * 2); c.fill();
        // Lower bout
        c.beginPath(); c.ellipse(0, 18, 22, 17, 0, 0, Math.PI * 2); c.fill();
        // Sound hole
        c.fillStyle = '#1a0a04';
        c.beginPath(); c.arc(0, 6, 7, 0, Math.PI * 2); c.fill();
        c.strokeStyle = '#c8a030'; c.lineWidth = 1.5;
        c.beginPath(); c.arc(0, 6, 7, 0, Math.PI * 2); c.stroke();
        // Strings
        c.strokeStyle = 'rgba(230,220,180,0.6)'; c.lineWidth = 0.7;
        for (let s = -2; s <= 2; s++) { c.beginPath(); c.moveTo(s * 1.5, -10); c.lineTo(s * 1.5, 30); c.stroke(); }
        // Bridge
        c.fillStyle = '#4a2208'; c.fillRect(-8, 26, 16, 3);
        // Wall mount hook
        c.fillStyle = '#888'; c.fillRect(-2, -64, 4, 5);
        c.restore();
      })();

      // --- Wall-mounted electric guitar (right of poster) ---
      (() => {
        const gx = px + pw + 55, gy = h * 0.2;
        c.save(); c.translate(gx, gy); c.rotate(-0.1);
        // Neck
        c.fillStyle = '#4a2008'; c.fillRect(-3, -50, 6, 40);
        c.strokeStyle = '#aaa'; c.lineWidth = 1;
        for (let f = 0; f < 6; f++) { c.beginPath(); c.moveTo(-3, -47 + f * 6); c.lineTo(3, -47 + f * 6); c.stroke(); }
        // Headstock
        c.fillStyle = '#1a1a1a'; c.fillRect(-5, -56, 10, 8);
        c.fillStyle = '#c0c0c0';
        for (let p = 0; p < 3; p++) { c.beginPath(); c.arc(-7, -54 + p * 3, 1.5, 0, Math.PI * 2); c.fill(); }
        for (let p = 0; p < 3; p++) { c.beginPath(); c.arc(7, -54 + p * 3, 1.5, 0, Math.PI * 2); c.fill(); }
        // Body (SG/LP style)
        c.fillStyle = '#8b0000';
        c.beginPath(); c.ellipse(-2, 0, 16, 12, 0.1, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.ellipse(0, 18, 20, 15, 0, 0, Math.PI * 2); c.fill();
        // Pickguard
        c.fillStyle = 'rgba(20,10,5,0.6)';
        c.beginPath(); c.ellipse(6, 14, 8, 11, 0.2, 0, Math.PI * 2); c.fill();
        // Pickups
        c.fillStyle = '#c0c0c0';
        c.fillRect(-6, 2, 12, 3);
        c.fillRect(-6, 14, 12, 3);
        // Bridge
        c.fillStyle = '#c0c0c0'; c.fillRect(-5, 24, 10, 2);
        // Strings
        c.strokeStyle = 'rgba(220,220,200,0.5)'; c.lineWidth = 0.6;
        for (let s = -2; s <= 2; s++) { c.beginPath(); c.moveTo(s * 1.3, -10); c.lineTo(s * 1.3, 26); c.stroke(); }
        // Knobs
        c.fillStyle = '#333';
        c.beginPath(); c.arc(-8, 22, 2.5, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(10, 22, 2.5, 0, Math.PI * 2); c.fill();
        // Wall mount
        c.fillStyle = '#888'; c.fillRect(-2, -58, 4, 5);
        c.restore();
      })();


      // --- Upright bass (right side of stage) ---
      (() => {
        const bx = w * 0.92, by = h * 0.73;
        c.save(); c.translate(bx, by); c.rotate(0.08);
        // Neck/fingerboard
        c.fillStyle = '#2a1204'; c.fillRect(-3, -90, 6, 55);
        // Scroll
        c.fillStyle = '#2a1204';
        c.beginPath();
        c.moveTo(-3, -90);
        c.quadraticCurveTo(-8, -98, -4, -100);
        c.quadraticCurveTo(0, -102, 3, -98);
        c.lineTo(3, -90);
        c.fill();
        // Tuning pegs
        c.fillStyle = '#1a0a04';
        c.fillRect(-7, -94, 4, 2); c.fillRect(3, -94, 4, 2);
        c.fillRect(-7, -88, 4, 2); c.fillRect(3, -88, 4, 2);
        // Body
        const bb = c.createRadialGradient(0, -20, 3, 0, -20, 25);
        bb.addColorStop(0, '#c8860a'); bb.addColorStop(0.6, '#8a5a08'); bb.addColorStop(1, '#4a2a04');
        c.fillStyle = bb;
        c.beginPath(); c.ellipse(0, -28, 14, 10, 0, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.ellipse(0, -8, 18, 14, 0, 0, Math.PI * 2); c.fill();
        // F-holes
        c.strokeStyle = '#1a0a04'; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(-6, -22); c.quadraticCurveTo(-8, -16, -6, -10); c.stroke();
        c.beginPath(); c.moveTo(6, -22); c.quadraticCurveTo(8, -16, 6, -10); c.stroke();
        // Bridge
        c.fillStyle = '#4a2a08'; c.fillRect(-6, -12, 12, 2);
        // Strings
        c.strokeStyle = 'rgba(220,210,180,0.6)'; c.lineWidth = 0.8;
        for (let s = -2; s <= 2; s += 2) { c.beginPath(); c.moveTo(s, -35); c.lineTo(s, 0); c.stroke(); }
        // Tailpiece
        c.fillStyle = '#1a0a04'; c.fillRect(-3, -2, 6, 4);
        // End pin
        c.strokeStyle = '#666'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(0, 2); c.lineTo(0, 14); c.stroke();
        c.restore();
      })();

      return staticCache;
    }

    // Skin tones for variety
    const skinTones = ['#FFDAB9', '#D2A679', '#8D5524', '#C68642', '#F1C27D', '#E0AC69'];

    return {
    name: '🎺 Eldad & Tamir Live',
    playerStart: (w, h) => ({ x: 50, y: h * 0.7 }),
    playerPhysics: {
      jumpPower: 12,
      gravity: 0.85,
    },
    background: (ctx, w, h, time) => {
      // Draw cached static background
      const bg = buildStatic(w, h);
      ctx.drawImage(bg, 0, 0);

      const barY = h * 0.56;

      // --- Spotlight beams (only 3, simpler) ---
      for (const sx of [0.3, 0.5, 0.7]) {
        const fl = 0.85 + Math.sin(time * 0.0012 + sx * 7) * 0.06;
        ctx.save();
        ctx.globalAlpha = fl * 0.35;
        const beam = ctx.createLinearGradient(w * sx, 0, w * sx, h * 0.75);
        beam.addColorStop(0, 'rgba(255,170,50,0.6)');
        beam.addColorStop(1, 'transparent');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(w * sx - 8, 0);
        ctx.lineTo(w * sx - h * 0.22, h * 0.75);
        ctx.lineTo(w * sx + h * 0.22, h * 0.75);
        ctx.lineTo(w * sx + 8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // --- JAZZ neon sign (simpler glow) ---
      const np = 0.88 + Math.sin(time * 0.002) * 0.12;
      ctx.save();
      ctx.shadowColor = `rgba(255,20,20,${np})`;
      ctx.shadowBlur = 22;
      ctx.font = 'bold 34px "Press Start 2P", monospace';
      ctx.fillStyle = `rgba(255,30,30,${0.85 + np * 0.15})`;
      const jw = ctx.measureText('JAZZ').width;
      ctx.fillText('JAZZ', w * 0.5 - jw / 2, barY - 70);
      ctx.restore();

      // --- Crowd at the bar (13 patrons) ---
      const fans = [
        { pos: 0.06, skin: 0, hair: '#1a1a1a', shirt: '#2c3e50', type: 'short' },
        { pos: 0.12, skin: 1, hair: '#8b4513', shirt: '#8b0000', type: 'long' },
        { pos: 0.19, skin: 2, hair: '#1a1a1a', shirt: '#2980b9', type: 'short' },
        { pos: 0.26, skin: 3, hair: '#654321', shirt: '#1a6b3a', type: 'bald' },
        { pos: 0.33, skin: 4, hair: '#daa520', shirt: '#6a2a6a', type: 'long' },
        { pos: 0.40, skin: 0, hair: '#d35400', shirt: '#34495e', type: 'short' },
        { pos: 0.48, skin: 5, hair: '#1a1a1a', shirt: '#c0392b', type: 'short' },
        { pos: 0.56, skin: 1, hair: '#8b0000', shirt: '#1a4a7a', type: 'bald' },
        { pos: 0.63, skin: 2, hair: '#f4a460', shirt: '#0a6a5a', type: 'long' },
        { pos: 0.70, skin: 3, hair: '#1a1a1a', shirt: '#b86a08', type: 'short' },
        { pos: 0.77, skin: 4, hair: '#654321', shirt: '#5a5a5a', type: 'short' },
        { pos: 0.84, skin: 0, hair: '#daa520', shirt: '#8b0000', type: 'long' },
        { pos: 0.91, skin: 5, hair: '#1a1a1a', shirt: '#2c3e50', type: 'short' },
      ];

      for (let i = 0; i < fans.length; i++) {
        const f = fans[i];
        const fx = w * f.pos;
        const fy = barY + 4;
        // Subtle head bob synced to "music"
        const bob = Math.sin(time * 0.0018 + i * 1.9) * 1.2;
        const lean = Math.sin(time * 0.001 + i * 2.5) * 2;

        ctx.save();
        ctx.translate(fx + lean, fy);

        // Shadow on bar
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath(); ctx.ellipse(0, 0, 10, 3, 0, 0, Math.PI * 2); ctx.fill();

        // Torso
        ctx.fillStyle = f.shirt;
        ctx.fillRect(-8, -30, 16, 24);
        // Shoulder shape
        ctx.beginPath(); ctx.ellipse(0, -28, 11, 5, 0, Math.PI, 0); ctx.fill();

        // Neck
        ctx.fillStyle = skinTones[f.skin];
        ctx.fillRect(-2, -34, 4, 5);

        // Head
        ctx.beginPath();
        ctx.arc(0, -40 + bob, 8, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.arc(-8, -40 + bob, 2.5, 0, Math.PI * 2);
        ctx.arc(8, -40 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = f.hair;
        if (f.type === 'short') {
          ctx.beginPath(); ctx.arc(0, -42 + bob, 8, Math.PI, 0); ctx.fill();
          ctx.fillRect(-8, -44 + bob, 16, 4);
        } else if (f.type === 'long') {
          ctx.beginPath(); ctx.arc(0, -42 + bob, 8.5, Math.PI * 0.85, Math.PI * 0.15); ctx.fill();
          ctx.fillRect(-8, -44 + bob, 16, 4);
          // Hair draping down sides
          ctx.fillRect(-9, -42 + bob, 3, 10);
          ctx.fillRect(6, -42 + bob, 3, 10);
        }
        // bald = no hair drawn

        // Eyes (looking toward stage)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-3, -41 + bob, 1.8, 0, Math.PI * 2);
        ctx.arc(3, -41 + bob, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(-2.5, -41 + bob, 1, 0, Math.PI * 2);
        ctx.arc(3.5, -41 + bob, 1, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = skinTones[f.skin];
        ctx.beginPath(); ctx.arc(0, -38 + bob, 1.2, 0, Math.PI * 2); ctx.fill();

        // Mouth (slight smile)
        ctx.strokeStyle = 'rgba(60,20,10,0.5)'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(0, -36 + bob, 2.5, 0.1, Math.PI - 0.1);
        ctx.stroke();

        // Arms resting on bar
        ctx.fillStyle = f.shirt;
        ctx.fillRect(-12, -14, 5, 12);
        ctx.fillRect(7, -14, 5, 12);
        // Hands on bar
        ctx.fillStyle = skinTones[f.skin];
        ctx.beginPath();
        ctx.arc(-10, -3, 3, 0, Math.PI * 2);
        ctx.arc(10, -3, 3, 0, Math.PI * 2);
        ctx.fill();

        // Drinks (varied)
        if (i % 3 === 0) {
          // Whiskey glass
          ctx.fillStyle = 'rgba(160,100,20,0.5)';
          ctx.fillRect(12, -8, 5, 6);
          ctx.strokeStyle = 'rgba(200,200,200,0.3)'; ctx.lineWidth = 0.8;
          ctx.strokeRect(12, -8, 5, 6);
        } else if (i % 3 === 1) {
          // Wine glass
          ctx.strokeStyle = 'rgba(200,200,200,0.4)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-12, -4); ctx.lineTo(-12, -10); ctx.stroke();
          ctx.fillStyle = 'rgba(120,15,15,0.6)';
          ctx.beginPath();
          ctx.moveTo(-15, -10);
          ctx.quadraticCurveTo(-12, -18, -9, -10);
          ctx.closePath(); ctx.fill();
        } else {
          // Beer glass
          ctx.fillStyle = 'rgba(200,170,40,0.45)';
          ctx.fillRect(13, -10, 4, 8);
          // Foam
          ctx.fillStyle = 'rgba(255,255,240,0.5)';
          ctx.fillRect(13, -11, 4, 2);
        }

        ctx.restore();
      }

      // --- Candle glow on tables (fewer, simpler) ---
      for (let t = 0; t < 4; t++) {
        const tx = w * (0.15 + t * 0.2);
        const ty = barY + 16 + h * 0.1;
        // Candle warm glow (simple circle, no gradient per frame)
        ctx.fillStyle = `rgba(255,170,40,${0.12 + Math.sin(time * 0.003 + t * 2) * 0.04})`;
        ctx.beginPath(); ctx.arc(tx, ty - 8, 18, 0, Math.PI * 2); ctx.fill();
        // Candle stick
        ctx.fillStyle = '#ecdfa0';
        ctx.fillRect(tx - 1, ty - 8, 2, 6);
        // Flame
        ctx.fillStyle = `rgba(255,200,60,${0.8 + Math.sin(time * 0.005 + t) * 0.15})`;
        ctx.beginPath(); ctx.arc(tx, ty - 10, 2, 0, Math.PI * 2); ctx.fill();
      }

      // --- Bartender (behind bar, simple) ---
      const btx = w * 0.50, bty = barY;
      ctx.save(); ctx.translate(btx, bty);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-7, -35, 14, 26);
      // White shirt/apron
      ctx.fillStyle = 'rgba(230,225,215,0.75)';
      ctx.fillRect(-5, -16, 10, 14);
      // Bow tie
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-3, -22, 6, 3);
      // Head
      ctx.fillStyle = '#D2A679';
      ctx.beginPath(); ctx.arc(0, -42, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.arc(0, -44, 7, Math.PI, 0); ctx.fill();
      // Eyes
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.arc(-2, -42, 1, 0, Math.PI * 2); ctx.arc(3, -42, 1, 0, Math.PI * 2); ctx.fill();
      // Arm polishing
      const armS = Math.sin(time * 0.003) * 3;
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(7, -28); ctx.lineTo(14 + armS, -22); ctx.stroke();
      ctx.fillStyle = 'rgba(200,200,200,0.35)';
      ctx.fillRect(12 + armS, -26, 4, 7);
      ctx.restore();

      // --- "The best Show in Town!" wall sign ---
      ctx.save();
      const signX = w * 0.06, signY = h * 0.18, signW = 270, signH = 54;
      const woodG = ctx.createLinearGradient(signX, signY, signX, signY + signH);
      woodG.addColorStop(0, '#7a4a12'); woodG.addColorStop(1, '#4a2808');
      ctx.fillStyle = woodG;
      ctx.beginPath(); ctx.roundRect(signX, signY, signW, signH, 5); ctx.fill();
      // Wood grain lines
      ctx.strokeStyle = 'rgba(30,10,2,0.3)'; ctx.lineWidth = 1;
      for (let g = 0; g < 4; g++) {
        ctx.beginPath(); ctx.moveTo(signX, signY + 10 + g * 12); ctx.lineTo(signX + signW, signY + 10 + g * 12); ctx.stroke();
      }
      // Border
      ctx.strokeStyle = '#2a1204'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.roundRect(signX, signY, signW, signH, 5); ctx.stroke();
      // Inner border
      ctx.strokeStyle = 'rgba(200,140,40,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(signX + 5, signY + 5, signW - 10, signH - 10, 3); ctx.stroke();
      // Nails
      ctx.fillStyle = '#c8a040';
      for (const [nx, ny] of [[signX + 9, signY + 9], [signX + signW - 9, signY + 9], [signX + 9, signY + signH - 9], [signX + signW - 9, signY + signH - 9]] as [number, number][]) {
        ctx.beginPath(); ctx.arc(nx, ny, 3, 0, Math.PI * 2); ctx.fill();
      }
      // Text
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 6;
      ctx.fillStyle = '#ffe880';
      ctx.fillText('The best Show in Town!', signX + signW / 2, signY + 23);
      ctx.fillStyle = 'rgba(255,220,100,0.6)';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText('~ Live Jazz ~', signX + signW / 2, signY + 41);
      ctx.textAlign = 'left'; ctx.shadowBlur = 0;
      ctx.restore();

      // --- Subtle smoke haze (single fill, no gradient) ---
      ctx.fillStyle = 'rgba(18,8,4,0.12)';
      ctx.fillRect(0, 0, w, h * 0.5);

      // --- Floating music notes (fewer) ---
      const notes = ['♩', '♪', '♫', '♬'];
      ctx.font = '14px serif';
      for (let n = 0; n < 5; n++) {
        const nx = w * (0.15 + n * 0.15) + Math.sin(time * 0.0008 + n) * 12;
        const ny = h * 0.25 - ((time * 0.02 + n * 40) % 60);
        ctx.fillStyle = `rgba(255,200,50,${0.15 + Math.sin(time * 0.002 + n) * 0.1})`;
        ctx.fillText(notes[n % 4], nx, ny);
      }
    },
    platforms: (w, h) => [
      { x: w * 0.05, y: h * 0.8, width: w * 0.28, height: 20 },
      { x: w * 0.38, y: h * 0.8 - 65, width: w * 0.24, height: 20 },
      { x: w * 0.67, y: h * 0.8, width: w * 0.28, height: 20 },
    ],
    drawPlatforms: (ctx, platforms) => {
      for (const p of platforms) {
        const rg = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
        rg.addColorStop(0, '#3a1808'); rg.addColorStop(1, '#1e0c04');
        ctx.fillStyle = rg; ctx.fillRect(p.x, p.y, p.width, p.height);
        // Warm glowing top edge
        ctx.strokeStyle = 'rgba(220,100,20,0.55)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.width, p.y); ctx.stroke();
        // Wood seam lines
        ctx.strokeStyle = 'rgba(50,20,5,0.4)'; ctx.lineWidth = 1;
        for (let s = 1; s < 4; s++) {
          ctx.beginPath();
          ctx.moveTo(p.x + p.width * s / 4, p.y);
          ctx.lineTo(p.x + p.width * s / 4, p.y + p.height);
          ctx.stroke();
        }
      }

      // ── Stage monitor wedges (one per platform, drawn first so piano layers on top) ──
      for (const p of platforms) {
        const mx = p.x + p.width * 0.72;
        const my = p.y;
        // Wedge trapezoid: rear 18px tall, front 8px tall, 32px wide
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.moveTo(mx,      my - 18);  // rear top-left
        ctx.lineTo(mx + 32, my -  8);  // front top-right
        ctx.lineTo(mx + 32, my);       // front bottom-right
        ctx.lineTo(mx,      my);       // rear bottom-left
        ctx.closePath(); ctx.fill();
        // Grille cloth lines on angled face
        ctx.strokeStyle = 'rgba(80,80,80,0.5)'; ctx.lineWidth = 1;
        for (let g = 0; g < 3; g++) {
          const gy = my - 6 - g * 4;
          ctx.beginPath(); ctx.moveTo(mx + 2, gy); ctx.lineTo(mx + 30, gy + (18-8)*g/3 + 2); ctx.stroke();
        }
        // Speaker cone on face
        ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(mx + 18, my - 10, 6, 4, -0.3, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.ellipse(mx + 18, my - 10, 2, 1.5, -0.3, 0, Math.PI * 2); ctx.fill();
      }

      // --- Upright piano on the first (leftmost) platform ---
      const p0 = platforms[0];
      const pW = 90, pHt = 112;
      const pX = p0.x + 14;
      const pY = p0.y - pHt;

      ctx.save();

      // ── Lacquered black cabinet ──────────────────────────────────
      const lacquer = ctx.createLinearGradient(pX, pY, pX + pW, pY);
      lacquer.addColorStop(0,   '#1c1c1c');
      lacquer.addColorStop(0.08,'#2e2e2e');
      lacquer.addColorStop(0.5, '#111111');
      lacquer.addColorStop(0.92,'#2a2a2a');
      lacquer.addColorStop(1,   '#111111');
      ctx.fillStyle = lacquer;
      ctx.fillRect(pX, pY, pW, pHt);

      // Top cap (rounded)
      ctx.fillStyle = '#222';
      ctx.fillRect(pX, pY, pW, 5);

      // ── Music desk (upper panel) ─────────────────────────────────
      ctx.fillStyle = '#181818';
      ctx.fillRect(pX + 6, pY + 5, pW - 12, 22);
      // Sheet of music on desk
      ctx.fillStyle = '#ece8dc';
      ctx.fillRect(pX + 10, pY + 7, pW - 20, 18);
      // Staff lines
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 0.8;
      for (let l = 0; l < 5; l++) {
        ctx.beginPath(); ctx.moveTo(pX + 12, pY + 9 + l * 3); ctx.lineTo(pX + pW - 12, pY + 9 + l * 3); ctx.stroke();
      }
      // A few notes on the sheet
      ctx.fillStyle = '#222';
      ctx.font = '7px serif';
      for (const [nx, ny] of [[pX+14,pY+13],[pX+22,pY+11],[pX+30,pY+14],[pX+38,pY+12]] as [number,number][]) {
        ctx.beginPath(); ctx.ellipse(nx, ny, 2.5, 2, -0.4, 0, Math.PI*2); ctx.fill();
        ctx.fillRect(nx + 2, ny - 7, 1, 7);
      }

      // ── Upper case (between desk and keys) ──────────────────────
      ctx.fillStyle = '#151515';
      ctx.fillRect(pX + 4, pY + 27, pW - 8, 8);

      // ── Fallboard + keys area ────────────────────────────────────
      // Key slip (dark frame around keys)
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(pX + 4, pY + 35, pW - 8, 42);

      // White keys — 8 keys (one octave + C)
      const nWhite = 8;
      const kSlotW = (pW - 12) / nWhite;
      const kW = kSlotW - 1.5, kH = 36;
      const kStartX = pX + 6, kStartY = pY + 37;
      for (let k = 0; k < nWhite; k++) {
        const kx = kStartX + k * kSlotW;
        // Ivory gradient
        const ivg = ctx.createLinearGradient(kx, kStartY, kx + kW, kStartY);
        ivg.addColorStop(0, '#e8e4d8'); ivg.addColorStop(1, '#f5f2ec');
        ctx.fillStyle = ivg;
        ctx.fillRect(kx, kStartY, kW, kH);
        // Bottom rounded tip
        ctx.fillStyle = '#dedad0';
        ctx.fillRect(kx, kStartY + kH - 4, kW, 4);
        // Dividing line
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.8;
        ctx.strokeRect(kx, kStartY, kW, kH);
      }
      // Black keys — correct piano positions: after keys 0,1,3,4,5 (C#,D#,F#,G#,A#)
      const bkOffsets = [0, 1, 3, 4, 5];
      const bkW = kSlotW * 0.58, bkH = 22;
      for (const bo of bkOffsets) {
        const bkX = kStartX + bo * kSlotW + kSlotW - bkW / 2 - 0.5;
        const bkg = ctx.createLinearGradient(bkX, kStartY, bkX + bkW, kStartY);
        bkg.addColorStop(0, '#1a1a1a'); bkg.addColorStop(0.4,'#0a0a0a'); bkg.addColorStop(1,'#252525');
        ctx.fillStyle = bkg;
        ctx.fillRect(bkX, kStartY, bkW, bkH);
        // Shine on black key
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fillRect(bkX + 1, kStartY + 1, bkW - 2, 5);
      }

      // ── Lower panel (knee board) ────────────────────────────────
      ctx.fillStyle = '#141414';
      ctx.fillRect(pX + 4, pY + 77, pW - 8, 18);
      // Panel moulding line
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pX + 6, pY + 79); ctx.lineTo(pX + pW - 6, pY + 79); ctx.stroke();

      // ── Toe blocks / legs ────────────────────────────────────────
      ctx.fillStyle = '#181818';
      ctx.fillRect(pX,          pY + 95, 12, pHt - 95);
      ctx.fillRect(pX + pW - 12, pY + 95, 12, pHt - 95);
      // Leg taper highlight
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(pX + 1, pY + 96, 3, pHt - 97);
      ctx.fillRect(pX + pW - 4, pY + 96, 3, pHt - 97);

      // ── Pedal lyre ───────────────────────────────────────────────
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(pX + pW/2 - 14, pY + 95, 28, 12);
      // Three pedals (gold)
      const pedalG = ctx.createLinearGradient(0, pY + 97, 0, pY + 105);
      pedalG.addColorStop(0, '#c8a840'); pedalG.addColorStop(1, '#886010');
      ctx.fillStyle = pedalG;
      for (const px2 of [pX + pW/2 - 10, pX + pW/2 - 2, pX + pW/2 + 6] as number[]) {
        ctx.beginPath(); ctx.roundRect(px2, pY + 97, 6, 8, 2); ctx.fill();
      }

      // ── Piano bench ──────────────────────────────────────────────
      const bchX = pX - 8, bchY = p0.y - 22, bchW = 40, bchH = 8;
      // Seat cushion
      const cushG = ctx.createLinearGradient(bchX, bchY, bchX, bchY + bchH);
      cushG.addColorStop(0, '#2a1a0a'); cushG.addColorStop(1, '#160c04');
      ctx.fillStyle = cushG;
      ctx.beginPath(); ctx.roundRect(bchX, bchY, bchW, bchH, 3); ctx.fill();
      ctx.strokeStyle = 'rgba(120,60,10,0.4)'; ctx.lineWidth = 1;
      ctx.strokeRect(bchX + 2, bchY + 2, bchW - 4, bchH - 4);
      // Bench legs
      ctx.fillStyle = '#111';
      ctx.fillRect(bchX + 3,       bchY + bchH, 5, 14);
      ctx.fillRect(bchX + bchW - 8, bchY + bchH, 5, 14);

      ctx.restore();

      // ── Drum kit on right platform (platforms[2]) ────────────────
      {
        const p2 = platforms[2];
        const kx = p2.x + p2.width * 0.55;
        const ky = p2.y;
        ctx.save();
        // Bass drum (crimson shell, 38×30)
        const bdG = ctx.createLinearGradient(kx - 19, ky - 15, kx + 19, ky + 15);
        bdG.addColorStop(0, '#6a0000'); bdG.addColorStop(0.5, '#8b0000'); bdG.addColorStop(1, '#4a0000');
        ctx.fillStyle = bdG;
        ctx.beginPath(); ctx.ellipse(kx, ky - 15, 19, 15, 0, 0, Math.PI * 2); ctx.fill();
        // Resonant head ring
        ctx.strokeStyle = '#c0a030'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(kx, ky - 15, 19, 15, 0, 0, Math.PI * 2); ctx.stroke();
        // Bass drum legs
        ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(kx - 14, ky - 5); ctx.lineTo(kx - 18, ky); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kx + 14, ky - 5); ctx.lineTo(kx + 18, ky); ctx.stroke();
        // Tension rods (gold dots)
        ctx.fillStyle = '#c8a030';
        for (let r = 0; r < 8; r++) {
          const ra = (r / 8) * Math.PI * 2;
          ctx.beginPath(); ctx.arc(kx + Math.cos(ra) * 17, ky - 15 + Math.sin(ra) * 13, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        // Snare drum — chrome, 22×14, on stand at kx-30
        const sx = kx - 30, sy = ky - 28;
        ctx.fillStyle = '#b0b0b0';
        ctx.beginPath(); ctx.ellipse(sx, sy, 11, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#888'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(sx, sy, 11, 7, 0, 0, Math.PI * 2); ctx.stroke();
        // Snare strainer
        ctx.fillStyle = '#999'; ctx.fillRect(sx - 12, sy - 1, 24, 2);
        // Stand legs
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(sx - 5, sy + 7); ctx.lineTo(sx - 8, ky); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(sx + 5, sy + 7); ctx.lineTo(sx + 8, ky); ctx.stroke();

        // Hi-hat — two stacked gold cymbals on stand at kx-44
        const hx = kx - 44, hy = ky - 38;
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(hx, hy + 10); ctx.lineTo(hx, ky); ctx.stroke(); // pole
        ctx.beginPath(); ctx.moveTo(hx - 8, ky); ctx.lineTo(hx + 8, ky); ctx.stroke(); // base
        ctx.fillStyle = '#c8a030';
        ctx.beginPath(); ctx.ellipse(hx, hy,     13, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(hx, hy + 5, 13, 3, 0, 0, Math.PI * 2); ctx.fill();

        // Crash cymbal — tilted gold ellipse on stand at kx+22
        const crx = kx + 22, cry = ky - 52;
        ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(crx, cry + 14); ctx.lineTo(crx - 4, ky); ctx.stroke();
        ctx.save();
        ctx.translate(crx, cry);
        ctx.rotate(-0.3);
        ctx.fillStyle = '#b89020'; ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.ellipse(0, 0, 16, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();

        // Floor tom — dark red shell, three legs, at kx+32
        const ftx = kx + 32, fty = ky - 20;
        const ftG = ctx.createLinearGradient(ftx - 14, fty, ftx + 14, fty);
        ftG.addColorStop(0, '#5a0000'); ftG.addColorStop(0.5, '#7a0000'); ftG.addColorStop(1, '#3a0000');
        ctx.fillStyle = ftG;
        ctx.beginPath(); ctx.ellipse(ftx, fty, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#c0a030'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(ftx, fty, 14, 10, 0, 0, Math.PI * 2); ctx.stroke();
        // Three legs
        ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(ftx - 10, fty + 8); ctx.lineTo(ftx - 14, ky); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ftx,      fty + 10); ctx.lineTo(ftx,      ky); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ftx + 10, fty + 8);  ctx.lineTo(ftx + 14, ky); ctx.stroke();

        // Ride cymbal — gold ellipse at kx+38, ky-42
        const rx2 = kx + 38, ry2 = ky - 42;
        ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(rx2 - 2, ry2 + 12); ctx.lineTo(rx2 + 5, ky); ctx.stroke();
        ctx.save();
        ctx.translate(rx2, ry2);
        ctx.rotate(0.2);
        ctx.fillStyle = '#c8a030'; ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.ellipse(0, 0, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();

        ctx.restore();
      }

      // ── Trumpet on stand — center platform (platforms[1]) ────────
      {
        const p1 = platforms[1];
        const tx = p1.x + p1.width * 0.72;
        const ty = p1.y;
        ctx.save();
        // Folding tripod stand
        ctx.strokeStyle = '#777'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(tx, ty - 50); ctx.lineTo(tx, ty - 5); ctx.stroke(); // pole
        ctx.beginPath(); ctx.moveTo(tx - 8, ty - 5); ctx.lineTo(tx + 8, ty - 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx - 5, ty - 5); ctx.lineTo(tx - 12, ty); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx + 5, ty - 5); ctx.lineTo(tx + 12, ty); ctx.stroke();
        // Cradle arms at top
        ctx.beginPath(); ctx.moveTo(tx - 10, ty - 50); ctx.lineTo(tx - 4, ty - 46); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx + 10, ty - 50); ctx.lineTo(tx + 4, ty - 46); ctx.stroke();

        // Trumpet resting in cradle (brass body)
        ctx.save();
        ctx.translate(tx, ty - 47);
        ctx.rotate(-0.15);
        // Main tube body
        const trG = ctx.createLinearGradient(-22, -4, 22, 4);
        trG.addColorStop(0, '#a07020'); trG.addColorStop(0.5, '#d4a830'); trG.addColorStop(1, '#a07020');
        ctx.fillStyle = trG;
        ctx.fillRect(-22, -4, 44, 8);
        // Bell flare (bezier)
        ctx.fillStyle = '#c8a030';
        ctx.beginPath();
        ctx.moveTo(20, -4);
        ctx.bezierCurveTo(26, -4, 32, -8, 36, -12);
        ctx.bezierCurveTo(38, -14, 38, -10, 36, -8);
        ctx.bezierCurveTo(32, -4, 26,  0, 20,  4);
        ctx.closePath(); ctx.fill();
        // 3 valve casings (dome tops)
        ctx.fillStyle = '#b89020';
        for (let v = 0; v < 3; v++) {
          ctx.beginPath(); ctx.roundRect(-8 + v * 6, -8, 5, 14, 2); ctx.fill();
          // Dome cap
          ctx.fillStyle = '#d4a830';
          ctx.beginPath(); ctx.ellipse(-6 + v * 6, -8, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#b89020';
        }
        // Tuning slide U-bend
        ctx.strokeStyle = '#c8a030'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(-18, 0, 6, -Math.PI/2, Math.PI/2); ctx.stroke();
        // Mouthpiece
        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath(); ctx.roundRect(-28, -2, 8, 4, 1); ctx.fill();
        ctx.restore();
        ctx.restore();
      }

      // ── Microphone on stand — left platform, right of piano ──────
      {
        const p0 = platforms[0];
        const micX = p0.x + 118;
        const micY = p0.y;
        ctx.save();
        // Weighted base
        ctx.fillStyle = '#555';
        ctx.beginPath(); ctx.ellipse(micX, micY - 3, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
        // Vertical pole
        ctx.strokeStyle = '#777'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(micX, micY - 3); ctx.lineTo(micX, micY - 68); ctx.stroke();
        // Boom arm (angled)
        ctx.beginPath(); ctx.moveTo(micX, micY - 58); ctx.lineTo(micX + 28, micY - 72); ctx.stroke();
        // Boom counterweight
        ctx.fillStyle = '#555';
        ctx.beginPath(); ctx.roundRect(micX - 2, micY - 62, 5, 10, 2); ctx.fill();

        // Bullet-style dynamic mic capsule at boom tip
        const bx = micX + 28, by = micY - 72;
        // Satin black body
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath(); ctx.roundRect(bx - 4, by - 14, 8, 18, 3); ctx.fill();
        // Wire mesh grill dots
        ctx.fillStyle = 'rgba(120,120,120,0.6)';
        for (let gx = -2; gx <= 2; gx += 2) {
          for (let gy = 0; gy >= -10; gy -= 3) {
            ctx.beginPath(); ctx.arc(bx + gx, by + gy, 0.8, 0, Math.PI * 2); ctx.fill();
          }
        }
        // Dome top
        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath(); ctx.ellipse(bx, by - 14, 4, 5, 0, 0, Math.PI, Math.PI * 2); ctx.fill();
        // Clip / attachment
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(bx, by + 6, 5, 0, Math.PI); ctx.stroke();
        ctx.restore();
      }

    },
    memories: (w, h) => [
      { x: w * 0.50, y: h * 0.8 - 65 - 62, type: 'future',   videoSrc: '/EldadTamirFuturePerforming.mp4', description: 'A future performance — the show must go on' },
    ],
    drawMemory: (ctx, mem, time) => {
      const mx = mem.x;
      const my = mem.y;
      const pulse = Math.sin(time * 0.002) * 3;
      ctx.save();

      if (mem.type === 'future') {
        // ── FUTURE MEMORY — glowing picture frame on the wall ────
        const fp  = Math.sin(time * 0.0022);
        const gs  = 0.55 + fp * 0.35;   // glow strength
        const fw  = 80;                  // frame content width
        const fh  = 58;                  // frame content height
        const brd = 8;                   // border thickness
        ctx.translate(mx, my);

        // Wide soft halo behind frame
        for (let r = 4; r >= 1; r--) {
          ctx.fillStyle = `rgba(255,190,40,${0.025 * r * gs})`;
          ctx.beginPath();
          ctx.roundRect(-(fw / 2 + brd + r * 7), -(fh / 2 + brd + r * 7),
                         fw + brd * 2 + r * 14, fh + brd * 2 + r * 14, 4);
          ctx.fill();
        }

        // Outer frame (golden gradient, ornate)
        const fgOuter = ctx.createLinearGradient(-fw / 2 - brd, -fh / 2 - brd, fw / 2 + brd, fh / 2 + brd);
        fgOuter.addColorStop(0,   '#f0c840');
        fgOuter.addColorStop(0.3, '#c8900c');
        fgOuter.addColorStop(0.6, '#f8d850');
        fgOuter.addColorStop(1,   '#a06808');
        ctx.fillStyle = fgOuter;
        ctx.beginPath();
        ctx.roundRect(-fw / 2 - brd, -fh / 2 - brd, fw + brd * 2, fh + brd * 2, 4);
        ctx.fill();

        // Frame glow stroke (pulsing)
        ctx.save();
        ctx.shadowColor = '#ffd040';
        ctx.shadowBlur   = 16 + fp * 12;
        ctx.strokeStyle  = `rgba(255,210,60,${gs})`;
        ctx.lineWidth    = 2.5;
        ctx.beginPath();
        ctx.roundRect(-fw / 2 - brd, -fh / 2 - brd, fw + brd * 2, fh + brd * 2, 4);
        ctx.stroke();
        ctx.restore();

        // Inner bevel (darker gold)
        ctx.fillStyle = '#7a4c04';
        ctx.beginPath();
        ctx.roundRect(-fw / 2 - 3, -fh / 2 - 3, fw + 6, fh + 6, 2);
        ctx.fill();

        // Canvas / image area
        ctx.fillStyle = '#080610';
        ctx.fillRect(-fw / 2, -fh / 2, fw, fh);

        // Stage spotlight glow inside image
        const stageG = ctx.createRadialGradient(0, fh * 0.15, 0, 0, fh * 0.15, fw * 0.55);
        stageG.addColorStop(0,   `rgba(255,160,50,${0.22 + fp * 0.08})`);
        stageG.addColorStop(0.5, `rgba(120,40,160,0.12)`);
        stageG.addColorStop(1,   'transparent');
        ctx.fillStyle = stageG;
        ctx.fillRect(-fw / 2, -fh / 2, fw, fh);

        // Stage floor line
        ctx.strokeStyle = `rgba(255,150,30,${0.35 + fp * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-fw / 2 + 6, fh / 2 - 10);
        ctx.lineTo(fw / 2 - 6,  fh / 2 - 10);
        ctx.stroke();

        // ── Performer silhouettes ─────────────────────────────────
        const silh = 'rgba(12,5,2,0.92)';

        // Performer 1 — keyboard/piano player (left)
        const p1x = -20, p1y = fh / 2 - 10;
        ctx.fillStyle = silh;
        ctx.beginPath(); ctx.ellipse(p1x, p1y - 26, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(p1x - 4, p1y - 20, 8, 12);   // body
        // Arms forward (playing keys)
        ctx.strokeStyle = silh; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p1x - 4, p1y - 17); ctx.lineTo(p1x - 12, p1y - 11); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p1x + 4, p1y - 17); ctx.lineTo(p1x + 12, p1y - 11); ctx.stroke();

        // Performer 2 — trombone player (right)
        const p2x = 20, p2y = fh / 2 - 10;
        ctx.fillStyle = silh;
        ctx.beginPath(); ctx.ellipse(p2x, p2y - 26, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(p2x - 4, p2y - 20, 8, 12);   // body
        // Trombone
        ctx.strokeStyle = silh; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p2x, p2y - 18); ctx.lineTo(p2x + 18, p2y - 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p2x + 18, p2y - 12); ctx.lineTo(p2x + 18, p2y - 6); ctx.stroke();

        // Pulsing sparkle stars around frame
        ctx.fillStyle = `rgba(255,220,80,${0.5 + fp * 0.5})`;
        for (let s = 0; s < 5; s++) {
          const sa = (s / 5) * Math.PI * 2 + time * 0.0008;
          const sr = fw * 0.55 + Math.sin(time * 0.003 + s) * 5;
          ctx.beginPath();
          ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * (fh * 0.45), 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Corner rosettes on frame
        ctx.fillStyle = `rgba(255,220,60,${0.7 + fp * 0.3})`;
        for (const [cx2, cy2] of [
          [-fw / 2 - brd, -fh / 2 - brd],
          [ fw / 2 + brd, -fh / 2 - brd],
          [-fw / 2 - brd,  fh / 2 + brd],
          [ fw / 2 + brd,  fh / 2 + brd],
        ] as [number, number][]) {
          ctx.beginPath(); ctx.arc(cx2, cy2, 4.5, 0, Math.PI * 2); ctx.fill();
        }

      } else {
        // ── TROMBONE ─────────────────────────────────────────────
        ctx.translate(mx, my + pulse);
        ctx.shadowColor = '#e8a030'; ctx.shadowBlur = 20 + pulse;
        ctx.rotate(-0.18);
        ctx.fillStyle = '#c07808'; ctx.fillRect(-5, -38, 10, 62);
        ctx.fillStyle = '#d48a10'; ctx.fillRect(-2, -10, 5, 38);
        ctx.fillStyle = '#a06008'; ctx.fillRect(-12, -18, 24, 4);
        ctx.fillStyle = '#a06008'; ctx.fillRect(-12, 2, 24, 4);
        ctx.fillStyle = '#c07808';
        ctx.beginPath();
        ctx.moveTo(-5, -38);
        ctx.bezierCurveTo(-20, -50, -26, -42, -20, -35);
        ctx.bezierCurveTo(-14, -28, -5, -32, -5, -38);
        ctx.fill();
        ctx.strokeStyle = '#e8b030'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(-16, -38, 8, 5, -0.4, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#e0a828'; ctx.fillRect(-4, 22, 8, 7);
        ctx.beginPath(); ctx.ellipse(0, 30, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#884808'; ctx.beginPath(); ctx.arc(4, 8, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,200,80,0.45)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-1, -36); ctx.lineTo(-1, 20); ctx.stroke();
      }

      ctx.restore();
    },
  }; })(),

  jazz: {
    name: '🌍🎷 Jazz Nights Around the World',
    playerStart: (w, h) => ({ x: 50, y: h * 0.85 }),
    background: (ctx, w, h, time) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0F2027');
      grad.addColorStop(0.5, '#203A43');
      grad.addColorStop(1, '#2C5364');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (let i = 0; i < 150; i++) {
        const sx = (i * 131) % w;
        const sy = (i * 73) % h;
        const twinkle = Math.sin(time * 0.002 + i) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
      }

      // Ground
      ctx.fillStyle = '#1A1A2E';
      ctx.fillRect(0, h * 0.8, w, h * 0.2);

      // Purple spotlight orbs
      for (let i = 0; i < 3; i++) {
        const ox = w * (0.3 + i * 0.2);
        const oy = h * 0.4;
        const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, 100 - i * 20);
        orbGrad.addColorStop(0, `rgba(128, 0, 255, ${0.15 - i * 0.03})`);
        orbGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(ox, oy, 100 - i * 20, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    platforms: (w, h) => [
      { x: w * 0.05, y: h * 0.8, width: w * 0.2, height: 20 },
      { x: w * 0.3, y: h * 0.65, width: w * 0.2, height: 20 },
      { x: w * 0.55, y: h * 0.5, width: w * 0.2, height: 20 },
      { x: w * 0.75, y: h * 0.35, width: w * 0.2, height: 20 },
    ],
    memory: (w, h) => ({ x: w * 0.82, y: h * 0.35 - 70, type: 'portal', description: 'Jazz nights echoing across the world' }),
    drawMemory: (ctx, mem, time) => {
      const pulse = Math.sin(time * 0.003) * 5;
      // Portal rings
      for (let i = 5; i > 0; i--) {
        ctx.strokeStyle = `rgba(128, 0, 255, ${0.2 + i * 0.1})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(mem.x, mem.y, 15 + i * 6 + pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Orbiting stars
      for (let i = 0; i < 5; i++) {
        const angle = time * 0.002 + (i * Math.PI * 2) / 5;
        const orbitR = 35 + pulse;
        const sx = mem.x + Math.cos(angle) * orbitR;
        const sy = mem.y + Math.sin(angle) * orbitR;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
};
