// Session-only progress: lives in module memory, persists across scene/menu
// switches within the tab, resets on page refresh (by design — no localStorage).

import { SceneKey } from './types';
import { memoriesByScene, memoryRegistry } from './memoryRegistry';

const collected = new Map<SceneKey, Set<number>>();
const listeners = new Set<() => void>();
let version = 0;

const EMPTY: ReadonlySet<number> = new Set();

function notify() {
  version++;
  listeners.forEach((cb) => cb());
}

export function markCollected(scene: SceneKey, index: number): void {
  let set = collected.get(scene);
  if (!set) {
    set = new Set();
    collected.set(scene, set);
  }
  if (!set.has(index)) {
    set.add(index);
    notify();
  }
}

export function getCollected(scene: SceneKey): ReadonlySet<number> {
  return collected.get(scene) ?? EMPTY;
}

export function getSceneTotals(scene: SceneKey): { collected: number; total: number } {
  return {
    collected: collected.get(scene)?.size ?? 0,
    total: memoriesByScene[scene]?.length ?? 0,
  };
}

export function getOverallTotals(): { collected: number; total: number } {
  let n = 0;
  collected.forEach((set) => (n += set.size));
  return { collected: n, total: memoryRegistry.length };
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Monotonic counter — snapshot for useSyncExternalStore. */
export function getVersion(): number {
  return version;
}

export function resetProgress(): void {
  collected.clear();
  notify();
}
