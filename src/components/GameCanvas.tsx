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
import SceneEditorOverlay from './SceneEditorOverlay';

interface GameCanvasProps {
  sceneKey: SceneKey;
  onBack: () => void;
}

const GameCanvas = ({ sceneKey, onBack }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingVideo, setViewingVideo] = useState<string | undefined>(undefined);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const editorModeRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
  const cinematicRef = useRef<{ startTime: number; musicStarted: boolean } | null>(null);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      cinematicRef.current = { startTime: performance.now(), musicStarted: false };
    }
  };

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
    cinematicRef.current = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setCanvasSize({ w: canvas.width, h: canvas.height });
    };
    resize();
    window.addEventListener('resize', resize);

    // Init player
    const start = scene.playerStart?.(canvas.width, canvas.height) ?? { x: 50, y: canvas.height * 0.7 };
    player.x = start.x;
    player.y = start.y;
    player.snowboarding = !!scene.snowboarding;
    player.jumpPower = scene.playerPhysics?.jumpPower ?? 15;
    player.gravity = scene.playerPhysics?.gravity ?? 0.6;
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
      if (e.key === '`') {
        const next = !editorModeRef.current;
        editorModeRef.current = next;
        setEditorMode(next);
        e.preventDefault();
        return;
      }
      if (editorModeRef.current) return;

      state.keys[e.key] = true;

      if (e.key === ' ' && !state.spacePressed) {
        state.spacePressed = true;
        tryJump(player);
        e.preventDefault();
      }

      if (e.key === 'f' || e.key === 'F') {
        player.flying = !player.flying;
        if (player.flying) player.velocityY = 0;
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
      if (!showViewerRef.current && !cinematicRef.current && !editorModeRef.current) {
        updatePlayer(player, state.keys, platforms, w, h);
        updateTrick(player);
      }
      drawPlayer(ctx, player, time);

      // Flying wings visual
      if (player.flying) {
        const wx = player.x + player.width / 2;
        const wy = player.y + player.height * 0.4;
        const t = Date.now() * 0.004;
        const flapAngle = Math.sin(t) * 0.5;
        ctx.save();
        ctx.globalAlpha = 0.82;
        // Left wing
        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(-flapAngle);
        ctx.fillStyle = '#ffe066';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-28, -18, -52, -8, -44, 14);
        ctx.bezierCurveTo(-36, 22, -10, 10, 0, 0);
        ctx.fill();
        ctx.strokeStyle = '#cc9900'; ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
        // Right wing
        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(flapAngle);
        ctx.fillStyle = '#ffe066';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(28, -18, 52, -8, 44, 14);
        ctx.bezierCurveTo(36, 22, 10, 10, 0, 0);
        ctx.fill();
        ctx.strokeStyle = '#cc9900'; ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        // HUD badge
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.beginPath(); ctx.roundRect(w - 130, 12, 110, 26, 6); ctx.fill();
        ctx.fillStyle = '#ffe066';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText('🪶 FLYING', w - 120, 30);
        ctx.restore();
      }

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

      // Cinematic countdown overlay
      const cinematic = cinematicRef.current;
      if (cinematic) {
        const elapsed = performance.now() - cinematic.startTime;

        // Start music when screen goes fully black
        if (!cinematic.musicStarted && elapsed >= 600 && audioRef.current) {
          cinematic.musicStarted = true;
          audioRef.current.play()
            .then(() => setMusicPlaying(true))
            .catch(() => {});
        }

        let alpha: number;
        if (elapsed < 600) {
          alpha = elapsed / 600;
        } else if (elapsed < 3600) {
          alpha = 1;
        } else if (elapsed < 4200) {
          alpha = 1 - (elapsed - 3600) / 600;
        } else {
          cinematicRef.current = null;
          alpha = 0;
        }

        if (alpha > 0) {
          ctx.save();
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fillRect(0, 0, w, h);

          if (elapsed >= 600 && elapsed < 3600) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Subtitle
            ctx.font = '20px "Press Start 2P", monospace';
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.fillText('The show starts in:', w / 2, h / 2 - 70);

            // Countdown digit
            const countNum = elapsed < 1600 ? '3' : elapsed < 2600 ? '2' : '1';
            const phaseStart = elapsed < 1600 ? 600 : elapsed < 2600 ? 1600 : 2600;
            const phaseProgress = (elapsed - phaseStart) / 1000;
            const scale = 1.3 - phaseProgress * 0.3;

            ctx.save();
            ctx.translate(w / 2, h / 2 + 30);
            ctx.scale(scale, scale);
            ctx.font = 'bold 96px "Press Start 2P", monospace';
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillText(countNum, 0, 0);
            ctx.restore();
          }

          ctx.restore();
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

      {/* Charizard — DOM img so the animated GIF plays natively (canvas kills animation) */}
      {sceneKey === 'tokyo' && !editorMode && (
        <>
          <style>{`
            @keyframes charizard-float {
              0%, 100% { transform: translate(0, 0); }
              50%       { transform: translate(${Math.round(canvasSize.w * 0.012)}px, ${Math.round(canvasSize.h * 0.022)}px); }
            }
          `}</style>
          <img
            src="https://img.pokemondb.net/sprites/black-white/anim/normal/charizard.gif"
            alt="Charizard"
            style={{
              position: 'fixed',
              left:   canvasSize.w * 0.908,
              top:    canvasSize.h * 0.200,
              width:  canvasSize.h * 0.131,
              height: canvasSize.h * 0.131,
              pointerEvents: 'none',
              zIndex: 12,
              imageRendering: 'pixelated',
              animation: 'charizard-float 4s ease-in-out infinite',
            }}
          />
          <img
            src="https://img.pokemondb.net/sprites/black-white/anim/normal/snorlax.gif"
            alt="Snorlax"
            style={{
              position: 'fixed',
              left:   canvasSize.w * 0.803,
              top:    canvasSize.h * 0.376,
              width:  canvasSize.h * 0.085,
              height: canvasSize.h * 0.085,
              pointerEvents: 'none',
              zIndex: 12,
              imageRendering: 'crisp-edges',
            }}
          />
        </>
      )}

      {editorMode && (
        <SceneEditorOverlay
          sceneKey={sceneKey}
          canvasW={canvasSize.w}
          canvasH={canvasSize.h}
          onDisable={() => { editorModeRef.current = false; setEditorMode(false); }}
        />
      )}
      {sceneKey === 'concert' && (
        <>
          <audio ref={audioRef} src="/JazzMusicEldadAndTamir.mp3" loop preload="auto" />
          <button
            onClick={toggleMusic}
            title={musicPlaying ? 'Pause' : 'Play'}
            style={{
              position: 'fixed',
              bottom: 72,
              right: 24,
              zIndex: 9999,
              pointerEvents: 'auto',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              userSelect: 'none',
              filter: musicPlaying
                ? 'drop-shadow(0 0 14px rgba(232,192,48,0.95)) drop-shadow(0 0 28px rgba(232,100,20,0.5))'
                : 'drop-shadow(0 0 6px rgba(232,192,48,0.5))',
              animation: musicPlaying ? 'none' : 'patifonPulse 1.4s ease-in-out infinite',
            }}
          >
            <svg width="150" height="165" viewBox="0 0 150 165">
              <defs>
                <linearGradient id="g-horn" x1="10%" y1="90%" x2="90%" y2="10%">
                  <stop offset="0%"   stopColor="#6a4008" />
                  <stop offset="30%"  stopColor="#c08820" />
                  <stop offset="60%"  stopColor="#f0d060" />
                  <stop offset="100%" stopColor="#a87020" />
                </linearGradient>
                <linearGradient id="g-tube" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#f0d060" />
                  <stop offset="100%" stopColor="#8b6010" />
                </linearGradient>
                <linearGradient id="g-cab" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#8a5020" />
                  <stop offset="50%"  stopColor="#5a3010" />
                  <stop offset="100%" stopColor="#2e1606" />
                </linearGradient>
                <radialGradient id="g-rec" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#300808" />
                  <stop offset="85%"  stopColor="#0e0404" />
                  <stop offset="100%" stopColor="#060202" />
                </radialGradient>
                <radialGradient id="g-platter" cx="50%" cy="30%" r="70%">
                  <stop offset="0%"   stopColor="#5a3a18" />
                  <stop offset="100%" stopColor="#1e0e04" />
                </radialGradient>
              </defs>

              {/* ── Cabinet / base ── */}
              <rect x="6" y="130" width="82" height="30" rx="5"
                fill="url(#g-cab)" stroke="#d09030" strokeWidth="2" />
              {/* cabinet top inlay */}
              <rect x="11" y="134" width="72" height="4" rx="2"
                fill="#a06020" opacity="0.5" />
              {/* decorative drawer */}
              <rect x="28" y="142" width="36" height="12" rx="3"
                fill="#1e0e04" stroke="#a07020" strokeWidth="1" />
              <line x1="46" y1="142" x2="46" y2="154"
                stroke="#a07020" strokeWidth="1" opacity="0.6" />
              {/* knob */}
              <circle cx="39" cy="148" r="2.5" fill="#c09030" stroke="#e8c030" strokeWidth="0.8" />
              <circle cx="53" cy="148" r="2.5" fill="#c09030" stroke="#e8c030" strokeWidth="0.8" />

              {/* ── Turntable platter (ellipse on top of cabinet) ── */}
              <ellipse cx="46" cy="130" rx="40" ry="9"
                fill="url(#g-platter)" stroke="#a07020" strokeWidth="1.5" />

              {/* ── Spinning vinyl record ── */}
              <g style={{
                transformBox: 'fill-box',
                transformOrigin: '50% 50%',
                animation: musicPlaying ? 'recordSpin 2.8s linear infinite' : 'none',
              }}>
                <circle cx="46" cy="112" r="36"
                  fill="url(#g-rec)" stroke="#2a2a2a" strokeWidth="1.5" />
                {/* grooves */}
                <circle cx="46" cy="112" r="30" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
                <circle cx="46" cy="112" r="24" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
                <circle cx="46" cy="112" r="18" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
                {/* label */}
                <circle cx="46" cy="112" r="11"
                  fill="#c41818" stroke="#ff5030" strokeWidth="1.2" />
                <circle cx="46" cy="112" r="4" fill="#0a0404" />
              </g>

              {/* ── Tonearm post ── */}
              <rect x="79" y="110" width="9" height="22" rx="4"
                fill="#5a3810" stroke="#d4a030" strokeWidth="1.5" />
              <circle cx="83.5" cy="111" r="7"
                fill="#3e2408" stroke="#e8c030" strokeWidth="2" />
              <circle cx="83.5" cy="111" r="3"
                fill="#c09030" />

              {/* ── Tonearm ── */}
              <path d="M 83 108 Q 72 93 60 84 Q 53 79 52 95"
                stroke="url(#g-tube)" strokeWidth="4.5"
                fill="none" strokeLinecap="round" />
              {/* needle */}
              <circle cx="52" cy="96" r="3"
                fill="#d0d0d0" stroke="#888" strokeWidth="1" />

              {/* ── Horn tube / neck ── */}
              <path d="M 54 88 C 62 70 68 54 76 36"
                stroke="#8b6010" strokeWidth="12"
                fill="none" strokeLinecap="round" />
              <path d="M 54 88 C 62 70 68 54 76 36"
                stroke="url(#g-tube)" strokeWidth="8"
                fill="none" strokeLinecap="round" />

              {/* ── Horn bell (morning-glory flare) ── */}
              {/* outer face */}
              <path d="
                M 74 38
                C 80 22, 96 6, 126 1
                C 140 -2, 150 2, 149 6
                C 147 12, 132 22, 118 32
                C 104 42, 88 48, 78 52
                C 75 53, 72 51, 74 46
                Z"
                fill="url(#g-horn)" stroke="#e8c030" strokeWidth="1.8" />
              {/* inner shadow for depth */}
              <path d="
                M 76 47
                C 88 41, 106 30, 122 18
                C 132 10, 142 6, 149 6
                C 146 9, 134 16, 120 26
                C 106 36, 90 44, 80 50
                Z"
                fill="rgba(0,0,0,0.22)" />
              {/* rim highlight */}
              <path d="M 126 1 C 137 -1 150 2 149 6"
                stroke="rgba(255,255,220,0.55)" strokeWidth="2"
                fill="none" strokeLinecap="round" />

              {/* ── "PRESS" label when idle ── */}
              {!musicPlaying && (
                <text x="46" y="160"
                  textAnchor="middle"
                  fill="#e8c030"
                  fontSize="7.5"
                  fontFamily='"Press Start 2P", monospace'
                  opacity="0.95">
                  ▶ PRESS
                </text>
              )}
            </svg>
          </button>
        </>
      )}
      <style>{`
        @keyframes recordSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes patifonPulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(232,192,48,0.5)); }
          50%       { filter: drop-shadow(0 0 18px rgba(232,192,48,1)) drop-shadow(0 0 34px rgba(232,100,20,0.6)); }
        }
      `}</style>
      {viewerOpen && (
        <MemoryViewer videoSrc={viewingVideo} onClose={handleCloseViewer} />
      )}
    </>
  );
};

export default GameCanvas;
