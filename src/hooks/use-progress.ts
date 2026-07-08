import { useSyncExternalStore } from 'react';
import { subscribe, getVersion } from '@/game/progress';

/**
 * Re-renders the component whenever progress changes; returns the version.
 * Read progress via the getters in '@/game/progress' after calling this.
 */
export function useProgress(): number {
  return useSyncExternalStore(subscribe, getVersion);
}
