import { SceneKey } from '@/game/types';

interface MainMenuProps {
  onSelectScene: (scene: SceneKey) => void;
}

const menuItems: { key: SceneKey; emoji: string; title: string; date: string }[] = [
  { key: 'japan', emoji: '⛷️', title: 'Snowboarding in Japan', date: 'Feb/March 2026' },
  { key: 'castle', emoji: '🏯', title: 'Naked Castle, Moganshan', date: 'January 2026' },
  { key: 'concert', emoji: '🎸', title: 'Eldad & Tamir Live', date: 'December 2025' },
  { key: 'jazz', emoji: '🌍🎷', title: 'Jazz Nights Around the World', date: 'The Future' },
];

const MainMenu = ({ onSelectScene }: MainMenuProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(233 80% 66% / 0.3), hsl(275 38% 49% / 0.3))',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        <h1 className="text-xl sm:text-2xl text-primary text-gold-shadow tracking-wider text-center">
          ELDAD'S MEMORIES
        </h1>

        <div className="flex flex-col gap-3 w-full max-w-md">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelectScene(item.key)}
              className="group relative border-2 border-primary bg-card/80 px-4 py-3 text-left transition-all duration-300 hover:bg-primary/20 hover:scale-105 hover:shadow-[0_0_30px_hsl(45_100%_50%_/_0.3)]"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.emoji}</span>
                <div>
                  <p className="text-[10px] sm:text-xs text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[7px] sm:text-[8px] text-muted-foreground mt-1">
                    {item.date}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
