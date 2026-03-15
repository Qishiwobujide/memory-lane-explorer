import { Player, Platform, GameState, SceneItem } from './types';
import { scenes } from './scenes';

// Preload all 24 Forest Ranger walking frames
const walkFrames: HTMLImageElement[] = [];
(function loadWalkFrames() {
  for (let i = 0; i < 24; i++) {
    const img = new Image();
    img.src = `/Walking/0_Forest_Ranger_Walking_${String(i).padStart(3, '0')}.png`;
    walkFrames.push(img);
  }
})();

export function createPlayer(): Player {
  return {
    x: 50,
    y: 300,
    width: 40,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 15,
    gravity: 0.6,
    onGround: false,
    direction: 'right',
    hasItem: false,
    snowboarding: false,
    jumpsRemaining: 3,
    maxJumps: 3,
    trick: null,
    trickTimer: 0,
    trickRotation: 0,
    flying: false,
  };
}

export function createGameState(): GameState {
  return {
    currentScene: null,
    sceneCompleted: false,
    gameActive: false,
    memoryCollected: false,
    memoryViewerOpen: false,
  };
}

export function updatePlayer(
  player: Player,
  keys: Record<string, boolean>,
  platforms: Platform[],
  canvasW: number,
  canvasH: number
) {
  // Horizontal movement
  if (player.snowboarding) {
    player.velocityX = 2;
    if (keys['ArrowLeft']) player.velocityX = -player.speed;
    if (keys['ArrowRight']) player.velocityX = player.speed + 2;
  } else {
    player.velocityX = 0;
    if (keys['ArrowLeft']) {
      player.velocityX = -player.speed;
      player.direction = 'left';
    }
    if (keys['ArrowRight']) {
      player.velocityX = player.speed;
      player.direction = 'right';
    }
  }

  if (player.flying) {
    // Flight mode — no gravity, full directional control
    player.velocityY = 0;
    if (keys['ArrowUp'] || keys[' ']) player.velocityY = -player.speed;
    if (keys['ArrowDown'])            player.velocityY =  player.speed;
    player.x += player.velocityX;
    player.y += player.velocityY;
    player.onGround = false;
    // Clamp vertically so player can't fly off screen
    player.y = Math.max(0, Math.min(canvasH - player.height, player.y));
  } else {
    // Normal physics
    player.velocityY += player.gravity;
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Platform collision
    player.onGround = false;
    for (const p of platforms) {
      if (
        player.x + player.width > p.x &&
        player.x < p.x + p.width &&
        player.y + player.height > p.y &&
        player.y + player.height < p.y + 20 &&
        player.velocityY >= 0
      ) {
        player.y = p.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
        player.jumpsRemaining = player.maxJumps;
      }
    }

    // Ground collision
    if (player.y + player.height > canvasH) {
      player.y = canvasH - player.height;
      player.velocityY = 0;
      player.onGround = true;
      player.jumpsRemaining = player.maxJumps;
    }
  }

  // Boundaries
  player.x = Math.max(0, Math.min(canvasW - player.width, player.x));
}

export function tryJump(player: Player) {
  if (player.jumpsRemaining > 0) {
    player.velocityY = -player.jumpPower;
    player.jumpsRemaining--;
    player.onGround = false;
  }
}

export function startTrick(player: Player, trick: 'flip' | 'grab' | 'spin') {
  if (!player.onGround && player.snowboarding && !player.trick) {
    player.trick = trick;
    player.trickTimer = 30; // frames
    player.trickRotation = 0;
  }
}

export function updateTrick(player: Player) {
  if (player.trick && player.trickTimer > 0) {
    player.trickTimer--;
    player.trickRotation += Math.PI * 2 / 30; // full rotation over 30 frames
    if (player.trickTimer <= 0) {
      player.trick = null;
      player.trickRotation = 0;
    }
  }
  // Cancel trick on landing
  if (player.onGround && player.trick) {
    player.trick = null;
    player.trickTimer = 0;
    player.trickRotation = 0;
  }
}

export function checkProximity(
  player: Player,
  targetX: number,
  targetY: number,
  radius: number = 80
): boolean {
  const dx = player.x + player.width / 2 - targetX;
  const dy = player.y + player.height / 2 - targetY;
  return Math.sqrt(dx * dx + dy * dy) < radius;
}

export function drawPlatforms(ctx: CanvasRenderingContext2D, platforms: Platform[]) {
  ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
  for (const p of platforms) {
    ctx.fillRect(p.x, p.y, p.width, p.height);
    // Top highlight
    ctx.fillStyle = 'rgba(139, 69, 19, 0.9)';
    ctx.fillRect(p.x, p.y, p.width, 4);
    ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
  }
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player, time: number = 0) {
  ctx.save();
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;

  // Trick rotation (snowboard tricks)
  if (player.trick && player.trickTimer > 0) {
    ctx.translate(cx, cy);
    if (player.trick === 'flip') {
      ctx.rotate(player.trickRotation);
    } else if (player.trick === 'spin') {
      ctx.scale(Math.cos(player.trickRotation * 2), 1);
    }
    ctx.translate(-cx, -cy);
  }

  // Face direction
  if (player.direction === 'left' && !(player.trick === 'spin' && player.trickTimer > 0)) {
    ctx.translate(cx, cy);
    ctx.scale(-1, 1);
    ctx.translate(-cx, -cy);
  }

  // Snowboard lean
  if (player.snowboarding) {
    ctx.translate(cx, cy + 8);
    ctx.rotate(-0.18);
    ctx.translate(-cx, -cy - 8);
  }

  // Scale up the visual (collision box stays the same)
  ctx.translate(cx, cy);
  ctx.scale(1.3, 1.3);
  ctx.translate(-cx, -cy);

  // ── FOREST RANGER SPRITE ──────────────────────────────────────
  const isMoving = Math.abs(player.velocityX) > 0.1;
  const frameIdx = isMoving ? Math.floor(time / 60) % 24 : 0;
  const frame = walkFrames[frameIdx];

  // Size the sprite: wider than collision box, bottom-anchored
  // Push sprite down a bit when snowboarding so feet meet the board
  const sprW = player.width * 2.2;
  const sprH = player.height * 2.2;
  const sprX = player.x + player.width / 2 - sprW / 2;
  const sprY = player.y + player.height - sprH + (player.snowboarding ? 18 : 0);

  if (frame && frame.complete && frame.naturalWidth > 0) {
    ctx.drawImage(frame, sprX, sprY, sprW, sprH);
  }

  // ── REALISTIC SNOWBOARD ───────────────────────────────────────
  if (player.snowboarding) {
    const sbL   = player.x - 18;             // wider for realism
    const sbR   = player.x + player.width + 18;
    const sbW   = sbR - sbL;
    const sbMid = (sbL + sbR) / 2;
    const sbY   = player.y + player.height - 14;
    const sbH   = 11;                         // thicker board

    // Snow shadow
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(sbMid + 3, sbY + sbH + 4, sbW * 0.42, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Board full silhouette (base layer) ───────────────────
    // Nose curves up more steeply than tail (directional board)
    ctx.fillStyle = '#0d0d18';
    ctx.beginPath();
    ctx.moveTo(sbL + 7,   sbY + sbH);                                          // tail bottom
    ctx.quadraticCurveTo(sbL - 4, sbY + sbH, sbL - 5, sbY + sbH - 6);         // tail upturn
    ctx.lineTo(sbL + 1,   sbY - 1);                                            // tail top
    ctx.lineTo(sbR - 1,   sbY - 2);                                            // nose top (higher)
    ctx.lineTo(sbR + 5,   sbY + sbH - 7);                                      // nose upturn
    ctx.quadraticCurveTo(sbR + 4, sbY + sbH, sbR - 7, sbY + sbH);             // nose bottom
    ctx.closePath();
    ctx.fill();

    // ── Base (bottom face) — dark with subtle base graphic ───
    // Base colour shows 3D thickness along bottom edge
    const baseG = ctx.createLinearGradient(0, sbY + sbH - 2, 0, sbY + sbH);
    baseG.addColorStop(0, '#1a1a2e'); baseG.addColorStop(1, '#0a0a14');
    ctx.fillStyle = baseG;
    ctx.fillRect(sbL + 7, sbY + sbH - 2, sbW - 14, 2);

    // ── Deck graphic — full top surface ──────────────────────
    // Main deck (blue)
    ctx.fillStyle = '#0044bb';
    ctx.fillRect(sbL + 1, sbY, sbW - 2, sbH - 3);

    // Tail block (orange, matches jacket)
    ctx.fillStyle = '#ee6600';
    ctx.fillRect(sbL + 1, sbY, 20, sbH - 3);
    ctx.fillStyle = '#cc4400';
    ctx.fillRect(sbL + 1, sbY + (sbH - 3) / 2, 20, (sbH - 3) / 2);

    // Nose block (orange)
    ctx.fillStyle = '#ee6600';
    ctx.fillRect(sbR - 21, sbY, 20, sbH - 3);
    ctx.fillStyle = '#cc4400';
    ctx.fillRect(sbR - 21, sbY + (sbH - 3) / 2, 20, (sbH - 3) / 2);

    // Centre logo/graphic strip (white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sbMid - 12, sbY + 2, 24, sbH - 6);
    ctx.fillStyle = '#0033aa';
    ctx.fillRect(sbMid - 10, sbY + 3, 20, sbH - 8);

    // ── Metal edges (most realistic detail) ──────────────────
    ctx.strokeStyle = '#d8dce0'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sbL + 1, sbY); ctx.lineTo(sbR - 1, sbY - 1); ctx.stroke();
    ctx.strokeStyle = '#b0b4b8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(sbL + 7, sbY + sbH); ctx.lineTo(sbR - 7, sbY + sbH); ctx.stroke();

    // ── Bindings ─────────────────────────────────────────────
    for (const bxb of [sbL + sbW * 0.32, sbL + sbW * 0.62]) {
      // Base disc / footbed
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath(); ctx.ellipse(bxb, sbY + (sbH - 3) / 2, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
      // High-back (angled plate at heel)
      ctx.fillStyle = '#2a2a40';
      ctx.beginPath();
      ctx.moveTo(bxb + 5, sbY - 1);
      ctx.lineTo(bxb + 8, sbY - 9);
      ctx.lineTo(bxb + 10, sbY - 8);
      ctx.lineTo(bxb + 7, sbY);
      ctx.fill();
      // Toe strap (blue)
      ctx.fillStyle = '#0055cc';
      ctx.beginPath(); ctx.roundRect(bxb - 7, sbY - 1, 14, 3, 1.5); ctx.fill();
      ctx.fillStyle = '#003d99';
      ctx.beginPath(); ctx.roundRect(bxb - 7, sbY - 1, 14, 1, 1); ctx.fill();
      // Ankle strap (orange, matches jacket accent)
      ctx.fillStyle = '#ee6600';
      ctx.beginPath(); ctx.roundRect(bxb - 6, sbY + 3, 12, 3, 1.5); ctx.fill();
      ctx.fillStyle = '#cc4400';
      ctx.beginPath(); ctx.roundRect(bxb - 6, sbY + 3, 12, 1, 1); ctx.fill();
      // Ratchet buckle
      ctx.fillStyle = '#c0c4cc';
      ctx.fillRect(bxb + 4, sbY - 1, 3, 3);
      ctx.fillStyle = '#888890';
      ctx.fillRect(bxb + 5, sbY, 1, 2);
    }
  }

  // ── TROMBONE INDICATOR ────────────────────────────────────────
  if (player.hasItem) {
    ctx.font = '16px serif';
    ctx.fillText('🎺', player.x + 28, player.y + 30);
  }

  ctx.restore();

  // ── NAME TAG ─────────────────────────────────────────────────
  // Drawn after restore — always upright, never flipped with the character
  const tagLabel = 'Dandan';
  const tagFont = '16px "Press Start 2P", monospace';
  ctx.font = tagFont;
  const tagTw = ctx.measureText(tagLabel).width;
  const tagPad = 14;
  const tagW = tagTw + tagPad * 2;
  const tagH = 32;
  const tagCx = player.x + player.width / 2;
  const tagX = tagCx - tagW / 2;
  const tagY = player.y - 90;
  const tagMidY = tagY + tagH / 2;

  // Outer ambient glow (wide soft halo)
  const halo = ctx.createRadialGradient(tagCx, tagMidY, 0, tagCx, tagMidY, tagW * 0.85);
  halo.addColorStop(0,   'rgba(255, 200, 40, 0.28)');
  halo.addColorStop(0.5, 'rgba(255, 160, 10, 0.12)');
  halo.addColorStop(1,   'transparent');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(tagCx, tagMidY, tagW * 0.85, tagH * 1.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath();
  ctx.roundRect(tagX + 3, tagY + 5, tagW, tagH, 8);
  ctx.fill();

  // Badge fill
  ctx.fillStyle = 'rgba(6, 4, 18, 0.94)';
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, 8);
  ctx.fill();

  // Gold border with glow
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 16;
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, 8);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Text — black outline pass for crisp edges
  ctx.font = tagFont;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.strokeText(tagLabel, tagX + tagPad, tagY + tagH - 8);

  // Text — bright white fill
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(tagLabel, tagX + tagPad, tagY + tagH - 8);
}
