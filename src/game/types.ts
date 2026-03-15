export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  jumpPower: number;
  gravity: number;
  onGround: boolean;
  direction: 'left' | 'right';
  hasItem: boolean;
  snowboarding: boolean;
  jumpsRemaining: number;
  maxJumps: number;
  trick: string | null;
  trickTimer: number;
  trickRotation: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MemoryArtifact {
  x: number;
  y: number;
  type: string;
  videoSrc?: string;
  description?: string;
}

export interface SceneItem {
  x: number;
  y: number;
  type: string;
  collected: boolean;
}

export interface Scene {
  name: string;
  background: (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => void;
  platforms: (w: number, h: number) => Platform[];
  memory?: (w: number, h: number) => MemoryArtifact;
  memories?: (w: number, h: number) => MemoryArtifact[];
  drawMemory: (ctx: CanvasRenderingContext2D, mem: MemoryArtifact, time: number) => void;
  drawPlatforms?: (ctx: CanvasRenderingContext2D, platforms: Platform[]) => void;
  backgroundLabels?: (w: number, h: number) => Array<{ x: number; y: number; radius: number; title: string; subtitle?: string }>;
  item?: (w: number, h: number) => SceneItem;
  drawItem?: (ctx: CanvasRenderingContext2D, item: SceneItem) => void;
  playerStart?: (w: number, h: number) => { x: number; y: number };
  playerPhysics?: {
    jumpPower?: number;
    gravity?: number;
  };
  snowboarding?: boolean;
}

export interface GameState {
  currentScene: string | null;
  sceneCompleted: boolean;
  gameActive: boolean;
  memoryCollected: boolean;
  memoryViewerOpen: boolean;
}

export type SceneKey = 'japan' | 'castle' | 'concert' | 'tokyo';
