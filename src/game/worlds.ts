import { SceneKey } from './types';

export interface WorldInfo {
  key: SceneKey;
  world: number;
  title: string;
  subtitle?: string;
  date: string;
  icon: string;
  color: string;
  /** Position on the world-select map, in % of viewport */
  x: number;
  y: number;
}

export const worlds: WorldInfo[] = [
  { key: 'castle',  world: 1, title: 'Naked Castle',       subtitle: 'Moganshan, China',   date: 'JAN 2026', icon: '🏯', color: '#3068e8', x: 18, y: 70 },
  { key: 'japan',   world: 2, title: 'Snowboarding Japan', subtitle: 'Shred the powder',   date: 'FEB 2026', icon: '⛷️', color: '#28c0e8', x: 40, y: 56 },
  { key: 'tokyo',   world: 3, title: 'Tokyo Nights',       subtitle: 'Neon & Pokémon',     date: 'MAR 2026', icon: '🗼', color: '#e81080', x: 62, y: 68 },
  { key: 'concert', world: 4, title: 'Future',             subtitle: 'Eldad & Tamir Live', date: 'DEC 2025', icon: '🎸', color: '#e84820', x: 82, y: 48 },
];

export const worldByKey = Object.fromEntries(worlds.map((w) => [w.key, w])) as Record<SceneKey, WorldInfo>;
