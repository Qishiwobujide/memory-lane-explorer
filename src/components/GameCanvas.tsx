import { useRef, useEffect, useCallback, useState } from 'react';
import { SceneKey, SceneItem } from '@/game/types';
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
  const [memoryCollected, setMemoryCollected] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const stateRef = useRef({
    player: createPlayer(),
    keys: {} as Record<string, boolean>,
    spacePressed: false,
    itemCollected: false,
    animId: 0,
    item: null as SceneItem | null,
  });

  const handleCloseViewer = useCallback(() => {
    setShowViewer(false);
    onBack();
  }, [onBack]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const scene = scenes[sceneKey];
    if (!scene) return;

    const state = stateRef.current;
    const player = state.player;

    // Resize
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
    if (scene.item) {
      state.item = { ...scene.item(canvas.width, canvas.height) };
      state.itemCollected = false;
    }

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      state.keys[e.key] = true;

      if (e.key === ' ' && !state.spacePressed) {
        state.spacePressed = true;
        tryJump(player);
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        onBack();
      }

      if (e.key === 'Enter') {
        const platforms = scene.platforms(canvas.width, canvas.height);
        const mem = scene.memory(canvas.width, canvas.height);

        // Check item collection first
        if (state.item && !state.itemCollected && checkProximity(player, state.item.x, state.item.y)) {
          state.itemCollected = true;
          player.hasItem = true;
          state.item.collected = true;
        }

        // Check memory collection
        const needsItem = !!scene.item;
        const canCollect = !needsItem || state.itemCollected;

        if (canCollect && !memoryCollected && checkProximity(player, mem.x, mem.y)) {
          setMemoryCollected(true);
          setShowViewer(true);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      state.keys[e.key] = false;
      if (e.key === ' ') state.spacePressed = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Game loop
    const loop = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const platforms = scene.platforms(w, h);

      ctx.clearRect(0, 0, w, h);

      // Background
      scene.background(ctx, w, h, time);

      // Platforms
      drawPlatforms(ctx, platforms);

      // Item
      if (scene.drawItem && state.item && !state.itemCollected) {
        const itemPos = scene.item!(w, h);
        scene.drawItem(ctx, itemPos);
      }

      // Memory
      if (!memoryCollected) {
        const mem = scene.memory(w, h);
        scene.drawMemory(ctx, mem, time);
      }

      // Player
      if (!showViewer) {
        updatePlayer(player, state.keys, platforms, w, h);
      }
      drawPlayer(ctx, player);

      // Scene name overlay
      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillText(scene.name, 20, 30);

      // Near memory hint
      if (!memoryCollected) {
        const mem = scene.memory(w, h);
        if (checkProximity(player, mem.x, mem.y)) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
          ctx.font = '10px "Press Start 2P", monospace';
          ctx.fillText('Press ENTER to collect!', mem.x - 100, mem.y - 40);
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
    };
  }, [sceneKey, onBack, memoryCollected, showViewer]);

  // ESC to close viewer
  useEffect(() => {
    if (!showViewer) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseViewer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showViewer, handleCloseViewer]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10"
        style={{ imageRendering: 'pixelated' }}
      />
      <ControlsOverlay />
      {showViewer && (
        <MemoryViewer sceneName={sceneKey} onClose={handleCloseViewer} />
      )}
    </>
  );
};

export default GameCanvas;
