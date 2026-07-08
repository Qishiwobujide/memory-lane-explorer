import { scenes } from './scenes';
import { SceneKey } from './types';
import { worlds } from './worlds';

export interface MemoryMeta {
  sceneKey: SceneKey;
  index: number;
  type: string;
  videoSrc?: string;
  description?: string;
}

/** Short display names per memory `type` (album tiles, viewer titles). */
export const memoryTitles: Record<string, string> = {
  // japan
  snowboard: 'First Run',
  helmet: 'Geared Up',
  gate: 'Torii Gate',
  // castle
  chalet: 'Bamboo Chalet',
  mg: 'MG Sports Car',
  castle: 'Naked Castle',
  // concert
  future: 'Future Show',
  jasons: "At Jason's",
  // tokyo
  pikachu: 'Pikachu',
  snorlax: 'Snorlax',
  charizard: 'Charizard',
  scream_tail: 'Scream Tail',
  shibuya: 'Shibuya Crossing',
};

export function memoryTitle(meta: { type: string; description?: string }): string {
  return memoryTitles[meta.type] ?? (meta.description ? meta.description.slice(0, 24) : 'Memory');
}

// Memory metadata (type/videoSrc/description) is static in every scene —
// only x/y depend on the canvas size — so extracting it once with a nominal
// size is safe.
const NOMINAL_W = 1920;
const NOMINAL_H = 1080;

function extract(sceneKey: SceneKey): MemoryMeta[] {
  const scene = scenes[sceneKey];
  if (!scene) return [];
  const mems = scene.memories
    ? scene.memories(NOMINAL_W, NOMINAL_H)
    : scene.memory
      ? [scene.memory(NOMINAL_W, NOMINAL_H)]
      : [];
  return mems.map((m, index) => ({
    sceneKey,
    index,
    type: m.type,
    videoSrc: m.videoSrc,
    description: m.description,
  }));
}

export const memoriesByScene = Object.fromEntries(
  worlds.map((w) => [w.key, extract(w.key)])
) as Record<SceneKey, MemoryMeta[]>;

export const memoryRegistry: MemoryMeta[] = worlds.flatMap((w) => memoriesByScene[w.key]);
