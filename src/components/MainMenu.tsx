import { useEffect, useRef, useState } from 'react';
import { SceneKey } from '@/game/types';

interface MainMenuProps {
  onSelectScene: (scene: SceneKey) => void;
}

const stages: { key: SceneKey; world: number; title: string; date: string; icon: string; color: string; x: number; y: number }[] = [
  { key: 'castle',  world: 1, title: 'Naked Castle',                 date: 'JAN 2026',   icon: '🏯', color: '#3068e8', x: 18, y: 70 },
  { key: 'japan',   world: 2, title: 'Snowboarding Japan',           date: 'FEB 2026',   icon: '⛷️', color: '#28c0e8', x: 40, y: 56 },
  { key: 'tokyo',   world: 3, title: 'Tokyo Nights',                 date: 'MAR 2026',   icon: '🗼', color: '#e81080', x: 62, y: 68 },
  { key: 'concert', world: 4, title: 'Future',                       date: 'DEC 2025',   icon: '🎸', color: '#e84820', x: 82, y: 48 },
];

const MainMenu = ({ onSelectScene }: MainMenuProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const cloudOffsetRef = useRef(0);
  const dashOffsetRef = useRef(0);

  const [selected, setSelected] = useState(0);
  const [blink, setBlink] = useState(true);

  // Blink arrow
  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(id);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected(s => (s + 1) % stages.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected(s => (s - 1 + stages.length) % stages.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelected(s => { onSelectScene(stages[s].key); return s; });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSelectScene]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const clouds = Array.from({ length: 7 }, (_, i) => ({
      x: (i / 7) * canvas.width,
      y: 40 + Math.sin(i * 1.3) * 30,
      w: 60 + (i % 3) * 20,
    }));

    const trees = [
      { x: 0.12, y: 0.62 }, { x: 0.25, y: 0.74 }, { x: 0.33, y: 0.60 },
      { x: 0.50, y: 0.72 }, { x: 0.55, y: 0.58 }, { x: 0.70, y: 0.66 },
      { x: 0.76, y: 0.75 }, { x: 0.90, y: 0.55 },
    ];

    const drawCloud = (x: number, y: number, w: number) => {
      ctx.fillStyle = '#ffffff';
      const h = w * 0.4;
      ctx.beginPath();
      ctx.ellipse(x, y, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
      ctx.ellipse(x - w * 0.25, y + h * 0.1, w * 0.3, h * 0.4, 0, 0, Math.PI * 2);
      ctx.ellipse(x + w * 0.25, y + h * 0.1, w * 0.35, h * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawTree = (px: number, py: number) => {
      const x = px * canvas.width;
      const y = py * canvas.height;
      // trunk
      ctx.fillStyle = '#7b4a1e';
      ctx.fillRect(x - 3, y, 6, 14);
      // foliage layers
      ctx.fillStyle = '#2d7a1a';
      ctx.beginPath(); ctx.moveTo(x, y - 22); ctx.lineTo(x - 14, y + 2); ctx.lineTo(x + 14, y + 2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x, y - 34); ctx.lineTo(x - 10, y - 12); ctx.lineTo(x + 10, y - 12); ctx.closePath(); ctx.fill();
    };

    const drawHills = (offsetY: number, color: string, amplitude: number, freq: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 2) {
        const y = offsetY + Math.sin(x * freq) * amplitude + Math.sin(x * freq * 0.5 + 1) * (amplitude * 0.5);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    };

    const drawPath = () => {
      const W = canvas.width;
      const H = canvas.height;
      const pts = stages.map(s => ({ x: s.x / 100 * W, y: s.y / 100 * H }));

      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -dashOffsetRef.current;
      ctx.strokeStyle = '#e8c030';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const cpx = (pts[i - 1].x + pts[i].x) / 2;
        const cpy = Math.min(pts[i - 1].y, pts[i].y) - 30;
        ctx.quadraticCurveTo(cpx, cpy, pts[i].x, pts[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      sky.addColorStop(0, '#5c94fc');
      sky.addColorStop(1, '#a8c8ff');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Clouds
      cloudOffsetRef.current = (cloudOffsetRef.current + 0.3) % W;
      for (const c of clouds) {
        const cx = ((c.x - cloudOffsetRef.current + W * 2) % (W + 100)) - 50;
        drawCloud(cx, c.y, c.w);
      }

      // Back hills
      drawHills(H * 0.55, '#56a832', H * 0.12, 0.004);
      // Front hills
      drawHills(H * 0.65, '#3d8a20', H * 0.10, 0.006);

      // Trees
      for (const t of trees) drawTree(t.x, t.y);

      // Ground
      ctx.fillStyle = '#3d8a20';
      ctx.fillRect(0, H * 0.82, W, H * 0.18);
      ctx.fillStyle = '#56a832';
      ctx.fillRect(0, H * 0.82, W, 6);
      // Pixel tile texture on ground
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (let x = 0; x < W; x += 16) {
        ctx.fillRect(x, H * 0.82, 1, H * 0.18);
      }
      for (let y = H * 0.82; y < H; y += 16) {
        ctx.fillRect(0, y, W, 1);
      }

      // Animated dotted path
      dashOffsetRef.current = (dashOffsetRef.current + 0.5) % 18;
      drawPath();

      rafRef.current = requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // re-spread clouds on resize
      clouds.forEach((c, i) => {
        c.x = (i / 7) * canvas.width;
        c.y = 40 + Math.sin(i * 1.3) * 30;
      });
    };

    resize();
    window.addEventListener('resize', resize);
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ fontFamily: '"Press Start 2P", monospace, sans-serif' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* DOM overlay */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Title card */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 pointer-events-none"
          style={{
            background: '#c0392b',
            border: '4px solid #8b1a10',
            boxShadow: '4px 4px 0 #5a0e08, inset 0 0 0 2px #e85042',
            padding: '8px 18px',
            textAlign: 'center',
          }}>
          <div style={{ color: '#f8e030', fontSize: 'clamp(9px,2vw,14px)', textShadow: '2px 2px 0 #8b5e00, -1px -1px 0 #8b5e00', letterSpacing: 2 }}>
            ★ ELDAD'S MEMORIES ★
          </div>
          <div style={{ color: '#ffb0a0', fontSize: 'clamp(6px,1.2vw,9px)', marginTop: 4, letterSpacing: 1 }}>
            SELECT WORLD
          </div>
        </div>

        {/* Stage nodes */}
        {stages.map((stage, i) => {
          const isSelected = i === selected;
          const nodeSize = isSelected ? 118 : 96;
          return (
            <div
              key={stage.key}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${stage.x}%`,
                top: `${stage.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
              onClick={() => {
                setSelected(i);
                onSelectScene(stage.key);
              }}
            >
              {/* Blink arrow above selected */}
              <div style={{
                fontSize: 14,
                color: '#f8e030',
                textShadow: '1px 1px 0 #8b5e00',
                marginBottom: 2,
                visibility: isSelected && blink ? 'visible' : 'hidden',
              }}>▼</div>

              {/* Circle node */}
              <div style={{
                width: nodeSize,
                height: nodeSize,
                borderRadius: '50%',
                background: isSelected ? stage.color : '#666',
                border: isSelected ? '4px solid #f8e030' : '3px solid #888',
                boxShadow: isSelected ? `0 0 18px ${stage.color}, 0 0 30px rgba(248,224,48,0.6)` : '2px 2px 0 rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
                fontSize: isSelected ? 96 : 89,
                lineHeight: 1,
              }}>
                <span>{stage.icon}</span>
                <span style={{
                  fontSize: isSelected ? 9 : 7,
                  color: isSelected ? '#fff' : '#ccc',
                  marginTop: 2,
                  textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
                }}>W{stage.world}</span>
              </div>

              {/* Label below */}
              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <div style={{
                  fontSize: 'clamp(12px, 1vw, 7px)',
                  color: isSelected ? '#f8e030' : '#ddd',
                  textShadow: isSelected ? '1px 1px 0 #8b5e00' : '1px 1px 0 rgba(0,0,0,0.9)',
                  maxWidth: 80,
                  lineHeight: 1.4,
                }}>
                  {stage.title}
                </div>
                <div style={{
                  fontSize: 'clamp(4px, 0.8vw, 6px)',
                  color: isSelected ? '#ffd080' : '#aaa',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.9)',
                  marginTop: 2,
                }}>
                  {stage.date}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom HUD */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            background: 'rgba(0,0,0,0.75)',
            borderTop: '3px solid #e8c030',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <div style={{ color: '#aaa', fontSize: 'clamp(5px,1.1vw,8px)', letterSpacing: 1 }}>
            ◀▶ MOVE &nbsp; ENTER SELECT
          </div>
          <div style={{
            color: '#f8e030',
            fontSize: 'clamp(5px,1.1vw,8px)',
            textShadow: '1px 1px 0 #8b5e00',
            letterSpacing: 1,
            opacity: blink ? 1 : 0.3,
            transition: 'opacity 0.1s',
          }}>
            ▶ PRESS ENTER ◀
          </div>
          <div style={{ color: '#aaa', fontSize: 'clamp(5px,1.1vw,8px)', letterSpacing: 1 }}>
            WORLD {selected + 1} / {stages.length}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainMenu;
