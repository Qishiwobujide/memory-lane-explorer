import { useState } from 'react';
import { SceneKey } from '@/game/types';
import MainMenu from '@/components/MainMenu';
import GameCanvas from '@/components/GameCanvas';

const Index = () => {
  const [activeScene, setActiveScene] = useState<SceneKey | null>(null);

  if (activeScene) {
    return <GameCanvas sceneKey={activeScene} onBack={() => setActiveScene(null)} />;
  }

  return <MainMenu onSelectScene={setActiveScene} />;
};

export default Index;
