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

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  ctx.save();
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;

  if (player.direction === 'left') {
    ctx.translate(cx, cy);
    ctx.scale(-1, 1);
    ctx.translate(-cx, -cy);
  }

  // Body
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(player.x + 8, player.y + 15, 24, 30);

  // Head
  ctx.fillStyle = '#FFDAB9';
  ctx.beginPath();
  ctx.arc(player.x + 20, player.y + 12, 12, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(player.x + 16, player.y + 10, 2, 0, Math.PI * 2);
  ctx.arc(player.x + 24, player.y + 10, 2, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.fillStyle = '#4A90D9';
  ctx.fillRect(player.x + 10, player.y + 45, 8, 15);
  ctx.fillRect(player.x + 22, player.y + 45, 8, 15);

  // Snowboard
  if (player.snowboarding) {
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(player.x - 5, player.y + player.height - 4, player.width + 10, 6);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.strokeRect(player.x - 5, player.y + player.height - 4, player.width + 10, 6);
  }

  // Trombone indicator
  if (player.hasItem) {
    ctx.font = '16px serif';
    ctx.fillText('🎺', player.x + 28, player.y + 30);
  }

  ctx.restore();
}
