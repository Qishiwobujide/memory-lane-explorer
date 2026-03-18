import { Scene } from './types';
import { isEditorActive, editorPins, sceneExtras, getEditorImage, setHidden as _setHidden } from './editorState';
void _setHidden; // imported for side-effect typing only

// Pre-load the Naked Castle logo (used in castle scene background)
const _ncLogo = new Image();
_ncLogo.src = '/NakedCastleLogo.png';

// Castle.png — baked-in castle image for the Naked Castle scene
const _castlePng = new Image();
_castlePng.src = '/Castle.png';

// Pre-load the Naked Stable logo (used above the hilltop chalets)
const _nsLogo = new Image();
_nsLogo.src = '/NakedStableLogo.png';

// Snowboard scene — snow sprite images
const _snowGirl1 = new Image(); _snowGirl1.src = '/girl1_Idle.png';
const _snowGirl2 = new Image(); _snowGirl2.src = '/girl2_walk.png';
const _snowGirl3 = new Image(); _snowGirl3.src = '/girl3_Protection.png';

// Castle scene — tree sprites
const castleTreeImgs: HTMLImageElement[] = [
  'birch_3', 'birch_4', 'birch_5',
  'fir_tree_1', 'fir_tree_2', 'fir_tree_3', 'fir_tree_4',
].map(name => {
  const img = new Image();
  img.src = `/Trees/${name}.png`;
  return img;
});

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

      // ── Shared helper: floating memory description label ─────────
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

      // ── HAKOBA SKI RESORT sign (drawn after slope so it sits on top of snow) ──
      const signX = w * 0.06, signY = h * 0.26;
      // Posts planted in the snow
      ctx.fillStyle = '#5c3d1a';
      ctx.fillRect(signX,       signY, 12, 55);
      ctx.fillRect(signX + 126, signY, 12, 55);
      // Board (162 wide × 60 tall)
      ctx.fillStyle = '#7b4f2e';
      ctx.beginPath(); ctx.roundRect(signX - 8, signY - 56, 162, 60, 7); ctx.fill();
      ctx.strokeStyle = '#3a1f08'; ctx.lineWidth = 2.5;
      ctx.strokeRect(signX - 8, signY - 56, 162, 60);
      // Inner border accent
      ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 1;
      ctx.strokeRect(signX - 2, signY - 50, 150, 48);
      // "HAKOBA" — large
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HAKOBA', signX + 73, signY - 25);
      // "SKI RESORT" — medium below
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = 'rgba(255,235,120,0.95)';
      ctx.fillText('❄  SKI RESORT  ❄', signX + 73, signY - 7);
      ctx.textAlign = 'left';
    

      // ── YAACOV OUGIYA HOTEL ─────────────────────────────────────
      const hx = w * 0.78, hy = h * 0.72;
      const hW = 130, hH = 100;
      // Snow around base
      ctx.fillStyle = 'rgba(220,240,255,0.5)';
      ctx.beginPath(); ctx.ellipse(hx + hW/2, hy + hH + 6, 85, 14, 0, 0, Math.PI*2); ctx.fill();
      // Building body
      ctx.fillStyle = '#c8b8a0';
      ctx.fillRect(hx, hy, hW, hH);
      // Horizontal floor lines
      ctx.strokeStyle = '#a09080'; ctx.lineWidth = 1;
      for (let f = 1; f < 3; f++) {
        ctx.beginPath(); ctx.moveTo(hx, hy + f * (hH/3)); ctx.lineTo(hx + hW, hy + f * (hH/3)); ctx.stroke();
      }
      // Flat roof + snow cap
      ctx.fillStyle = '#6a5040';
      ctx.fillRect(hx - 4, hy - 9, hW + 8, 11);
      ctx.fillStyle = 'rgba(225,242,255,0.88)';
      ctx.fillRect(hx - 4, hy - 12, hW + 8, 6);
      // Windows — 3 per floor, 3 floors (larger)
      ctx.fillStyle = 'rgba(255,220,130,0.85)';
      for (let f = 0; f < 3; f++) {
        const wy = hy + 8 + f * (hH / 3);
        for (const wx of [hx + 10, hx + 42, hx + 78]) {
          ctx.fillRect(wx, wy, 22, 16);
          ctx.strokeStyle = '#888'; ctx.lineWidth = 0.8; ctx.strokeRect(wx, wy, 22, 16);
          ctx.beginPath();
          ctx.moveTo(wx + 11, wy); ctx.lineTo(wx + 11, wy + 16);
          ctx.moveTo(wx, wy + 8);  ctx.lineTo(wx + 22, wy + 8);
          ctx.stroke();
        }
      }
      // Front door
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(hx + hW/2 - 11, hy + hH - 28, 22, 28);
      ctx.beginPath(); ctx.arc(hx + hW/2, hy + hH - 28, 11, Math.PI, 0); ctx.fill();
      // Sign above door
      ctx.fillStyle = '#4a2e12';
      ctx.fillRect(hx + 4, hy - 34, hW - 8, 22);
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('YAACOV OUGIYA', hx + hW/2, hy - 21);
      ctx.font = '8px monospace';
      ctx.fillText('HOTEL  ★', hx + hW/2, hy - 10);
      ctx.textAlign = 'left';
      // Title label above building
      drawMemoryLabel(hx + hW/2, hy - 82, '🏨', 'Yaacov Ougiya Hotel', '');

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

      // ── HOT CHOCO STALL ─────────────────────────────────────────
      const kcx = w * 0.37, kcy = h * 0.62;
      // Snow pad
      ctx.fillStyle = 'rgba(220,240,255,0.55)';
      ctx.beginPath(); ctx.ellipse(kcx + 35, kcy + 56, 56, 12, 0, 0, Math.PI*2); ctx.fill();
      // Stall body (2× bigger: 70×50)
      ctx.fillStyle = '#8a5a2a';
      ctx.fillRect(kcx, kcy, 70, 50);
      // Wood planks
      ctx.strokeStyle = '#5c3518'; ctx.lineWidth = 1.5;
      for (let pl = 0; pl < 4; pl++) {
        ctx.beginPath(); ctx.moveTo(kcx, kcy + 10 + pl * 11); ctx.lineTo(kcx + 70, kcy + 10 + pl * 11); ctx.stroke();
      }
      // Pointed roof
      ctx.fillStyle = '#3a1f08';
      ctx.beginPath();
      ctx.moveTo(kcx - 8,  kcy);
      ctx.lineTo(kcx + 35, kcy - 38);
      ctx.lineTo(kcx + 78, kcy);
      ctx.fill();
      // Snow on roof
      ctx.fillStyle = 'rgba(225,242,255,0.90)';
      ctx.beginPath();
      ctx.moveTo(kcx - 8,  kcy); ctx.lineTo(kcx + 35, kcy - 38); ctx.lineTo(kcx + 78, kcy);
      ctx.lineTo(kcx + 78, kcy - 7); ctx.lineTo(kcx + 35, kcy - 45); ctx.lineTo(kcx - 8, kcy - 7);
      ctx.fill();
      // Serving counter shelf
      ctx.fillStyle = '#5c3518';
      ctx.fillRect(kcx - 4, kcy + 24, 78, 6);
      // Serving window (warm glow, bigger)
      ctx.fillStyle = 'rgba(255,200,80,0.78)';
      ctx.fillRect(kcx + 10, kcy + 4, 50, 22);
      ctx.strokeStyle = '#3a1f08'; ctx.lineWidth = 1.5; ctx.strokeRect(kcx + 10, kcy + 4, 50, 22);
      // Banner sign above window
      ctx.fillStyle = '#cc6600';
      ctx.fillRect(kcx + 4, kcy - 12, 62, 14);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HOT CHOCO ☕', kcx + 35, kcy - 2);
      ctx.textAlign = 'left';
      // Steam puffs (animated)
      for (let s = 0; s < 3; s++) {
        const puffY = kcy - 8 - s * 14 - (time * 0.018 + s * 6) % 30;
        ctx.fillStyle = `rgba(255,255,255,${0.4 - s * 0.1})`;
        ctx.beginPath();
        ctx.arc(kcx + 25 + s * 12 + Math.sin(time * 0.002 + s) * 4, puffY, 6 + s * 1.5, 0, Math.PI*2);
        ctx.fill();
      }
      // Title label above stall
      drawMemoryLabel(kcx + 35, kcy - 72, '☕', 'Hot Choco Stop', '');

      // ── 6 FRIENDS ON THE SLOPE ──────────────────────────────────
      const skierStartX = cx + 80;
      const skierEndX   = w * 0.87;
      const skierRange  = skierEndX - skierStartX;

      // Helper: draw name badge above a skier
      const drawNameBadge = (bx: number, by: number, name: string, isPro: boolean) => {
        ctx.font = `bold 13px monospace`;
        const label = isPro ? `⭐ ${name}` : name;
        const bw = ctx.measureText(label).width + 16;
        ctx.fillStyle = isPro ? 'rgba(30,15,0,0.88)' : 'rgba(10,20,40,0.82)';
        ctx.beginPath(); ctx.roundRect(bx - bw / 2, by - 18, bw, 20, 5); ctx.fill();
        ctx.strokeStyle = isPro ? 'rgba(255,215,0,0.7)' : 'rgba(160,200,255,0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(bx - bw / 2, by - 18, bw, 20, 5); ctx.stroke();
        ctx.fillStyle = isPro ? '#FFD700' : '#ffffff';
        ctx.font = `bold 13px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(label, bx, by - 3);
        ctx.textAlign = 'left';
      };

      // 2 pros (Aner, Amir) + 2 wobbly beginners (May, Jenny)
      const allFriends = [
        { speed: 18, phaseOffset: 0,                 jacket: '#2980b9', hat: '#1a5276', pro: true,  name: 'Aner',  jumpOffset: 0     },
        { speed: 13, phaseOffset: skierRange * 0.45,  jacket: '#8e44ad', hat: '#6c3483', pro: true,  name: 'Amir',  jumpOffset: 2500  },
        { speed: 9,  phaseOffset: skierRange * 0.20,  jacket: '#e67e22', hat: '#d35400', pro: false, name: 'May',   jumpOffset: 0 },
        { speed: 11, phaseOffset: skierRange * 0.65,  jacket: '#27ae60', hat: '#1e8449', pro: false, name: 'Jenny', jumpOffset: 0 },
        { speed: 8,  phaseOffset: skierRange * 0.10,  jacket: '#e74c3c', hat: '#c0392b', pro: false, name: 'Erell', jumpOffset: 0 },
        { speed: 10, phaseOffset: skierRange * 0.55,  jacket: '#16a085', hat: '#0e6655', pro: false, name: 'Eldad', jumpOffset: 0 },
      ];

      for (const sk of allFriends) {
        const x = skierStartX + (time * sk.speed / 1000 + sk.phaseOffset) % skierRange;
        const progress = (x - skierStartX) / skierRange;
        const baseY = cy + 20 + progress * h * 0.04;
        const wobbleX = sk.pro ? 0 : Math.sin(time * 0.006 + sk.phaseOffset) * 9;
        const bobY = baseY + Math.sin(time * 0.004 + sk.phaseOffset) * 2;
        const rx = x + wobbleX;

        // Pro jump/flip cycle: one backflip every 5 s
        const jumpCycle = 5000;
        const jumpT = sk.pro ? ((time + sk.jumpOffset) % jumpCycle) / jumpCycle : 1;
        const isJumping = sk.pro && jumpT < 0.28;
        const jumpHeight = isJumping ? Math.sin((jumpT / 0.28) * Math.PI) * 60 : 0;
        const flipAngle  = isJumping ? (jumpT / 0.28) * Math.PI * 2 : 0;
        const drawY = bobY - jumpHeight;

        ctx.save();

        // Shadow on ground (stays at ground level)
        const shadowScale = isJumping ? Math.max(0.3, 1 - jumpHeight / 60) : 1;
        ctx.fillStyle = `rgba(0,0,0,${0.12 * shadowScale})`;
        ctx.beginPath();
        ctx.ellipse(rx, bobY + 20, 26 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        if (isJumping) {
          // Draw entire flipping skier as a rotated group
          ctx.translate(rx, drawY - 10);
          ctx.rotate(flipAngle);
          // Skis
          ctx.fillStyle = '#c0392b';
          ctx.fillRect(-26, 25, 22, 4);
          ctx.fillRect(4,   25, 22, 4);
          // Legs
          ctx.fillStyle = '#2c3e50';
          ctx.fillRect(-9, 8, 7, 18);
          ctx.fillRect(2,  8, 7, 18);
          // Body
          ctx.fillStyle = sk.jacket;
          ctx.fillRect(-11, -20, 22, 28);
          // Head
          ctx.fillStyle = '#FFDAB9';
          ctx.beginPath(); ctx.arc(0, -28, 11, 0, Math.PI * 2); ctx.fill();
          // Hat
          ctx.fillStyle = sk.hat;
          ctx.beginPath(); ctx.arc(0, -33, 11, Math.PI, 0); ctx.fill();
          ctx.fillRect(-11, -37, 22, 7);
          // Arms spread wide during flip
          ctx.fillStyle = sk.jacket;
          ctx.fillRect(-26, -16, 15, 7);
          ctx.fillRect( 11, -16, 15, 7);
          ctx.restore();
          // "FLIP!" spark label while airborne
          ctx.save();
          ctx.fillStyle = '#FFD700';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('FLIP! 🤸', rx, drawY - 60);
          ctx.textAlign = 'left';
          ctx.restore();
        } else {
          // Normal skiing pose
          // Skis
          ctx.fillStyle = '#c0392b';
          ctx.fillRect(rx - 26, drawY + 15, 22, 4);
          ctx.fillRect(rx + 4,  drawY + 15, 22, 4);
          // Legs
          ctx.fillStyle = '#2c3e50';
          ctx.fillRect(rx - 9,  drawY - 2, 7, 18);
          ctx.fillRect(rx + 2,  drawY - 2, 7, 18);
          // Body
          ctx.fillStyle = sk.jacket;
          ctx.fillRect(rx - 11, drawY - 30, 22, 28);
          // Head
          ctx.fillStyle = '#FFDAB9';
          ctx.beginPath(); ctx.arc(rx, drawY - 38, 11, 0, Math.PI * 2); ctx.fill();
          // Hat
          ctx.fillStyle = sk.hat;
          ctx.beginPath(); ctx.arc(rx, drawY - 43, 11, Math.PI, 0); ctx.fill();
          ctx.fillRect(rx - 11, drawY - 47, 22, 7);
          if (sk.pro) {
            // Ski poles
            ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(rx - 13, drawY - 22); ctx.lineTo(rx - 22, drawY + 12);
            ctx.moveTo(rx + 13, drawY - 22); ctx.lineTo(rx + 22, drawY + 12);
            ctx.stroke();
            ctx.fillStyle = '#7f8c8d';
            ctx.beginPath();
            ctx.arc(rx - 22, drawY + 12, 3, 0, Math.PI * 2);
            ctx.arc(rx + 22, drawY + 12, 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Beginner: flailing arms
            const flail = Math.sin(time * 0.009 + sk.phaseOffset) * 12;
            ctx.fillStyle = sk.jacket;
            ctx.save();
            ctx.translate(rx - 11, drawY - 18);
            ctx.rotate((-0.8 - flail * 0.05) * (Math.PI / 180) * 14);
            ctx.fillRect(-4, -12, 7, 20);
            ctx.restore();
            ctx.save();
            ctx.translate(rx + 11, drawY - 18);
            ctx.rotate((0.8 + flail * 0.05) * (Math.PI / 180) * 14);
            ctx.fillRect(-3, -12, 7, 20);
            ctx.restore();
          }
          ctx.restore();
        }

        // Name badge (always visible, above the figure)
        drawNameBadge(rx, drawY - 52, sk.name, sk.pro);
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

      // ── SNOW SPRITES (editor pins) ──────────────────────────────────────
      const epSnow = (id: string, img: HTMLImageElement, defXFrac: number, defYFrac: number, defWFrac: number, defHFrac: number) => {
        const pin = editorPins[id];
        if (pin?.hidden) return;
        const x  = w * (pin?.xFrac ?? defXFrac);
        const y  = h * (pin?.yFrac ?? defYFrac);
        const dw = h * (pin?.wFrac ?? defWFrac);
        const dh = h * (pin?.hFrac ?? defHFrac);
        if (img.complete && img.naturalWidth > 0) ctx.drawImage(img, x, y, dw, dh);
      };
      epSnow('snow_girl1', _snowGirl1, 0.40, 0.40, 0.08, 0.14);
      epSnow('snow_girl2', _snowGirl2, 0.55, 0.55, 0.08, 0.14);
      epSnow('snow_girl3', _snowGirl3, 0.25, 0.60, 0.08, 0.14);

      // ── EXTRA OBJECTS (editor-added from library) ──────────────────────
      for (const obj of sceneExtras("japan")) {
        if (!obj.src || !(obj.wFrac > 0) || !(obj.hFrac > 0)) continue;
        const img = getEditorImage(obj.src);
        if (img.complete && img.naturalWidth > 0)
          ctx.drawImage(img, w * obj.xFrac, h * obj.yFrac, h * obj.wFrac, h * obj.hFrac);
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
      // Editor pin helper — always reads from saved pin so positions persist after editor closes
      const epTree = (id: string, defX: number, defY: number, defW: number, defH: number) => {
        const pin = editorPins[id];
        return {
          hidden: pin?.hidden ?? false,
          x:  pin ? w * pin.xFrac : defX,
          y:  pin ? h * pin.yFrac : defY,
          dw: (pin?.wFrac != null) ? h * pin.wFrac : defW,
          dh: (pin?.hFrac != null) ? h * pin.hFrac : defH,
        };
      };

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
      // -------------------------------------------------------
      const _cpBldg = epTree('castle_bldg', w * 0.38, h * 0.16, w * 0.40, h * 0.30);
      const bx = _cpBldg.x;   // left edge of castle complex
      const by = _cpBldg.y;   // top of tallest element

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

      // ---- CASTLE.PNG IMAGE ----
      {
        const p = epTree('castle_png', w * 0.389, h * 0.173, h * 0.200, h * 0.200);
        if (!p.hidden && _castlePng.complete && _castlePng.naturalWidth > 0) {
          ctx.drawImage(_castlePng, p.x, p.y, p.dw, p.dh);
        }
      }

      // ---- NAKED CASTLE LOGO (circle-clipped, same style as Naked Stable Logo) ----
      {
        const p = epTree('nc_logo', w * 0.433, h * 0.075, h * 0.118, h * 0.118);
        // Always draw at baked position if hidden; use pin position when editor un-hides it
        const ncLogoX = p.hidden ? w * 0.433 + h * 0.059 : p.x + p.dw / 2;
        const ncLogoY = p.hidden ? h * 0.075 + h * 0.059 : p.y + p.dh / 2;
        const ncLogoR = p.hidden ? h * 0.059 : p.dw / 2;
        // Glow ring
        ctx.save();
        ctx.shadowColor = 'rgba(255,255,255,0.5)';
        ctx.shadowBlur = 18;
        ctx.strokeStyle = 'rgba(255,255,255,0.0)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ncLogoX, ncLogoY, ncLogoR, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
        // Circle-clipped logo
        ctx.save();
        if (_ncLogo.complete && _ncLogo.naturalWidth > 0) {
          const iw = _ncLogo.naturalWidth;
          const ih = _ncLogo.naturalHeight;
          const scale = (ncLogoR * 2) / (iw * 0.76);
          const dw = iw * scale;
          const dh = ih * scale;
          const dx = ncLogoX - iw * 0.50 * scale;
          const dy = ncLogoY - ih * 0.47 * scale;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.beginPath();
          ctx.arc(ncLogoX, ncLogoY, ncLogoR, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(_ncLogo, dx, dy, dw, dh);
        }
        ctx.restore();
      }

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

      // ---- PNG TREE FOREST ----
      // [id, xFrac, yFrac, wFrac, hFrac] — top-left position, size in h-fractions
      let _tIdx = 0;
      const drawPngTree = (id: string, xf: number, yf: number, wf: number, hf: number) => {
        const img = castleTreeImgs[_tIdx++ % castleTreeImgs.length];
        if (!img.complete || img.naturalWidth === 0) return;
        const p = epTree(id, xf * w, yf * h, wf * h, hf * h);
        if (p.hidden) return;
        ctx.drawImage(img, p.x, p.y, p.dw, p.dh);
      };

      // Left forest bank
      const leftTrees: [string, number, number, number, number][] = [
        ['ct_l0', 0.263, 0.063, 0.132, 0.240],
        ['ct_l1', 0.289, 0.460, 0.150, 0.272],
        ['ct_l2', 0.510, 0.102, 0.123, 0.224],
        ['ct_l3', 0.439, 0.404, 0.132, 0.240],
        ['ct_l4', 0.227, 0.306, 0.114, 0.208],
        ['ct_l5', 0.016, 0.435, 0.123, 0.224],
        ['ct_l6', 0.523, 0.441, 0.106, 0.192],
      ];
      for (const [id, xf, yf, wf, hf] of leftTrees) drawPngTree(id, xf, yf, wf, hf);

      // Right forest bank
      const rightTrees: [string, number, number, number, number][] = [
        ['ct_r0', 0.065, 0.174, 0.141, 0.256],
        ['ct_r1', 0.923, 0.466, 0.090, 0.163],
        ['ct_r2', 0.561, 0.643, 0.106, 0.192],
        ['ct_r3', 0.715, 0.177, 0.114, 0.208],
        ['ct_r4', 0.774, 0.455, 0.100, 0.181],
        ['ct_r5', 0.297, 0.465, 0.097, 0.176],
      ];
      for (const [id, xf, yf, wf, hf] of rightTrees) drawPngTree(id, xf, yf, wf, hf);

      // Trees behind/around the castle base
      const behindTrees: [string, number, number, number, number][] = [
        ['ct_b0', 0.533, 0.224, 0.079, 0.144],
        ['ct_b1', 0.832, 0.310, 0.088, 0.160],
        ['ct_b2', 0.604, 0.502, 0.075, 0.136],
      ];
      for (const [id, xf, yf, wf, hf] of behindTrees) drawPngTree(id, xf, yf, wf, hf);

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

      // ── EXTRA OBJECTS (editor-added from library) ──────────────────────
      for (const obj of sceneExtras("castle")) {
        if (!obj.src || !(obj.wFrac > 0) || !(obj.hFrac > 0)) continue;
        const img = getEditorImage(obj.src);
        if (img.complete && img.naturalWidth > 0)
          ctx.drawImage(img, w * obj.xFrac, h * obj.yFrac, h * obj.wFrac, h * obj.hFrac);
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
    memories: (w, h) => {
      const mep = (id: string, xf: number, yf: number) => {
        const pin = editorPins[id];
        if (pin) return { x: w * pin.xFrac, y: h * pin.yFrac };
        return { x: w * xf, y: h * yf };
      };
      return [
        { ...mep('mem_chalet',  0.68,  0.66),  type: 'chalet',  videoSrc: '/SuiteRoomTour.mp4', description: 'A cozy wooden retreat tucked in the bamboo hills' },
        { ...mep('mem_mg',      0.52,  0.775), type: 'mg',      videoSrc: '/EldadMGCar.mp4', description: 'The one and only MG Sports Car' },
        { ...mep('mem_castle',  0.48,  0.26),  type: 'castle',  videoSrc: '/NakedCastle.mp4', description: 'Naked Castle — Moganshan\'s crown jewel since 1910' },
      ];
    },
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

    // Bar patron sprites
    const girlSprites = [
      { img: new Image(), frames: 9,  src: '/girl1_Idle.png' },
      { img: new Image(), frames: 12, src: '/girl2_walk.png' },
      { img: new Image(), frames: 3,  src: '/girl3_Protection.png' },
    ];
    girlSprites.forEach(s => { s.img.src = s.src; });

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

      // ── Upgraded velvet curtains (18% wide, lush crimson with folds & gold trim) ──
      for (let side = 0; side < 2; side++) {
        const cx0 = side === 0 ? 0 : w * 0.82;
        const curtW = w * 0.18;
        const cGrad = c.createLinearGradient(cx0, 0, cx0 + curtW, 0);
        if (side === 0) {
          cGrad.addColorStop(0,   '#4a0808');
          cGrad.addColorStop(0.5, '#3a0606');
          cGrad.addColorStop(1,   'transparent');
        } else {
          cGrad.addColorStop(0,   'transparent');
          cGrad.addColorStop(0.5, '#3a0606');
          cGrad.addColorStop(1,   '#4a0808');
        }
        c.fillStyle = cGrad;
        c.fillRect(cx0, 0, curtW, h);
        // Multiple vertical fold shadows
        const folds = 6;
        for (let f = 0; f < folds; f++) {
          const fx = cx0 + (f + 0.5) * (curtW / folds);
          c.strokeStyle = 'rgba(20,0,0,0.45)'; c.lineWidth = 2;
          c.beginPath();
          c.moveTo(fx, 0);
          c.quadraticCurveTo(fx + 5, h * 0.4, fx - 3, h * 0.7);
          c.quadraticCurveTo(fx + 4, h * 0.85, fx, h);
          c.stroke();
          // Light fold highlight
          c.strokeStyle = 'rgba(120,20,20,0.15)'; c.lineWidth = 1;
          c.beginPath();
          c.moveTo(fx + 3, 0);
          c.quadraticCurveTo(fx + 7, h * 0.4, fx, h * 0.75);
          c.stroke();
        }
        // Gold trim edge (inner)
        const trimX = side === 0 ? w * 0.18 - 1 : w * 0.82 + 1;
        c.strokeStyle = 'rgba(200,160,40,0.7)'; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(trimX, 0); c.lineTo(trimX, h); c.stroke();
        // Gold tassel fringe at bottom hem
        c.strokeStyle = 'rgba(200,160,40,0.65)'; c.lineWidth = 1.5;
        c.fillStyle = 'rgba(200,160,40,0.65)';
        const tassels = 10;
        for (let t = 0; t < tassels; t++) {
          const tx = cx0 + (t + 0.5) * (curtW / tassels);
          const tLen = 10 + Math.sin(t * 2.1) * 4;
          c.beginPath(); c.moveTo(tx, h - 30); c.lineTo(tx, h - 30 + tLen); c.stroke();
          c.beginPath(); c.arc(tx, h - 30 + tLen, 2.5, 0, Math.PI * 2); c.fill();
        }
      }

      // ── Proscenium arch (art-deco golden, ~60% width) ─────────────
      {
        const archCx = w * 0.5;
        const archR  = w * 0.30;
        const archBaseY = h * 0.73;
        // Warm amber fill
        const archFill = c.createRadialGradient(archCx, archBaseY, archR * 0.1, archCx, archBaseY, archR);
        archFill.addColorStop(0, 'rgba(200,100,20,0.06)');
        archFill.addColorStop(1, 'transparent');
        c.fillStyle = archFill;
        c.beginPath();
        c.moveTo(archCx - archR, archBaseY);
        c.arc(archCx, archBaseY, archR, Math.PI, 0);
        c.lineTo(archCx + archR, archBaseY);
        c.closePath();
        c.fill();
        // Outer arch ring
        c.strokeStyle = 'rgba(200,160,40,0.55)'; c.lineWidth = 6;
        c.beginPath(); c.arc(archCx, archBaseY, archR, Math.PI, 0); c.stroke();
        // Inner arch ring
        c.strokeStyle = 'rgba(220,180,60,0.4)'; c.lineWidth = 3;
        c.beginPath(); c.arc(archCx, archBaseY, archR - 10, Math.PI, 0); c.stroke();
        // Keystone at apex
        const kx = archCx, ky = archBaseY - archR;
        c.fillStyle = 'rgba(200,160,40,0.7)';
        c.beginPath();
        c.moveTo(kx - 12, ky + 10); c.lineTo(kx + 12, ky + 10);
        c.lineTo(kx + 8,  ky - 8);  c.lineTo(kx - 8,  ky - 8); c.closePath(); c.fill();
        // Corner rosettes
        for (const [rx, ry] of [[archCx - archR, archBaseY - 6], [archCx + archR, archBaseY - 6]] as [number,number][]) {
          c.fillStyle = 'rgba(200,160,40,0.6)';
          c.beginPath(); c.arc(rx, ry, 8, 0, Math.PI * 2); c.fill();
          c.strokeStyle = 'rgba(240,200,80,0.4)'; c.lineWidth = 1.5;
          for (let r = 0; r < 6; r++) {
            const ra = r * Math.PI / 3;
            c.beginPath();
            c.moveTo(rx + Math.cos(ra) * 5, ry + Math.sin(ra) * 5);
            c.lineTo(rx + Math.cos(ra) * 11, ry + Math.sin(ra) * 11);
            c.stroke();
          }
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

      // ── Disco ball sphere (static; animated reflections in background()) ──
      {
        const dbx = w * 0.5, dby = h * 0.07, dbr = Math.min(w, h) * 0.04;
        // Suspension wire
        c.strokeStyle = 'rgba(150,150,150,0.6)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(dbx, 0); c.lineTo(dbx, dby - dbr); c.stroke();
        // Silver sphere
        const dbG = c.createRadialGradient(dbx - dbr * 0.3, dby - dbr * 0.3, 0, dbx, dby, dbr);
        dbG.addColorStop(0, '#ffffff');
        dbG.addColorStop(0.3, '#c0c8d0');
        dbG.addColorStop(0.7, '#606870');
        dbG.addColorStop(1, '#202428');
        c.fillStyle = dbG;
        c.beginPath(); c.arc(dbx, dby, dbr, 0, Math.PI * 2); c.fill();
        // Mirror tile grid
        c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 0.5;
        for (let tRow = -4; tRow <= 4; tRow++) {
          for (let tCol = -4; tCol <= 4; tCol++) {
            const tx = dbx + tCol * dbr * 0.35;
            const ty = dby + tRow * dbr * 0.35;
            if (Math.sqrt((tx - dbx) ** 2 + (ty - dby) ** 2) < dbr * 0.9) {
              c.strokeRect(tx - dbr * 0.15, ty - dbr * 0.15, dbr * 0.3, dbr * 0.3);
            }
          }
        }
        // Specular highlight
        c.fillStyle = 'rgba(255,255,255,0.7)';
        c.beginPath(); c.arc(dbx - dbr * 0.3, dby - dbr * 0.3, dbr * 0.15, 0, Math.PI * 2); c.fill();
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

      // ── Overhead pendant lights above bar (Edison-style) ─────────
      {
        const pendPositions = [w * 0.25, w * 0.50, w * 0.75];
        for (const px of pendPositions) {
          const pendY = barY - 72, wireTopY = barY - 112;
          // Wire
          c.strokeStyle = 'rgba(100,80,50,0.7)'; c.lineWidth = 1;
          c.beginPath(); c.moveTo(px, wireTopY); c.lineTo(px, pendY + 8); c.stroke();
          // Bulb housing
          c.fillStyle = '#2a1a08';
          c.beginPath(); c.arc(px, pendY, 7, 0, Math.PI * 2); c.fill();
          // Warm glow filament
          c.fillStyle = 'rgba(255,200,80,0.85)';
          c.beginPath(); c.arc(px, pendY, 4.5, 0, Math.PI * 2); c.fill();
          // Ambient halo
          const pG = c.createRadialGradient(px, pendY, 0, px, pendY, 38);
          pG.addColorStop(0, 'rgba(255,180,60,0.22)');
          pG.addColorStop(1, 'transparent');
          c.fillStyle = pG; c.fillRect(px - 38, pendY - 38, 76, 76);
        }
      }

      // ── Bar neon signs ─────────────────────────────────────────────
      {
        c.save();
        c.font = 'bold 10px "Press Start 2P", monospace';
        c.shadowColor = '#00ff88'; c.shadowBlur = 10;
        c.fillStyle = 'rgba(0,255,120,0.85)';
        c.fillText('OPEN', w * 0.04, barY - 18);
        c.shadowColor = '#ff4488'; c.shadowBlur = 10;
        c.fillStyle = 'rgba(255,60,120,0.85)';
        c.fillText('BAR', w * 0.84, barY - 18);
        c.restore();
      }

      // ── LED Backdrop Wall (behind poster area) ───────────────────
      {
        const ledX = w * 0.12, ledY = h * 0.04;
        const ledW = w * 0.76, ledH = h * 0.44;
        const cols = 8, rows = 5;
        const cW = ledW / cols, cH = ledH / rows;
        const ledPalette = [
          '#6600cc','#0044ff','#cc00aa','#aa0066',
          '#4400bb','#0066ff','#dd0099','#770055',
          '#9900ee','#2244ff','#bb0088','#550044',
          '#8800dd','#1155ff','#cc0077','#440055',
          '#aa00ff','#3366ff','#bb0066','#330044',
        ];
        for (let r = 0; r < rows; r++) {
          for (let cl = 0; cl < cols; cl++) {
            const ci = (r * cols + cl) % ledPalette.length;
            c.fillStyle = ledPalette[ci];
            c.globalAlpha = 0.55;
            c.fillRect(ledX + cl * cW + 1, ledY + r * cH + 1, cW - 2, cH - 2);
            // Reflective glint on each tile
            c.fillStyle = 'rgba(255,255,255,0.12)';
            c.fillRect(ledX + cl * cW + 2, ledY + r * cH + 2, (cW - 4) * 0.45, (cH - 4) * 0.35);
            c.globalAlpha = 1;
          }
        }
      }

      // JazzClub poster on back wall
      const pw = Math.min(w * 0.42, 480);
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

    // Pre-computed disco ball reflection dots (created once at IIFE scope)
    const discoDots = Array.from({ length: 36 }, (_, i) => ({
      angle:    (i / 36) * Math.PI * 2,
      radius:   0.15 + ((i * 0.137) % 0.7),
      speed:    0.00025 + (i % 7) * 0.00006,
      colorIdx: i % 4,
      size:     1.5 + (i % 4) * 0.8,
    }));
    const discoDotColors = ['255,255,255', '120,180,255', '40,230,230', '255,100,240'];

    return {
    name: '🎺 Eldad & Tamir Live',
    playerStart: (w, h) => ({ x: 50, y: h * 0.7 }),
    playerPhysics: {
      jumpPower: 16,
      gravity: 0.85,
    },
    background: (ctx, w, h, time) => {
      // Draw cached static background
      const bg = buildStatic(w, h);
      ctx.drawImage(bg, 0, 0);

      // --- Beat pulse (120 BPM bass-drum bloom) ---
      const beatPhase = (time % 500) / 500;
      const beat = Math.pow(Math.sin(beatPhase * Math.PI), 6);
      if (beat > 0.01) {
        const beatGrad = ctx.createRadialGradient(w * 0.5, h * 0.73, 0, w * 0.5, h * 0.73, w * 0.45);
        beatGrad.addColorStop(0, `rgba(255,140,30,${beat * 0.28})`);
        beatGrad.addColorStop(1, 'rgba(255,140,30,0)');
        ctx.fillStyle = beatGrad;
        ctx.fillRect(0, h * 0.5, w, h * 0.5);
      }

      const barY = h * 0.56;

      // --- Disco ball reflections (G) ---
      {
        const dbx = w * 0.5, dby = h * 0.07;
        for (const dot of discoDots) {
          const angle = dot.angle + time * dot.speed;
          const sceneR = dot.radius * w * 0.44;
          const dx = dbx + Math.cos(angle) * sceneR;
          const dy = dby + 20 + Math.abs(Math.sin(angle * 0.5)) * sceneR * 0.5;
          const op = 0.3 + Math.abs(Math.sin(angle * 2.5 + time * 0.0008)) * 0.45;
          if (dy < 0 || dy > h || dx < 0 || dx > w) continue;
          ctx.fillStyle = `rgba(${discoDotColors[dot.colorIdx]},${op})`;
          ctx.beginPath(); ctx.arc(dx, dy, dot.size, 0, Math.PI * 2); ctx.fill();
        }
      }

      // --- Spotlight beams (sweeping) ---
      const beamDefs = [
        { anchor: 0.30, range: 0.10, freq: 0.0007, phase: 0.0 },
        { anchor: 0.50, range: 0.08, freq: 0.0005, phase: 1.8 },
        { anchor: 0.70, range: 0.10, freq: 0.0009, phase: 3.5 },
      ];
      for (const bd of beamDefs) {
        const cx = w * (bd.anchor + bd.range * Math.sin(time * bd.freq + bd.phase));
        const fl = 0.85 + Math.sin(time * 0.0012 + bd.anchor * 7) * 0.06;
        ctx.save();
        ctx.globalAlpha = fl * 0.35;
        const beam = ctx.createLinearGradient(cx, 0, cx, h * 0.75);
        beam.addColorStop(0, 'rgba(255,170,50,0.6)');
        beam.addColorStop(1, 'transparent');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(cx - 8, 0);
        ctx.lineTo(cx - h * 0.22, h * 0.75);
        ctx.lineTo(cx + h * 0.22, h * 0.75);
        ctx.lineTo(cx + 8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // --- Extra moving-head beams from sides (H) ---
      {
        const extraBeams = [
          { anchorX: w * 0.04, freq: 0.0011, phase: 0.5 },
          { anchorX: w * 0.96, freq: 0.0008, phase: 2.2 },
        ];
        for (const eb of extraBeams) {
          const targetX = w * 0.5 + Math.sin(time * eb.freq + eb.phase) * w * 0.28;
          ctx.save();
          ctx.globalAlpha = 0.25;
          ctx.strokeStyle = 'rgba(255,180,80,0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(eb.anchorX, h * 0.04);
          ctx.lineTo(targetX, h * 0.75);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.restore();
        }
      }

      // --- Lens flares when beams sweep near center (I) ---
      {
        const beamDefsForFlare = [
          { anchor: 0.30, range: 0.10, freq: 0.0007, phase: 0.0 },
          { anchor: 0.50, range: 0.08, freq: 0.0005, phase: 1.8 },
          { anchor: 0.70, range: 0.10, freq: 0.0009, phase: 3.5 },
        ];
        for (const bd of beamDefsForFlare) {
          const bx = w * (bd.anchor + bd.range * Math.sin(time * bd.freq + bd.phase));
          const dist = Math.abs(bx - w * 0.5) / (w * 0.5);
          if (dist < 0.3) {
            const flareOp = (0.3 - dist) / 0.3 * 0.55;
            ctx.save();
            ctx.globalAlpha = flareOp;
            ctx.strokeStyle = '#ffe080';
            ctx.lineWidth = 1;
            ctx.translate(bx, h * 0.04);
            for (let l = 0; l < 6; l++) {
              const la = l * Math.PI / 3;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(Math.cos(la) * 16, Math.sin(la) * 16);
              ctx.stroke();
            }
            ctx.fillStyle = 'rgba(255,240,180,0.6)';
            ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          }
        }
      }

      // --- Stage fog puffs drifting at floor level (J) ---
      {
        for (let f = 0; f < 2; f++) {
          const speed = f === 0 ? 0.009 : 0.006;
          const fogCx = ((time * speed + f * w * 0.6) % (w * 1.6)) - w * 0.3;
          const fogY  = h * 0.70;
          const fogG  = ctx.createRadialGradient(fogCx, fogY, 0, fogCx, fogY, w * 0.32);
          fogG.addColorStop(0, 'rgba(180,120,60,0.07)');
          fogG.addColorStop(1, 'transparent');
          ctx.fillStyle = fogG;
          ctx.fillRect(0, fogY - h * 0.06, w, h * 0.12);
        }
      }

      // --- Atmospheric dust motes (K) ---
      for (let m = 0; m < 20; m++) {
        const mx = w * (0.05 + (m * 0.047) % 0.9) + Math.sin(time * 0.0004 + m * 2.1) * 9;
        const my = h * (0.10 + (m * 0.043) % 0.65) + Math.sin(time * 0.0003 + m * 1.7) * 6;
        const mop = 0.08 + Math.abs(Math.sin(time * 0.0005 + m * 3)) * 0.06;
        ctx.fillStyle = `rgba(255,255,255,${mop})`;
        ctx.beginPath(); ctx.arc(mx, my, 1.5, 0, Math.PI * 2); ctx.fill();
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

      // --- Crowd at the bar — dancing & cheering girls ---
      const patronPositions = [
        0.06, 0.12, 0.19, 0.26, 0.33, 0.40, 0.48,
        0.56, 0.63, 0.70, 0.77, 0.84, 0.91,
      ];
      const patronSprite  = [0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 2, 0, 1];
      // Every other girl faces right (mirrored) for variety
      const patronFlip    = [1,-1, 1, 1,-1, 1,-1, 1, 1,-1, 1,-1, 1];

      for (let i = 0; i < patronPositions.length; i++) {
        const fx   = w * patronPositions[i];
        const phase = i * 1.9;

        // Gentle dance bob
        const bounce = Math.sin(time * 0.0022 + phase) * h * 0.012;
        // Slight sway
        const sway  = Math.sin(time * 0.0016 + phase) * 2;
        // Subtle rock
        const rock  = Math.sin(time * 0.002 + phase) * 0.04;

        const sp = girlSprites[patronSprite[i]];
        if (!sp.img.complete || sp.img.naturalWidth === 0) continue;

        const frameW   = sp.img.naturalWidth / sp.frames;
        const frameH   = sp.img.naturalHeight;
        const sprH     = h * 0.14;
        const sprW     = sprH * (frameW / frameH);
        const fps      = 120;
        const frameIdx = Math.floor(time / fps) % sp.frames;

        ctx.save();
        ctx.translate(fx + sway, barY + bounce);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.beginPath();
        ctx.ellipse(0, 2, sprW * 0.3, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.rotate(rock);
        ctx.scale(patronFlip[i], 1);
        ctx.drawImage(sp.img, frameIdx * frameW, 0, frameW, frameH, -sprW / 2, -sprH, sprW, sprH);

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

      // --- Animated band musicians ---
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Spotlight floor halos
      const drawHalo = (cx: number, cy: number) => {
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
        halo.addColorStop(0, 'rgba(255,160,40,0.18)');
        halo.addColorStop(1, 'rgba(255,140,30,0)');
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.ellipse(cx, cy, 55, 18, 0, 0, Math.PI * 2); ctx.fill();
      };

      // ── KEYBOARD PLAYER (left platform, seated) ─────────────────
      {
        const figX = w * 0.17;
        const figY = h * 0.8;           // local y=0 = platform surface; stool feet touch here
        drawHalo(figX, figY);
        ctx.save();
        ctx.translate(figX, figY);
        ctx.scale(2, 2);

        const lH = Math.sin(time * 0.004) * 4;
        const rH = Math.sin(time * 0.004 + Math.PI) * 4;

        // Stool
        ctx.fillStyle = '#3a1a08';
        ctx.fillRect(-8, -20, 16, 3);
        ctx.fillRect(-7, -17, 3, 17);
        ctx.fillRect(4,  -17, 3, 17);

        // Shoes
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.ellipse(-4, 0, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(5,  0, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

        // Trousers
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath(); ctx.roundRect(-7, -20, 5, 20, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(2,  -20, 5, 20, 2); ctx.fill();

        // Jacket
        ctx.fillStyle = '#121218';
        ctx.beginPath(); ctx.roundRect(-9, -48, 18, 30, 3); ctx.fill();

        // Shirt / lapels
        ctx.fillStyle = '#e8dfc8';
        ctx.beginPath();
        ctx.moveTo(-2, -48); ctx.lineTo(-2, -38); ctx.lineTo(0, -36);
        ctx.lineTo(2, -38); ctx.lineTo(2, -48); ctx.fill();

        // Bow tie
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(-3, -44); ctx.lineTo(0, -42); ctx.lineTo(3, -44);
        ctx.lineTo(3, -40); ctx.lineTo(0, -42); ctx.lineTo(-3, -40);
        ctx.closePath(); ctx.fill();

        // Neck
        ctx.fillStyle = '#c68642';
        ctx.fillRect(-2, -52, 4, 5);

        // Head
        ctx.beginPath(); ctx.arc(0, -59, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a0a04';
        ctx.beginPath(); ctx.arc(0, -61, 8, Math.PI, 0); ctx.fill();
        ctx.fillRect(-8, -63, 16, 4);

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-3, -59, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(3,  -59, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(-2.5, -59, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(3.5,  -59, 0.8, 0, Math.PI * 2); ctx.fill();

        // Arms to keys
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#121218';
        ctx.beginPath(); ctx.moveTo(-8, -44); ctx.quadraticCurveTo(-16, -32, -20, -22 + lH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(8,  -44); ctx.quadraticCurveTo(16,  -32,  20, -22 + rH); ctx.stroke();
        // Hands
        ctx.fillStyle = '#c68642';
        ctx.beginPath(); ctx.arc(-20, -22 + lH, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc( 20, -22 + rH, 3, 0, Math.PI * 2); ctx.fill();

        // Keyboard body
        ctx.fillStyle = '#1a0a04';
        ctx.beginPath(); ctx.roundRect(-24, -24, 48, 6, 1); ctx.fill();
        // White keys
        ctx.fillStyle = '#f0ead8';
        for (let k = 0; k < 7; k++) ctx.fillRect(-22 + k * 6 + 0.5, -23, 5, 4);
        // Black keys
        ctx.fillStyle = '#0a0a0a';
        for (const bk of [1, 2, 4, 5, 6]) ctx.fillRect(-22 + bk * 6 - 1.5, -23, 3, 2.5);

        ctx.restore();
      }

      // ── TRUMPET PLAYER (centre raised platform) ─────────────────
      {
        const figX = w * 0.50;
        const figY = h * 0.8 - 81;      // shoes (local y=8) land on platform at h*0.8-65
        const sway = Math.sin(time * 0.0013) * 3;
        drawHalo(figX, h * 0.8 - 65);
        ctx.save();
        ctx.translate(figX + sway, figY);
        ctx.scale(2, 2);

        const lean = Math.sin(time * 0.0022) * 2;

        // Shoes
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.ellipse(-3, 8, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(5,  8, 6, 3, 0, 0, Math.PI * 2); ctx.fill();

        // Trousers
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath(); ctx.roundRect(-6, -14, 6, 22, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(1,  -14, 6, 22, 2); ctx.fill();

        // Jacket
        ctx.fillStyle = '#0f0f18';
        ctx.beginPath(); ctx.roundRect(-9, -44, 18, 30, 3); ctx.fill();

        // Shirt / lapels
        ctx.fillStyle = '#e8dfc8';
        ctx.beginPath();
        ctx.moveTo(-2, -44); ctx.lineTo(-2, -32);
        ctx.lineTo(0, -30); ctx.lineTo(2, -32); ctx.lineTo(2, -44); ctx.fill();

        // Gold bow tie
        ctx.fillStyle = '#c0a020';
        ctx.beginPath();
        ctx.moveTo(-3, -40); ctx.lineTo(0, -38); ctx.lineTo(3, -40);
        ctx.lineTo(3, -36); ctx.lineTo(0, -38); ctx.lineTo(-3, -36);
        ctx.closePath(); ctx.fill();

        // Neck
        ctx.fillStyle = '#D2A679';
        ctx.fillRect(-2, -48, 4, 5);

        // Head
        ctx.beginPath(); ctx.arc(0, -55, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a0a04';
        ctx.beginPath(); ctx.arc(0, -57, 8, Math.PI, 0); ctx.fill();
        ctx.fillRect(-8, -59, 16, 4);

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-3, -55, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(3,  -55, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(-2.5, -55, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(3.5,  -55, 0.8, 0, Math.PI * 2); ctx.fill();

        // Left arm (down, relaxed)
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#0f0f18';
        ctx.beginPath(); ctx.moveTo(-8, -40); ctx.quadraticCurveTo(-15, -26, -13, -16); ctx.stroke();
        ctx.fillStyle = '#D2A679';
        ctx.beginPath(); ctx.arc(-13, -16, 3, 0, Math.PI * 2); ctx.fill();

        // Right arm raised, holding trumpet
        ctx.save();
        ctx.translate(8, -38);
        ctx.rotate(-0.7 + lean * 0.02);
        ctx.strokeStyle = '#0f0f18'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(13, -7); ctx.stroke();
        ctx.translate(13, -7); ctx.rotate(0.2);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(11, -3); ctx.stroke();

        // Trumpet
        ctx.save(); ctx.translate(11, -3);
        // Valves
        ctx.fillStyle = '#d4a820';
        ctx.beginPath(); ctx.roundRect(0,  -11, 5, 7, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(6,  -11, 5, 7, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(12, -11, 5, 7, 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,240,150,0.3)';
        ctx.fillRect(1, -11, 2, 3); ctx.fillRect(7, -11, 2, 3); ctx.fillRect(13, -11, 2, 3);
        // Tubes
        ctx.strokeStyle = '#c8980c'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-4, -7); ctx.lineTo(18, -7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-4, 0);  ctx.lineTo(18, 0);  ctx.stroke();
        // Mouthpiece
        ctx.fillStyle = '#b08010';
        ctx.beginPath(); ctx.roundRect(-8, -5, 5, 3, 1); ctx.fill();
        // Bell
        ctx.fillStyle = '#c8980c';
        ctx.beginPath();
        ctx.moveTo(18, -9);
        ctx.quadraticCurveTo(26, -9, 30, -14);
        ctx.lineTo(30, 7);
        ctx.quadraticCurveTo(26, 4, 18, 2);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,240,150,0.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(19, -7); ctx.lineTo(28, -11); ctx.stroke();
        ctx.restore(); // trumpet

        // Hand
        ctx.fillStyle = '#D2A679';
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore(); // arm
        ctx.restore(); // trumpet player
      }

      // ── DRUMMER (right platform, seated) ────────────────────────
      {
        const figX = w * 0.74;
        const figY = h * 0.8;             // feet at local y=0 = platform surface
        drawHalo(figX, figY);
        ctx.save();
        ctx.translate(figX, figY);
        ctx.scale(2, 2);

        const rAng = -0.3 + Math.sin(time * 0.006) * 0.45;
        const lAng = -0.3 + Math.sin(time * 0.006 + Math.PI / 2) * 0.45;

        // ── Drum kit (drawn first, behind figure) ──
        // Hi-hat stand
        ctx.strokeStyle = 'rgba(100,80,40,0.7)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-22, -10); ctx.lineTo(-20, 0); ctx.stroke();
        // Hi-hat cymbals
        ctx.fillStyle = 'rgba(200,160,50,0.65)';
        ctx.beginPath(); ctx.ellipse(-22, -24, 12, 4, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(180,140,40,0.45)';
        ctx.beginPath(); ctx.ellipse(-22, -22, 12, 4, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(140,110,30,0.6)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.ellipse(-22, -24, 12, 4, -0.15, 0, Math.PI * 2); ctx.stroke();
        // Snare drum
        ctx.fillStyle = 'rgba(160,130,70,0.7)';
        ctx.beginPath(); ctx.ellipse(0, -16, 13, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(100,80,40,0.8)';
        ctx.fillRect(-13, -20, 26, 4);
        ctx.strokeStyle = 'rgba(180,150,60,0.6)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(0, -16, 13, 4.5, 0, 0, Math.PI * 2); ctx.stroke();
        // Lug bolts
        ctx.fillStyle = 'rgba(200,170,80,0.6)';
        for (let b = 0; b < 6; b++) {
          ctx.beginPath();
          ctx.arc(Math.cos(b * Math.PI / 3) * 13, -16 + Math.sin(b * Math.PI / 3) * 4.5, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        // Crash cymbal (right)
        ctx.strokeStyle = 'rgba(100,80,40,0.6)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(22, -14); ctx.lineTo(20, 0); ctx.stroke();
        ctx.fillStyle = 'rgba(200,160,50,0.55)';
        ctx.beginPath(); ctx.ellipse(22, -28, 12, 3.5, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(140,110,30,0.5)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.ellipse(22, -28, 12, 3.5, 0.2, 0, Math.PI * 2); ctx.stroke();
        // Kick drum
        ctx.fillStyle = 'rgba(60,40,20,0.6)';
        ctx.beginPath(); ctx.ellipse(6, -4, 14, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(100,70,30,0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(6, -4, 14, 6, 0, 0, Math.PI * 2); ctx.stroke();

        // ── Drummer body ──
        // Stool
        ctx.fillStyle = '#2a1204';
        ctx.fillRect(-6, -20, 12, 3);
        ctx.fillRect(-5, -17, 3, 17);
        ctx.fillRect(2,  -17, 3, 17);

        // Shoes
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.ellipse(-3, 0, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(5,  0, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

        // Jeans
        ctx.fillStyle = '#2a3a5a';
        ctx.beginPath(); ctx.roundRect(-7, -20, 5, 20, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(2,  -20, 5, 20, 2); ctx.fill();

        // Torso (t-shirt, leaning forward)
        ctx.save();
        ctx.translate(0, -34); ctx.rotate(0.18);
        ctx.fillStyle = '#2a1a4a';
        ctx.beginPath(); ctx.roundRect(-8, -16, 16, 20, 3); ctx.fill();
        ctx.fillStyle = '#3a2a5a';
        ctx.beginPath(); ctx.arc(0, -16, 5, Math.PI, 0); ctx.fill();
        ctx.restore();

        // Neck
        ctx.fillStyle = '#8D5524';
        ctx.save(); ctx.translate(0, -34); ctx.rotate(0.1);
        ctx.fillRect(-2, -18, 4, 5); ctx.restore();

        // Head
        ctx.fillStyle = '#8D5524';
        ctx.beginPath(); ctx.arc(1, -54, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0a0604';
        ctx.beginPath(); ctx.arc(1, -56, 8, Math.PI, 0); ctx.fill();
        ctx.fillRect(-7, -58, 16, 4);
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-2, -54, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(4,  -54, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(-1.5, -54, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(4.5,  -54, 0.8, 0, Math.PI * 2); ctx.fill();

        // Right arm + stick
        ctx.save();
        ctx.translate(8, -46); ctx.rotate(rAng);
        ctx.strokeStyle = '#2a1a4a'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16, 10); ctx.stroke();
        ctx.fillStyle = '#8D5524';
        ctx.beginPath(); ctx.arc(16, 10, 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d4b060'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(18, 11); ctx.lineTo(34, 20); ctx.stroke();
        ctx.restore();

        // Left arm + stick
        ctx.save();
        ctx.translate(-8, -46); ctx.rotate(-lAng);
        ctx.strokeStyle = '#2a1a4a'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, 10); ctx.stroke();
        ctx.fillStyle = '#8D5524';
        ctx.beginPath(); ctx.arc(-16, 10, 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d4b060'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-18, 11); ctx.lineTo(-34, 20); ctx.stroke();
        ctx.restore();

        ctx.restore(); // drummer
      }

      ctx.restore(); // musicians group

      // --- Animated EQ bars on left wall (M) ---
      {
        const eqX  = w * 0.03;
        const eqY  = h * 0.38;
        const eqTotalW = w * 0.11;
        const barW = eqTotalW / 16 * 0.78;
        const maxH = 40, minH = 4;
        const eqFreqs  = [0.003,0.004,0.005,0.0035,0.0045,0.006,0.0025,0.0055,
                          0.003,0.004,0.005,0.0035,0.0045,0.006,0.0025,0.0055];
        const eqPhases = [0,0.4,0.8,1.2,1.6,2.0,2.4,2.8,3.2,3.6,4.0,4.4,4.8,5.2,5.6,6.0];
        for (let i = 0; i < 16; i++) {
          const bx = eqX + i * (eqTotalW / 16);
          const bh = minH + Math.abs(Math.sin(time * eqFreqs[i] + eqPhases[i])) * (maxH - minH);
          const t  = bh / maxH;
          const g  = Math.floor(100 * (1 - t));
          ctx.fillStyle = `rgba(255,${g},20,0.78)`;
          ctx.fillRect(bx, eqY - bh, barW, bh);
        }
      }


      // --- Instrument sparkle FX (O) ---
      {
        // Trumpet bell approx world position (scale(2,2) applied, figX=w*0.50, figY=h*0.8-81)
        const trumpetBellX = w * 0.50 + 55, trumpetBellY = h * 0.8 - 81 - 55;
        const keyboardKeysX = w * 0.17,     keyboardKeysY = h * 0.8 - 40;
        for (const [spx, spy] of [[trumpetBellX, trumpetBellY], [keyboardKeysX, keyboardKeysY]] as [number,number][]) {
          for (let s = 0; s < 5; s++) {
            const sop = Math.abs(Math.sin(time * 0.008 + s * 1.3)) * 0.7;
            if (sop < 0.12) continue;
            const sx = spx + Math.cos(s * Math.PI * 2 / 5) * 11;
            const sy = spy + Math.sin(s * Math.PI * 2 / 5) * 9;
            ctx.save();
            ctx.globalAlpha = sop;
            ctx.strokeStyle = '#ffe080';
            ctx.lineWidth = 1;
            ctx.translate(sx, sy);
            ctx.rotate(time * 0.002 + s * 0.4);
            for (let l = 0; l < 4; l++) {
              const la = l * Math.PI / 2;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(Math.cos(la) * 5, Math.sin(la) * 5);
              ctx.stroke();
            }
            ctx.restore();
          }
        }
      }

      // --- Foreground audience silhouettes (L) ---
      {
        const silX   = [0.05, 0.14, 0.23, 0.33, 0.45, 0.58, 0.70, 0.83];
        const raised = [false, true, false, false, true, false, true, false];
        ctx.fillStyle = 'rgba(10,5,2,0.88)';
        for (let i = 0; i < silX.length; i++) {
          const sx = w * silX[i];
          const sy = h * 0.88;
          const fH = h * 0.12;
          // Head
          ctx.beginPath(); ctx.arc(sx, sy, fH * 0.18, 0, Math.PI * 2); ctx.fill();
          // Body
          ctx.beginPath();
          ctx.roundRect(sx - fH * 0.18, sy + fH * 0.15, fH * 0.36, fH * 0.72, 3);
          ctx.fill();
          if (raised[i]) {
            // Raised arm
            ctx.beginPath();
            ctx.moveTo(sx - fH * 0.18, sy + fH * 0.22);
            ctx.lineTo(sx - fH * 0.42, sy - fH * 0.08);
            ctx.lineTo(sx - fH * 0.34, sy - fH * 0.08);
            ctx.lineTo(sx - fH * 0.12, sy + fH * 0.24);
            ctx.fill();
          }
        }
      }

      // --- Cinematic vignette (P — drawn last) ---
      {
        const vgG = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.75);
        vgG.addColorStop(0, 'transparent');
        vgG.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = vgG;
        ctx.fillRect(0, 0, w, h);
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

      // ── EXTRA OBJECTS (editor-added from library) ──────────────────────
      for (const obj of sceneExtras("concert")) {
        if (!obj.src || !(obj.wFrac > 0) || !(obj.hFrac > 0)) continue;
        const img = getEditorImage(obj.src);
        if (img.complete && img.naturalWidth > 0)
          ctx.drawImage(img, w * obj.xFrac, h * obj.yFrac, h * obj.wFrac, h * obj.hFrac);
      }

    },
    memories: (w, h) => [
      { x: w * 0.50, y: h * 0.8 - 65 - 62, type: 'future',   videoSrc: '/EldadTamirFuturePerforming.mp4', description: 'A future performance — the show must go on' },
      { x: w * 0.26, y: h * 0.8 - 80,      type: 'jasons',   videoSrc: '/EldadTamirAtJasons.mp4',         description: "Eldad & Tamir at Jason's" },
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

      } else if (mem.type === 'jasons') {
        // ── JASON'S MEMORY — glowing vintage camera ───────────────
        const bob = Math.sin(time * 0.002) * 4;
        const camPulse = 0.7 + Math.sin(time * 0.0025) * 0.3;
        ctx.save();
        ctx.translate(mem.x, mem.y + bob);

        // Soft amber halo
        const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, 52);
        halo.addColorStop(0, `rgba(255,180,60,${0.35 * camPulse})`);
        halo.addColorStop(1, 'rgba(255,140,20,0)');
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(0, 0, 52, 0, Math.PI * 2); ctx.fill();

        // Camera body
        ctx.save();
        ctx.shadowColor = `rgba(255,180,60,${0.9 * camPulse})`;
        ctx.shadowBlur = 14 + camPulse * 8;
        const bodyG = ctx.createLinearGradient(-22, -14, 22, 14);
        bodyG.addColorStop(0, '#5a3a10'); bodyG.addColorStop(0.5, '#8a5c18'); bodyG.addColorStop(1, '#4a2c08');
        ctx.fillStyle = bodyG;
        ctx.beginPath(); ctx.roundRect(-22, -14, 44, 28, 4); ctx.fill();
        ctx.restore();

        // Lens barrel
        ctx.save();
        ctx.shadowColor = `rgba(255,180,60,${0.7 * camPulse})`;
        ctx.shadowBlur = 10;
        const lensG = ctx.createRadialGradient(-3, -3, 2, 0, 0, 11);
        lensG.addColorStop(0, '#3a4a5a'); lensG.addColorStop(0.5, '#1a2a3a'); lensG.addColorStop(1, '#0a1218');
        ctx.fillStyle = '#6a5020';
        ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = lensG;
        ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
        // Lens glint
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.beginPath(); ctx.ellipse(-3, -3, 4, 2.5, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Viewfinder bump (top)
        ctx.fillStyle = '#6a4a18';
        ctx.beginPath(); ctx.roundRect(8, -20, 10, 8, 2); ctx.fill();

        // Film-strip sprocket holes (left & right sides)
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath(); ctx.roundRect(-20 + i * 0, -10 + i * 8, 4, 4, 1); ctx.fill();
          ctx.beginPath(); ctx.roundRect(16,          -10 + i * 8, 4, 4, 1); ctx.fill();
        }

        // "▶" play label underneath
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(255,210,80,${0.8 + camPulse * 0.2})`;
        ctx.fillText('▶ GRAB', 0, 26);

        ctx.restore();
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

  tokyo: (() => {
    const I: Record<string, HTMLImageElement> = {};
    for (const [k, s] of [
      ['fuji',    '/PNG_Japan/Volcano Fuji.png'],
      ['trees',   '/PNG_Japan/Background Trees.png'],
      ['clouds',  '/PNG_Japan/Clouds.png'],
      ['sakura',  '/PNG_Japan/Sakura Tree.png'],
      ['arc',     '/PNG_Japan/Arc.png'],
      ['pagoda',  '/PNG_Japan/Tower.png'],
      ['house',   '/PNG_Japan/House Outside.png'],
      ['ramen',   '/Tokyo_neo/r_2044.png'],
      ['doors',   '/Tokyo_neo/r_2042.png'],
      ['lamp',    '/Tokyo_neo/r_2083.png'],
      ['lantern', '/Tokyo_neo/r_2092.png'],
      ['vend',    '/Tokyo_neo/r_2032.png'],
      ['robocat',   '/Tokyo_neo/r_2023.png'],
      ['neonSign',  '/Tokyo_neo/r_2089.png'],
      ['pikachu',    '/pikachu-f.png'],
      ['neo20',      '/Tokyo_neo/r_2020.png'],

      ['screamtail', 'https://img.pokemondb.net/sprites/scarlet-violet/normal/scream-tail.png'],
    ] as [string, string][]) { const img = new Image(); img.src = s; I[k] = img; }
    return {
    name: '🗼 Tokyo Sunset',
    playerStart: (w, h) => ({ x: 50, y: h * 0.85 }),
    background: (ctx, w, h, time) => {
      const ground = h * 0.78;

      // ── HELPERS ────────────────────────────────────────────────────────
      const di = (img: HTMLImageElement, x: number, y: number, dw: number, dh: number, blend?: string) => {
        if (!img.complete || img.naturalWidth === 0) return;
        if (blend) ctx.globalCompositeOperation = blend as GlobalCompositeOperation;
        ctx.drawImage(img, x, y, dw, dh);
        if (blend) ctx.globalCompositeOperation = 'source-over';
      };
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
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 15px monospace'; ctx.textAlign = 'center';
        ctx.fillText(emoji + ' ' + title, lx, ly + 20);
        if (detail) {
          ctx.fillStyle = 'rgba(180,220,255,0.95)'; ctx.font = '12px monospace';
          ctx.fillText(detail, lx, ly + 39);
        }
        ctx.textAlign = 'left';
      };
      // Returns editor-overridden position/size/visibility; if hidden, skip the di() call
      const ep = (id: string, defX: number, defY: number, defW: number, defH: number) => {
        const pin = editorPins[id];
        const active = isEditorActive();
        return {
          hidden: pin?.hidden ?? false,
          x:  (active && pin) ? w * pin.xFrac : defX,
          y:  (active && pin) ? h * pin.yFrac : defY,
          dw: (active && pin?.wFrac != null) ? h * pin.wFrac : defW,
          dh: (active && pin?.hFrac != null) ? h * pin.hFrac : defH,
        };
      };

      // ── 1. SUNSET SKY ──────────────────────────────────────────────────
      const sky = ctx.createLinearGradient(0, 0, 0, ground);
      sky.addColorStop(0,    '#1a0a2e');
      sky.addColorStop(0.25, '#3d1060');
      sky.addColorStop(0.55, '#b83050');
      sky.addColorStop(0.80, '#e8622a');
      sky.addColorStop(1,    '#f5a82e');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, ground);
      const groundG = ctx.createLinearGradient(0, ground, 0, h);
      groundG.addColorStop(0, '#c04818'); groundG.addColorStop(1, '#1a0808');
      ctx.fillStyle = groundG; ctx.fillRect(0, ground, w, h - ground);

      // ── 2. SUN ─────────────────────────────────────────────────────────
      const sunX = w * 0.62, sunY = ground - h * 0.04;
      const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.30);
      sg.addColorStop(0, 'rgba(255,210,60,0.80)'); sg.addColorStop(0.20, 'rgba(255,120,30,0.44)');
      sg.addColorStop(0.55, 'rgba(200,50,20,0.10)'); sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg; ctx.fillRect(0, 0, w, ground);
      ctx.fillStyle = 'rgba(255,240,120,0.96)';
      ctx.beginPath(); ctx.arc(sunX, sunY, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,200,0.65)';
      ctx.beginPath(); ctx.arc(sunX, sunY, 15, 0, Math.PI * 2); ctx.fill();

      // ── 3. CLOUDS ──────────────────────────────────────────────────────
      { const p = ep('clouds1', w*-0.070, h*-0.045, h*1.183, h*0.186); if (!p.hidden) di(I.clouds, p.x, p.y, p.dw, p.dh, 'multiply'); }
      { const p = ep('clouds2', w*0.466,  h*-0.002, h*1.089, h*0.146); if (!p.hidden) di(I.clouds, p.x, p.y, p.dw, p.dh, 'multiply'); }

      // ── 3b. SUN ABOVE FUJI ─────────────────────────────────────────────
      {
        const sx = w * 0.28, sy = h * 0.33, sr = h * 0.055;
        // Outer glow
        const sg2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 5);
        sg2.addColorStop(0,   'rgba(255,230,80,0.55)');
        sg2.addColorStop(0.3, 'rgba(255,160,30,0.22)');
        sg2.addColorStop(0.7, 'rgba(220,80,10,0.07)');
        sg2.addColorStop(1,   'transparent');
        ctx.fillStyle = sg2;
        ctx.beginPath(); ctx.arc(sx, sy, sr * 5, 0, Math.PI * 2); ctx.fill();
        // Sun rays
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(time * 0.0001);
        ctx.strokeStyle = 'rgba(255,220,60,0.18)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * sr * 1.4, Math.sin(a) * sr * 1.4);
          ctx.lineTo(Math.cos(a) * sr * 3.2, Math.sin(a) * sr * 3.2);
          ctx.stroke();
        }
        ctx.restore();
        // Disc
        ctx.fillStyle = 'rgba(255,245,120,0.97)';
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,200,0.6)';
        ctx.beginPath(); ctx.arc(sx, sy, sr * 0.6, 0, Math.PI * 2); ctx.fill();
      }

      // ── 4. MT. FUJI ────────────────────────────────────────────────────
      { const p = ep('fuji', w*-0.006, h*0.406, h*1.024, h*0.522); if (!p.hidden) di(I.fuji, p.x, p.y, p.dw, p.dh); }

      // ── 5. FAR TREE LINE ───────────────────────────────────────────────
      { const p = ep('trees_l', w*0.542, h*0.261, h*0.534, h*0.200); if (!p.hidden) di(I.trees, p.x, p.y, p.dw, p.dh); }
      { const p = ep('trees_r', w*0.667, h*0.704, h*0.312, h*0.088); if (!p.hidden) di(I.trees, p.x, p.y, p.dw, p.dh); }

      // ── 6. PAGODA ──────────────────────────────────────────────────────
      { const p = ep('pagoda', w*0.920, h*0.526, h*0.185, h*0.258); if (!p.hidden) di(I.pagoda, p.x, p.y, p.dw, p.dh); }

      // ── 7. HOUSE ───────────────────────────────────────────────────────
      { const p = ep('house', w*0.540, h*0.396, h*0.322, h*0.446); if (!p.hidden) di(I.house, p.x, p.y, p.dw, p.dh); }

      // ── 9. BACKGROUND BUILDINGS ────────────────────────────────────────
      { const p = ep('doors',   w*0.781, h*0.531,  h*0.320, h*0.250); if (!p.hidden) di(I.doors,   p.x, p.y, p.dw, p.dh); }

      // ── 10. RAMEN SHOP ─────────────────────────────────────────────────
      { const p = ep('ramen',   w*0.242, h*0.485,  h*0.391, h*0.380); if (!p.hidden) di(I.ramen,   p.x, p.y, p.dw, p.dh); }

      // ── 11. TORII GATE ─────────────────────────────────────────────────
      { const p = ep('arc',     w*0.544, h*0.534,  h*0.078, h*0.067); if (!p.hidden) di(I.arc, p.x, p.y, p.dw, p.dh); }

      // ── 11b. NEON SIGN ─────────────────────────────────────────────────
      { const p = ep('neon', w*0.637, h*0.516, h*0.039, h*0.072);
        if (!p.hidden) di(I.neonSign, p.x, p.y, p.dw, p.dh); }

      // ── 11c. NEO EXTRAS ────────────────────────────────────────────────
      { const p = ep('neo44', w*0.793, h*0.477, h*0.313, h*0.313); if (!p.hidden) di(I.ramen, p.x, p.y, p.dw, p.dh); }
      { const p = ep('neo20', w*0.085, h*0.243, h*0.150, h*0.150); if (!p.hidden) di(I.neo20, p.x, p.y, p.dw, p.dh); }

      // ── 12. SAKURA TREES ──────────────────────────────────────────────
      { const p = ep('sakura1', w*-0.003, h*0.528, h*0.278, h*0.278); if (!p.hidden) di(I.sakura, p.x, p.y, p.dw, p.dh); }
      { const p = ep('sakura2', w*0.438, h*0.577, h*0.225, h*0.225); if (!p.hidden) di(I.sakura, p.x, p.y, p.dw, p.dh); }

      // ── 13. GROUND ─────────────────────────────────────────────────────
      ctx.fillStyle = '#6a3a18'; ctx.fillRect(0, ground, w, h * 0.026);
      ctx.strokeStyle = 'rgba(255,180,100,0.06)'; ctx.lineWidth = 1;
      for (let tx = 0; tx < w; tx += 32) { ctx.beginPath(); ctx.moveTo(tx, ground); ctx.lineTo(tx, ground + h * 0.026); ctx.stroke(); }
      const stG = ctx.createLinearGradient(0, ground + h * 0.026, 0, h);
      stG.addColorStop(0, '#1e0e06'); stG.addColorStop(1, '#0e0606');
      ctx.fillStyle = stG; ctx.fillRect(0, ground + h * 0.026, w, h - ground - h * 0.026);
      const ref = ctx.createLinearGradient(w * 0.28, 0, w * 0.82, 0);
      ref.addColorStop(0, 'transparent'); ref.addColorStop(0.5, 'rgba(255,130,35,0.14)'); ref.addColorStop(1, 'transparent');
      ctx.fillStyle = ref; ctx.fillRect(0, ground + h * 0.026, w, h * 0.06);

      // ── 14. STREET LAMPS ───────────────────────────────────────────────
      { const p1 = ep('lamp_l',  w*0.658, h*0.650, h*0.127, h*0.264);
        const p2 = ep('lamp_r',  w*0.391, h*0.549, h*0.115, h*0.240);
        if (!p1.hidden) di(I.lamp, p1.x, p1.y, p1.dw, p1.dh);
        if (!p2.hidden) di(I.lamp, p2.x, p2.y, p2.dw, p2.dh); }

      // ── 15. LANTERN ────────────────────────────────────────────────────
      { const p = ep('lantern', w*0.575, h*0.506, h*0.043, h*0.078);
        if (!p.hidden) di(I.lantern, p.x, p.y, p.dw, p.dh); }

      // ── 16. VENDING MACHINE ────────────────────────────────────────────
      { const p = ep('vend', w*0.696, h*0.625, h*0.132, h*0.160);
        if (!p.hidden) di(I.vend, p.x, p.y, p.dw, p.dh); }

      // ── 17. ROBOT CAT ──────────────────────────────────────────────────
      { const p = ep('robocat', w*0.891, h*0.417, h*0.050, h*0.061);
        if (!p.hidden) di(I.robocat, p.x, p.y, p.dw, p.dh); }

      // ── 18. PIKACHU (wanders along the street) ─────────────────────────
      { const pikH = h*0.085, pikW = pikH;
        const p = ep('pikachu', w*0.331, h*0.711, pikW, pikH);
        if (!p.hidden) {
          const pikX = p.x + Math.sin(time * 0.0006) * w * 0.05;
          const pikY = p.y + Math.abs(Math.sin(time * 0.003)) * 3;
          di(I.pikachu, pikX - p.dw/2, pikY, p.dw, p.dh);
        } }


      // ── 20b. SCREAM TAIL ────────────────────────────────────────────────
      { const p = ep('scream_tail', w*0.190, h*0.530, h*0.110, h*0.110);
        if (!p.hidden) {
          const floatY = p.y + Math.sin(time * 0.0014) * h * 0.018;
          di(I.screamtail, p.x, floatY, p.dw, p.dh);
        } }

      // ── 21. EXTRA OBJECTS (editor-added from library) ──────────────────
      for (const obj of sceneExtras("tokyo")) {
        if (!obj.src || !(obj.wFrac > 0) || !(obj.hFrac > 0)) continue;
        const img = getEditorImage(obj.src);
        if (img.complete && img.naturalWidth > 0)
          ctx.drawImage(img, w * obj.xFrac, h * obj.yFrac, h * obj.wFrac, h * obj.hFrac);
      }

    },

    platforms: (_w, _h) => [],

    memories: (w, h) => {
      const mep = (id: string, xf: number, yf: number) => {
        const pin = editorPins[id];
        if (pin) return { x: w * pin.xFrac, y: h * pin.yFrac };
        return { x: w * xf, y: h * yf };
      };
      return [
        { ...mep('pikachu',    0.331, 0.711), type: 'pikachu',    videoSrc: '/EldadSamiri.jpeg', description: '⚡ Pikachu spotted in the neon streets of Tokyo' },
        { ...mep('snorlax',    0.803, 0.376), type: 'snorlax',    videoSrc: '/Meiji.jpeg',        description: '💤 Snorlax blocking the path — as always' },
        { ...mep('charizard',  0.908, 0.200), type: 'charizard',  videoSrc: '/EldadSamiri.jpeg', description: '🔥 Charizard soaring over the Tokyo skyline' },
        { ...mep('scream_tail',  0.190, 0.530), type: 'scream_tail',  videoSrc: '/Meiji.jpeg',           description: '🌸 Scream Tail echoing through the city' },
        { ...mep('shibuya',      0.500, 0.750), type: 'shibuya',      videoSrc: '/ShibuyaCrossing.mp4',  description: '🚶 Shibuya Crossing — the world\'s busiest intersection' },
      ];
    },

    // No visual indicator — the Pokemon sprites are the interaction cue.
    // Proximity to each Pokemon triggers the memory viewer automatically.
    drawMemory: (_ctx, _mem, _time) => {},
  }; })(),
};
