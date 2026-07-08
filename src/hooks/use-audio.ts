import { useCallback, useSyncExternalStore } from 'react';
import { audio } from '@/game/audio';

export function useMuted(): [boolean, () => void] {
  const muted = useSyncExternalStore(audio.subscribe, audio.isMuted);
  const toggle = useCallback(() => {
    audio.toggleMuted();
  }, []);
  return [muted, toggle];
}
