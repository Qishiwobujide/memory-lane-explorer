import { useRef, useEffect, useCallback, useState } from 'react';
import { SceneKey, SceneItem, MemoryArtifact } from '@/game/types';
import { scenes } from '@/game/scenes';
import {
  createPlayer,
  updatePlayer,
  tryJump,
  startTrick,
  updateTrick,
  checkProximity,
  drawPlatforms,
  drawPlayer,
} from '@/game/engine';
import ControlsOverlay from './ControlsOverlay';
import MemoryViewer from './MemoryViewer';

interface GameCanvasProps {
  sceneKey: SceneKey;
  onBack: () => void;
}

const GameCanvas = ({ sceneKey, onBack }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingVideo, setViewingVideo] = useState<string | undefined>(undefined);

  const stateRef = useRef({
    player: createPlayer(),
    keys: {} as Record<string, boolean>,
    spacePressed: false,
    itemCollected: false,
    animId: 0,
    item: null as SceneItem | null,
  });

  const collectedRef = useRef<Set<number>>(new Set());
  const memoryAnimRef = useRef<Map<number, { x: number; y: number; dir: number; mirror: number; flipping: boolean; flipAngle: number }>>(new Map());
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const showViewerRef = useRef(false);

  const handleCloseViewer = useCallback(() => {
    showViewerRef.current = false;
    setViewerOpen(false);
    setViewingVideo(undefined);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const scene = scenes[sceneKey];
    if (!scene) return;

    const state = stateRef.current;
    const player = state.player;

    // Reset state for this scene
    collectedRef.current = new Set();
    memoryAnimRef.current = new Map();
    showViewerRef.current = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init player
    const start = scene.playerStart?.(canvas.width, canvas.height) ?? { x: 50, y: canvas.height * 0.7 };
    player.x = start.x;
    player.y = start.y;
    player.snowboarding = !!scene.snowboarding;
    player.velocityX = 0;
    player.velocityY = 0;
    player.hasItem = false;
    player.jumpsRemaining = player.maxJumps;

    // Init item
    state.itemCollected = false;
    state.item = scene.item ? { ...scene.item(canvas.width, canvas.height) } : null;

    const getAllMemories = (w: number, h: number): MemoryArtifact[] => {
      if (scene.memories) return scene.memories(w, h);
      if (scene.memory) return [scene.memory(w, h)];
      return [];
    };

    // Init driving memories immediately at scene start
    getAllMemories(canvas.width, canvas.height).forEach((mem, idx) => {
      if (mem.type === 'mg') {
        memoryAnimRef.current.set(idx, { x: mem.x, y: mem.y, dir: 1, mirror: -1, flipping: false, flipAngle: 0 });
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      state.keys[e.key] = true;

      if (e.key === ' ' && !state.spacePressed) {
        state.spacePressed = true;
        tryJump(player);
        e.preventDefault();
      }

      if (e.key === '1') startTrick(player, 'flip');
      if (e.key === '2') startTrick(player, 'grab');
      if (e.key === '3') startTrick(player, 'spin');

      if (e.key === 'Escape') {
        if (showViewerRef.current) {
          showViewerRef.current = false;
          setViewerOpen(false);
          setViewingVideo(undefined);
        } else {
          onBack();
        }
      }

      if (e.key === 'Enter') {
        const w = canvas.width;
        const h = canvas.height;
        const allMemories = getAllMemories(w, h);

        // Item collection
        if (state.item && !state.itemCollected && checkProximity(player, state.item.x, state.item.y)) {
          state.itemCollected = true;
          player.hasItem = true;
          state.item.collected = true;
        }

        const needsItem = !!scene.item;
        const canCollect = !needsItem || state.itemCollected;

        if (canCollect) {
          for (let i = 0; i < allMemories.length; i++) {
            const anim = memoryAnimRef.current.get(i);
            const checkX = anim ? anim.x : allMemories[i].x;
            const checkY = anim ? anim.y : allMemories[i].y;
            if (!collectedRef.current.has(i) && checkProximity(player, checkX, checkY)) {
              collectedRef.current.add(i);
              showViewerRef.current = true;
              setViewerOpen(true);
              setViewingVideo(allMemories[i].videoSrc);
              break;
            }
          }
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      state.keys[e.key] = false;
      if (e.key === ' ') state.spacePressed = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = null; };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const loop = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const platforms = scene.platforms(w, h);
      const allMemories = getAllMemories(w, h);

      ctx.clearRect(0, 0, w, h);
      scene.background(ctx, w, h, time);
      if (scene.drawPlatforms) scene.drawPlatforms(ctx, platforms);
      else drawPlatforms(ctx, platforms);

      // Item
      if (scene.drawItem && state.item && !state.itemCollected) {
        const itemPos = scene.item!(w, h);
        scene.drawItem(ctx, itemPos);
      }

      // Memories — always visible; collected car gets driving animation
      for (let i = 0; i < allMemories.length; i++) {
        const anim = memoryAnimRef.current.get(i);
        if (anim) {
          // Update car position
          if (!anim.flipping) {
            anim.x += 1.4 * anim.dir;
            if ((anim.dir > 0 && anim.x > w + 60) || (anim.dir < 0 && anim.x < -60)) {
              anim.flipping = true;
              anim.flipAngle = 0;
            }
          } else {
            anim.flipAngle += 0.055;
            if (anim.flipAngle >= Math.PI) {
              anim.mirror *= -1;
              anim.dir *= -1;
              anim.flipping = false;
              anim.flipAngle = 0;
            }
          }
          // Draw at animated position — mirror controls facing direction
          // mirror=-1: faces right (default draw is left-facing), mirror=1: faces left
          const scaleX = anim.flipping ? anim.mirror * Math.cos(anim.flipAngle) : anim.mirror;
          ctx.save();
          ctx.translate(anim.x, anim.y);
          ctx.scale(scaleX, 1);
          scene.drawMemory(ctx, { ...allMemories[i], x: 0, y: 0 }, time);
          ctx.restore();
        } else {
          scene.drawMemory(ctx, allMemories[i], time);
        }
      }

      // Player
      if (!showViewerRef.current) {
        updatePlayer(player, state.keys, platforms, w, h);
        updateTrick(player);
      }
      drawPlayer(ctx, player, time);

      // Trick name
      if (player.trick && player.trickTimer > 0) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.font = '12px "Press Start 2P", monospace';
        const trickName = player.trick === 'flip' ? '🔄 FLIP!' : player.trick === 'grab' ? '🤙 GRAB!' : '🌀 SPIN!';
        ctx.fillText(trickName, player.x - 20, player.y - 20);
      }

      // Scene name
      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillText(scene.name, 20, 30);

      // Memory counter for multi-memory scenes
      if (allMemories.length > 1) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText(`Memories: ${collectedRef.current.size}/${allMemories.length}`, 20, 55);
      }

      // Proximity hints
      const needsItem = !!scene.item;
      const canCollect = !needsItem || state.itemCollected;
      ctx.font = '10px "Press Start 2P", monospace';
      for (let i = 0; i < allMemories.length; i++) {
        const animPos = memoryAnimRef.current.get(i);
        const hintX = animPos ? animPos.x : allMemories[i].x;
        const hintY = animPos ? animPos.y : allMemories[i].y;
        if (!collectedRef.current.has(i) && checkProximity(player, hintX, hintY)) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
          if (canCollect) {
            ctx.fillText('Press ENTER to collect!', hintX - 100, hintY - 40);
          } else {
            ctx.fillText('Find the trombone first!', hintX - 110, hintY - 40);
          }
        }
      }

      // Mouse hover tooltips
      const mouse = mouseRef.current;
      if (mouse) {
        for (let i = 0; i < allMemories.length; i++) {
          const mem = allMemories[i];
          if (!mem.description) continue;
          const dx = mouse.x - mem.x;
          const dy = mouse.y - mem.y;
          if (Math.sqrt(dx * dx + dy * dy) < 50) {
            const text = mem.description;
            ctx.font = '11px "Press Start 2P", monospace';
            const tw = ctx.measureText(text).width;
            const pad = 10;
            const bw = tw + pad * 2;
            const bh = 28;
            let tx = mem.x - bw / 2;
            let ty = mem.y - 60;
            tx = Math.max(8, Math.min(w - bw - 8, tx));
            ty = Math.max(8, ty);
            ctx.fillStyle = 'rgba(10, 8, 20, 0.88)';
            ctx.beginPath();
            ctx.roundRect(tx, ty, bw, bh, 5);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(tx, ty, bw, bh, 5);
            ctx.stroke();
            ctx.fillStyle = '#FFD700';
            ctx.fillText(text, tx + pad, ty + bh / 2 + 4);
            break;
          }
        }

        // Background label hover tooltips
        if (scene.backgroundLabels) {
          for (const area of scene.backgroundLabels(w, h)) {
            const dx = mouse.x - area.x;
            const dy = mouse.y - area.y;
            if (Math.sqrt(dx * dx + dy * dy) < area.radius) {
              ctx.font = '11px "Press Start 2P", monospace';
              const titleW = ctx.measureText(area.title).width;
              ctx.font = '9px "Press Start 2P", monospace';
              const subW = area.subtitle ? ctx.measureText(area.subtitle).width : 0;
              const pad = 12;
              const bw = Math.max(titleW + pad * 2, subW + pad * 2, 120);
              const bh = area.subtitle ? 46 : 28;
              let tx = area.x - bw / 2;
              let ty = area.y - bh - 14;
              tx = Math.max(8, Math.min(w - bw - 8, tx));
              ty = Math.max(8, ty);
              // Background
              ctx.fillStyle = 'rgba(8, 12, 28, 0.92)';
              ctx.beginPath();
              ctx.roundRect(tx, ty, bw, bh, 6);
              ctx.fill();
              // Gold border
              ctx.strokeStyle = 'rgba(255, 215, 0, 0.75)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.roundRect(tx, ty, bw, bh, 6);
              ctx.stroke();
              // Title
              ctx.font = '11px "Press Start 2P", monospace';
              ctx.fillStyle = '#FFD700';
              ctx.fillText(area.title, tx + pad, ty + (area.subtitle ? 18 : bh / 2 + 4));
              // Subtitle
              if (area.subtitle) {
                ctx.font = '9px "Press Start 2P", monospace';
                ctx.fillStyle = 'rgba(255, 215, 0, 0.55)';
                ctx.fillText(area.subtitle, tx + pad, ty + 36);
              }
              // Dashed connector line from tooltip to pool
              ctx.save();
              ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
              ctx.lineWidth = 1;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(area.x, ty + bh);
              ctx.lineTo(area.x, area.y);
              ctx.stroke();
              ctx.restore();
              break;
            }
          }
        }
      }

      state.animId = requestAnimationFrame(loop);
    };

    state.animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(state.animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [sceneKey, onBack]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10"
        style={{ imageRendering: 'pixelated' }}
      />
      <ControlsOverlay showTricks={sceneKey === 'japan'} />
      {viewerOpen && (
        <MemoryViewer videoSrc={viewingVideo} onClose={handleCloseViewer} />
      )}
    </>
  );
};

export default GameCanvas;
