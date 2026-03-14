import { Player, Platform, GameState, SceneItem } from './types';
import { scenes } from './scenes';

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

  // Gravity
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

  const px = player.x;
  const py = player.y;
  const isGrab = player.trick === 'grab' && player.trickTimer > 0;

  // Walk / run cycle
  const step = player.onGround ? Math.sin(time * 0.012) * 3 : 0;
  const armSwing = player.onGround ? Math.sin(time * 0.012) * 5 : 0;
  const skin = '#f8c890';

  if (player.snowboarding) {
    // ═══ SNOWBOARD SUIT (same cute character, snow gear) ═════════
    const sL = Math.round(step);

    // ── BAGGY SNOW PANTS ──────────────────────────────────────────
    ctx.fillStyle = '#1a1c28';
    ctx.fillRect(px + 8 + sL,  py + 44, 13, 18);
    ctx.fillRect(px + 19 - sL, py + 44, 13, 18);
    ctx.fillStyle = '#111420'; // inner shadow
    ctx.fillRect(px + 8 + sL,  py + 44, 3, 18);
    ctx.fillRect(px + 19 - sL, py + 44, 3, 18);
    ctx.fillStyle = '#0077ee'; // outer stripe
    ctx.fillRect(px + 8 + sL,  py + 44, 2, 18);
    ctx.fillRect(px + 30 - sL, py + 44, 2, 18);
    // Knee reinforcement patches
    ctx.fillStyle = '#0f1122';
    ctx.fillRect(px + 9 + sL,  py + 50, 9, 6);
    ctx.fillRect(px + 21 - sL, py + 50, 9, 6);

    // ── CHUNKY SNOW BOOTS ─────────────────────────────────────────
    ctx.fillStyle = '#1a2240';
    ctx.fillRect(px + 6 + sL,  py + 56, 16, 7);
    ctx.fillRect(px + 19 - sL, py + 56, 16, 7);
    ctx.fillStyle = '#080c18'; // thick rubber sole
    ctx.fillRect(px + 5 + sL,  py + 60, 18, 3);
    ctx.fillRect(px + 18 - sL, py + 60, 18, 3);
    ctx.fillStyle = '#5588ee'; // strap across boot
    ctx.fillRect(px + 7 + sL,  py + 57, 12, 2);
    ctx.fillRect(px + 20 - sL, py + 57, 12, 2);
    ctx.fillStyle = '#283050'; // toe box
    ctx.fillRect(px + 6 + sL,  py + 59, 5, 4);
    ctx.fillRect(px + 19 - sL, py + 59, 5, 4);

    // ── SLEEVES (blue + orange wrist cuffs) ───────────────────────
    ctx.fillStyle = '#0055cc';
    ctx.fillRect(px + 0,  py + 22, 9, 22);
    ctx.fillRect(px + 31, py + 22, 9, 22);
    ctx.fillStyle = '#003d99';
    ctx.fillRect(px + 0,  py + 22, 3, 22);
    ctx.fillRect(px + 37, py + 22, 2, 22);
    // Quilting lines (down jacket feel)
    ctx.strokeStyle = 'rgba(0,50,160,0.55)'; ctx.lineWidth = 0.7;
    for (let q = 0; q < 4; q++) {
      ctx.beginPath(); ctx.moveTo(px + 0, py + 27 + q * 5); ctx.lineTo(px + 9,  py + 27 + q * 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px + 31, py + 27 + q * 5); ctx.lineTo(px + 40, py + 27 + q * 5); ctx.stroke();
    }
    // Orange wrist cuff
    ctx.fillStyle = '#ee6600';
    ctx.fillRect(px + 0,  py + 41, 9, 4);
    ctx.fillRect(px + 31, py + 41, 9, 4);
    ctx.fillStyle = '#cc4400';
    ctx.fillRect(px + 0,  py + 43, 9, 2);
    ctx.fillRect(px + 31, py + 43, 9, 2);

    // ── GLOVES ────────────────────────────────────────────────────
    ctx.fillStyle = '#111828';
    ctx.fillRect(px + 0,  py + 44, 9, 5);
    ctx.fillRect(px + 31, py + 44, 9, 5);
    ctx.fillStyle = '#1a2640';
    ctx.fillRect(px + 0,  py + 44, 9, 2);
    ctx.fillRect(px + 31, py + 44, 9, 2);

    // ── JACKET BODY ───────────────────────────────────────────────
    // Orange shoulder bar
    ctx.fillStyle = '#ee6600';
    ctx.fillRect(px + 5, py + 21, 30, 7);
    ctx.fillStyle = '#cc4400';
    ctx.fillRect(px + 5, py + 26, 30, 2);
    // Blue main body
    ctx.fillStyle = '#0055cc';
    ctx.fillRect(px + 6, py + 28, 28, 18);
    ctx.fillStyle = '#003d99';
    ctx.fillRect(px + 6,  py + 28, 5, 18);
    ctx.fillRect(px + 29, py + 28, 5, 18);
    // Quilting lines
    ctx.strokeStyle = 'rgba(0,40,140,0.5)'; ctx.lineWidth = 0.8;
    for (let q = 0; q < 4; q++) {
      ctx.beginPath(); ctx.moveTo(px + 6, py + 31 + q * 4); ctx.lineTo(px + 34, py + 31 + q * 4); ctx.stroke();
    }
    // Centre chest panel
    ctx.fillStyle = '#c8deff';
    ctx.fillRect(px + 15, py + 28, 10, 17);
    ctx.fillStyle = '#003d99';
    ctx.fillRect(px + 15, py + 28, 2, 17);
    ctx.fillRect(px + 23, py + 28, 2, 17);
    // Zipper
    ctx.strokeStyle = '#4477cc'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(px + 20, py + 28); ctx.lineTo(px + 20, py + 46); ctx.stroke();
    ctx.fillStyle = '#88aaee'; ctx.fillRect(px + 19, py + 34, 2, 4);
    // Brand dot (orange circle on chest)
    ctx.fillStyle = '#ee6600';
    ctx.beginPath(); ctx.arc(px + 11, py + 32, 2.5, 0, Math.PI * 2); ctx.fill();

    // ── HIGH TURTLENECK COLLAR ────────────────────────────────────
    ctx.fillStyle = '#0f1422';
    ctx.fillRect(px + 13, py + 18, 14, 11);
    ctx.fillStyle = '#1a2440';
    ctx.fillRect(px + 13, py + 18, 3, 11);
    ctx.fillStyle = '#252840'; // collar roll at top
    ctx.fillRect(px + 13, py + 18, 14, 3);

  } else {
    // ═══ CUTE CARTOON — red shirt + blue shorts ═══════════════════

    // ── CHUBBY LEGS ────────────────────────────────────────────
    ctx.fillStyle = '#55aadd';   // blue shorts overlap legs
    ctx.fillRect(px + 8,  py + 40, 24, 10);   // shorts
    ctx.fillStyle = '#3388cc';
    ctx.fillRect(px + 8,  py + 40, 4,  10);   // shorts shading
    // Left leg
    ctx.fillStyle = skin;
    ctx.fillRect(px + 9  + Math.round(step), py + 48, 9, 9);
    ctx.fillStyle = 'rgba(200,130,70,0.25)';
    ctx.fillRect(px + 9  + Math.round(step), py + 48, 3, 9);
    // Right leg
    ctx.fillStyle = skin;
    ctx.fillRect(px + 22 - Math.round(step), py + 48, 9, 9);
    ctx.fillStyle = 'rgba(200,130,70,0.25)';
    ctx.fillRect(px + 22 - Math.round(step), py + 48, 3, 9);

    // ── DARK SHOES with white sole ─────────────────────────────
    ctx.fillStyle = '#1a1a30';
    ctx.fillRect(px + 7  + Math.round(step), py + 55, 13, 5);
    ctx.fillRect(px + 20 - Math.round(step), py + 55, 13, 5);
    ctx.fillStyle = '#ddddee';   // white sole
    ctx.fillRect(px + 7  + Math.round(step), py + 57, 13, 3);
    ctx.fillRect(px + 20 - Math.round(step), py + 57, 13, 3);

    // ── ARMS (swing with walk cycle) ───────────────────────────
    const aOff = Math.round(armSwing / 3);
    // Left arm
    ctx.fillStyle = '#dd2020';   // red sleeve
    ctx.fillRect(px + 1, py + 23 - aOff, 8, 8);
    ctx.fillStyle = skin;
    ctx.fillRect(px + 1, py + 31 - aOff, 8, 10);
    // Left fist
    ctx.beginPath(); ctx.arc(px + 5, py + 41 - aOff, 4.5, 0, Math.PI * 2); ctx.fill();
    // Right arm
    ctx.fillStyle = '#dd2020';
    ctx.fillRect(px + 31, py + 23 + aOff, 8, 8);
    ctx.fillStyle = skin;
    ctx.fillRect(px + 31, py + 31 + aOff, 8, 10);
    // Right fist
    ctx.beginPath(); ctx.arc(px + 35, py + 41 + aOff, 4.5, 0, Math.PI * 2); ctx.fill();

    // ── RED SHIRT BODY ─────────────────────────────────────────
    ctx.fillStyle = '#dd2020';
    ctx.fillRect(px + 7, py + 23, 26, 19);
    ctx.fillStyle = '#bb1010';   // side shading
    ctx.fillRect(px + 7,  py + 23, 4, 19);
    ctx.fillRect(px + 29, py + 23, 4, 19);
    // Shirt highlight stripe
    ctx.fillStyle = 'rgba(255,100,80,0.3)';
    ctx.fillRect(px + 14, py + 24, 12, 3);

    // Black armband on left sleeve
    ctx.fillStyle = '#111111';
    ctx.fillRect(px + 1, py + 27 - aOff, 8, 4);
    ctx.fillStyle = '#222222';
    ctx.fillRect(px + 1, py + 27 - aOff, 8, 1.5);

    // ── NECK ───────────────────────────────────────────────────
    ctx.fillStyle = skin;
    ctx.fillRect(px + 16, py + 20, 8, 5);
  }

  // ── FLUFFY ORANGE HAIR — back layer (behind head) ─────────────
  ctx.fillStyle = '#cc5500';
  ctx.beginPath(); ctx.arc(px + 11, py + 6,  7.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 29, py + 6,  7.5, 0, Math.PI * 2); ctx.fill();

  // ── ROUND CHUBBY HEAD ─────────────────────────────────────────
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(px + 20, py + 12, 11, 0, Math.PI * 2); ctx.fill();
  // Cheek puff blush
  ctx.fillStyle = 'rgba(240,100,55,0.18)';
  ctx.beginPath(); ctx.ellipse(px + 28, py + 14, 5,  3.5, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(px + 12, py + 14, 5,  3.5, -0.2, 0, Math.PI * 2); ctx.fill();

  // ── FLUFFY ORANGE HAIR — front puffs (drawn over head edges) ──
  ctx.fillStyle = '#ee7700';
  ctx.beginPath(); ctx.arc(px + 9,  py + 7,  6.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 31, py + 7,  6.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 14, py + 2,  6.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 26, py + 2,  6.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff9922';
  ctx.beginPath(); ctx.arc(px + 20, py + 0,  6,   0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 16, py - 1,  4.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 24, py - 1,  4.5, 0, Math.PI * 2); ctx.fill();
  // Hair highlight
  ctx.fillStyle = '#ffaa33';
  ctx.beginPath(); ctx.arc(px + 18, py + 1, 3.5, Math.PI + 0.5, -0.5); ctx.fill();
  // Hair edge line (defines top of forehead)
  ctx.fillStyle = '#cc5500';
  ctx.fillRect(px + 11, py + 14, 18, 2);

  // ── BIG CARTOON EYES ──────────────────────────────────────────
  // Whites
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(px + 15, py + 11, 4.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(px + 25, py + 11, 4.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
  // Blue iris
  ctx.fillStyle = '#2299ee';
  ctx.beginPath(); ctx.arc(px + 15, py + 12, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 25, py + 12, 3.2, 0, Math.PI * 2); ctx.fill();
  // Dark pupils
  ctx.fillStyle = '#0a0818';
  ctx.beginPath(); ctx.arc(px + 15.5, py + 12.5, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 25.5, py + 12.5, 1.8, 0, Math.PI * 2); ctx.fill();
  // Large shine + small shine
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(px + 16.5, py + 10.5, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 26.5, py + 10.5, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.arc(px + 14,   py + 13.5, 0.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 24,   py + 13.5, 0.6, 0, Math.PI * 2); ctx.fill();

  // ── EYEBROWS (arched, orange-brown) ───────────────────────────
  ctx.strokeStyle = '#995522'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(px + 15, py + 6.5, 4, Math.PI + 0.45, -0.45); ctx.stroke();
  ctx.beginPath(); ctx.arc(px + 25, py + 6.5, 4, Math.PI + 0.45, -0.45); ctx.stroke();

  // ── BUTTON NOSE ───────────────────────────────────────────────
  ctx.fillStyle = 'rgba(210,120,65,0.5)';
  ctx.beginPath(); ctx.ellipse(px + 20, py + 16, 2.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

  // ── WIDE CUTE SMILE ───────────────────────────────────────────
  ctx.strokeStyle = '#bb6030'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(px + 20, py + 17, 4.5, 0.3, Math.PI - 0.3); ctx.stroke();

  // ── HELMET + GOGGLES (snowboarding only) ─────────────────────
  if (player.snowboarding) {
    // Helmet dome (sits atop the fluffy hair)
    ctx.fillStyle = '#0f1422';
    ctx.beginPath(); ctx.arc(px + 20, py + 9, 11, Math.PI, 0); ctx.fill();
    ctx.fillRect(px + 9, py + 9, 22, 9);
    // Orange accent stripe on helmet
    ctx.fillStyle = '#ee6600';
    ctx.fillRect(px + 10, py + 15, 20, 3);
    ctx.fillStyle = '#cc4400';
    ctx.fillRect(px + 10, py + 17, 20, 1);
    // Vent slots
    ctx.fillStyle = '#060810';
    for (let v = 0; v < 3; v++) ctx.fillRect(px + 13 + v * 5, py + 4, 3, 5);

    // Orange hair puffs peeking out from sides + top (drawn AFTER helmet)
    ctx.fillStyle = '#ee7700';
    ctx.beginPath(); ctx.arc(px + 9,  py + 8, 6, Math.PI * 0.3, Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(px + 31, py + 8, 6, 0, Math.PI * 0.7); ctx.fill();
    ctx.fillStyle = '#ff9922';
    ctx.beginPath(); ctx.arc(px + 20, py - 1, 5.5, Math.PI + 0.5, -0.5); ctx.fill();

    // Goggle strap
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(px + 9, py + 14, 22, 5);
    // Goggle lens (amber)
    ctx.fillStyle = 'rgba(255,148,18,0.92)';
    ctx.beginPath(); ctx.ellipse(px + 20, py + 16, 9.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    // Lens highlight
    ctx.fillStyle = 'rgba(255,235,130,0.5)';
    ctx.beginPath(); ctx.ellipse(px + 17, py + 14.5, 4.5, 2, -0.2, 0, Math.PI * 2); ctx.fill();
    // Goggle frame
    ctx.strokeStyle = '#05050a'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(px + 20, py + 16, 9.5, 4.5, 0, 0, Math.PI * 2); ctx.stroke();
  }

  // ── REALISTIC SNOWBOARD ───────────────────────────────────────
  if (player.snowboarding) {
    const sbL   = px - 18;                    // wider for realism
    const sbR   = px + player.width + 18;
    const sbW   = sbR - sbL;
    const sbMid = (sbL + sbR) / 2;
    const sbY   = py + player.height - 2;
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
  const tagY = player.y - 50;
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
