import { Scene } from './types';

export const scenes: Record<string, Scene> = {
  japan: {
    name: '⛷️ Snowboarding in Japan',
    snowboarding: true,
    playerStart: (w, h) => ({ x: 50, y: h * 0.25 }),
    background: (ctx, w, h, time) => {
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#E8F4FC');
      grad.addColorStop(0.5, '#D4E8F7');
      grad.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Snow hills
      ctx.fillStyle = '#F0F8FF';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      for (let x = 0; x <= w; x += 10) {
        ctx.lineTo(x, h * 0.6 + Math.sin(x * 0.008) * 40 + Math.sin(x * 0.003) * 60);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      ctx.fillStyle = '#E8F0E8';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.7);
      for (let x = 0; x <= w; x += 10) {
        ctx.lineTo(x, h * 0.7 + Math.sin(x * 0.006 + 1) * 30 + Math.sin(x * 0.002) * 50);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Pine trees
      for (let i = 0; i < 15; i++) {
        const tx = (w / 15) * i + 30;
        const ty = h * 0.55 + Math.sin(tx * 0.005) * 40;
        const treeH = 40 + Math.random() * 20;
        // Trunk
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(tx - 3, ty, 6, treeH * 0.3);
        // Layers
        for (let j = 0; j < 3; j++) {
          ctx.fillStyle = j === 0 ? '#2D5F2D' : j === 1 ? '#3A7A3A' : '#4A9A4A';
          ctx.beginPath();
          ctx.moveTo(tx, ty - treeH + j * 15);
          ctx.lineTo(tx - 15 + j * 3, ty - j * 5);
          ctx.lineTo(tx + 15 - j * 3, ty - j * 5);
          ctx.fill();
          // Snow cap
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.beginPath();
          ctx.moveTo(tx, ty - treeH + j * 15);
          ctx.lineTo(tx - 8 + j * 2, ty - treeH + j * 15 + 8);
          ctx.lineTo(tx + 8 - j * 2, ty - treeH + j * 15 + 8);
          ctx.fill();
        }
      }

      // Snowflakes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 200; i++) {
        const size = 2 + (i % 4);
        const sx = (i * 97 + time * 0.002 * (i % 3 + 1) * 30) % w;
        const sy = (i * 53 + time * 0.003 * (i % 2 + 1) * 20) % h;
        ctx.beginPath();
        ctx.arc(sx, sy, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    platforms: (w, h) => [
      { x: w * 0.05, y: h * 0.35, width: w * 0.25, height: 20 },
      { x: w * 0.25, y: h * 0.5, width: w * 0.25, height: 20 },
      { x: w * 0.45, y: h * 0.65, width: w * 0.25, height: 20 },
      { x: w * 0.65, y: h * 0.8, width: w * 0.3, height: 20 },
    ],
    memory: (w, h) => ({ x: w * 0.85, y: h * 0.8 - 70, type: 'torii' }),
    drawMemory: (ctx, mem) => {
      ctx.font = '48px serif';
      ctx.fillText('⛩️', mem.x - 24, mem.y + 20);
    },
  },

  castle: {
    name: '🏯 Naked Castle, Moganshan',
    playerStart: (w, h) => ({ x: 50, y: h * 0.85 }),
    background: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#4A5568');
      grad.addColorStop(1, '#2D3748');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = 0; i < 100; i++) {
        const sx = (i * 137) % w;
        const sy = (i * 89) % (h * 0.6);
        ctx.beginPath();
        ctx.arc(sx, sy, 1 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
      }

      // Ground
      ctx.fillStyle = '#1A202C';
      ctx.fillRect(0, h * 0.7, w, h * 0.3);

      // Hills
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(26, 32, 44, ${0.6 + i * 0.08})`;
        ctx.beginPath();
        ctx.moveTo(i * w * 0.2, h * 0.7);
        ctx.quadraticCurveTo(i * w * 0.2 + w * 0.15, h * 0.5 - i * 10, (i + 1) * w * 0.25, h * 0.7);
        ctx.fill();
      }
    },
    platforms: (w, h) => [
      { x: w * 0.05, y: h * 0.75, width: w * 0.2, height: 20 },
      { x: w * 0.3, y: h * 0.6, width: w * 0.2, height: 20 },
      { x: w * 0.55, y: h * 0.45, width: w * 0.2, height: 20 },
      { x: w * 0.75, y: h * 0.3, width: w * 0.2, height: 20 },
    ],
    memory: (w, h) => ({ x: w * 0.82, y: h * 0.3 - 80, type: 'castle' }),
    drawMemory: (ctx, mem) => {
      // Castle body
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(mem.x - 20, mem.y, 40, 50);
      // Roof
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(mem.x - 25, mem.y);
      ctx.lineTo(mem.x, mem.y - 20);
      ctx.lineTo(mem.x + 25, mem.y);
      ctx.fill();
      // Door
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(mem.x - 6, mem.y + 30, 12, 20);
    },
  },

  concert: {
    name: '🎸 Eldad & Tamir Live',
    playerStart: (w, h) => ({ x: 50, y: h * 0.7 }),
    background: (ctx, w, h) => {
      ctx.fillStyle = '#1A1A2E';
      ctx.fillRect(0, 0, w, h);

      // Stage lights
      for (let i = 0; i < 20; i++) {
        const lx = (w / 20) * i + w / 40;
        const grad = ctx.createRadialGradient(lx, 0, 0, lx, 0, h * 0.4);
        grad.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(lx - h * 0.4, 0, h * 0.8, h * 0.5);
      }

      // Stage floor
      ctx.fillStyle = '#2D2D44';
      ctx.fillRect(0, h * 0.75, w, h * 0.25);

      // Spotlight
      const spotGrad = ctx.createRadialGradient(w * 0.75, h * 0.65, 0, w * 0.75, h * 0.65, 200);
      spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      spotGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.08)');
      spotGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.65, 200, 0, Math.PI * 2);
      ctx.fill();
    },
    platforms: (w, h) => [
      { x: w * 0.05, y: h * 0.75, width: w * 0.3, height: 20 },
      { x: w * 0.35, y: h * 0.55, width: w * 0.25, height: 20 },
      { x: w * 0.65, y: h * 0.75, width: w * 0.3, height: 20 },
    ],
    memory: (w, h) => ({ x: w * 0.75, y: h * 0.75 - 60, type: 'microphone' }),
    drawMemory: (ctx, mem) => {
      ctx.font = '40px serif';
      ctx.fillText('🎤', mem.x - 20, mem.y + 20);
    },
    item: (w, h) => ({ x: w * 0.45, y: h * 0.55 - 40, type: 'trombone', collected: false }),
    drawItem: (ctx, item) => {
      ctx.font = '36px serif';
      ctx.fillText('🎺', item.x - 18, item.y + 18);
    },
  },

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
    memory: (w, h) => ({ x: w * 0.82, y: h * 0.35 - 70, type: 'portal' }),
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
