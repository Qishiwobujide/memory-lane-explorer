import { useCallback, useEffect, useRef, useState } from 'react';
import { SceneKey } from '@/game/types';
import { worldByKey, WorldInfo } from '@/game/worlds';
import { audio } from '@/game/audio';
import MainMenu from '@/components/MainMenu';
import GameCanvas from '@/components/GameCanvas';
import SceneTransition, { TransitionPhase } from '@/components/SceneTransition';

const FADE_OUT_MS = 350;
const FADE_IN_MS = 450;

const Index = () => {
  const [activeScene, setActiveScene] = useState<SceneKey | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [banner, setBanner] = useState<WorldInfo | null>(null);
  const [bannerKey, setBannerKey] = useState(0);
  const transitioningRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  // Unlock the AudioContext on the first user gesture (autoplay policy).
  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const requestScene = useCallback((key: SceneKey | null) => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    setPhase('out');

    timersRef.current.push(
      window.setTimeout(() => {
        setActiveScene(key);
        if (key) {
          setBanner(worldByKey[key]);
          setBannerKey((k) => k + 1);
        } else {
          setBanner(null);
        }
        setPhase('in');

        timersRef.current.push(
          window.setTimeout(() => {
            setPhase('idle');
            transitioningRef.current = false;
          }, FADE_IN_MS)
        );
      }, FADE_OUT_MS)
    );
  }, []);

  return (
    <>
      {activeScene ? (
        <GameCanvas sceneKey={activeScene} onBack={() => requestScene(null)} />
      ) : (
        <MainMenu onSelectScene={requestScene} />
      )}
      <SceneTransition phase={phase} banner={banner} bannerKey={bannerKey} />
    </>
  );
};

export default Index;
