// Lightweight canvas-space feedback effects (collection bursts, floating text).
// Pure data + draw; owned by refs in GameCanvas, updated once per frame.

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface FloatText {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
}

const BURST_COLORS = ['#ffd700', '#fff0a0', '#ffffff', '#f8e030', '#ffb020'];

export function spawnBurst(list: Particle[], x: number, y: number): void {
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.4;
    const speed = 2 + Math.random() * 4;
    list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 0,
      maxLife: 40 + Math.random() * 25,
      color: BURST_COLORS[i % BURST_COLORS.length],
      size: 3 + Math.random() * 4,
    });
  }
}

export function spawnFloatText(list: FloatText[], x: number, y: number, text: string): void {
  list.push({ x, y, text, life: 0, maxLife: 80 });
}

export function updateAndDraw(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  texts: FloatText[]
): void {
  // Particles — pixel squares with gravity
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life++;
    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
      continue;
    }
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.vx *= 0.985;
    const t = 1 - p.life / p.maxLife;
    ctx.globalAlpha = t;
    ctx.fillStyle = p.color;
    const s = p.size * (0.5 + t * 0.5);
    ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
  }
  ctx.globalAlpha = 1;

  // Floating score-style text
  ctx.font = '13px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  for (let i = texts.length - 1; i >= 0; i--) {
    const ft = texts[i];
    ft.life++;
    if (ft.life >= ft.maxLife) {
      texts.splice(i, 1);
      continue;
    }
    const t = ft.life / ft.maxLife;
    const y = ft.y - t * 55;
    ctx.globalAlpha = t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(ft.text, ft.x, y);
    ctx.fillStyle = '#ffd700';
    ctx.fillText(ft.text, ft.x, y);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
}
