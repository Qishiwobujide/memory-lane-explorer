import { WorldInfo } from '@/game/worlds';
import MuteButton from './MuteButton';

interface GameHudProps {
  world: WorldInfo;
  collected: number;
  total: number;
  flying: boolean;
  onPause: () => void;
}

const GameHud = ({ world, collected, total, flying, onPause }: GameHudProps) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] pointer-events-none flex items-start justify-between px-4 pt-3"
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      <style>{`
        @keyframes hud-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        @keyframes hud-flap {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-2px); }
        }
      `}</style>

      {/* Left: world chip + scene title */}
      <div className="flex items-center gap-2">
        <span
          className="px-2 py-1.5 text-[10px]"
          style={{
            background: world.color,
            border: '2px solid rgba(0,0,0,0.4)',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
            color: '#fff',
            textShadow: '1px 1px 0 rgba(0,0,0,0.7)',
            borderRadius: 4,
          }}
        >
          W{world.world}
        </span>
        <span
          className="px-3 py-1.5 text-[10px]"
          style={{
            background: 'rgba(10, 8, 20, 0.85)',
            border: '2px solid rgba(248,224,48,0.6)',
            color: '#f8e030',
            textShadow: '1px 1px 0 #8b5e00',
            borderRadius: 4,
            letterSpacing: 1,
          }}
        >
          {world.icon} {world.title.toUpperCase()}
        </span>
      </div>

      {/* Right: counter, flying, mute, pause */}
      <div className="flex items-center gap-2">
        {flying && (
          <span
            className="px-2 py-1.5 text-[9px]"
            style={{
              background: 'rgba(10, 8, 20, 0.85)',
              border: '2px solid rgba(255,224,102,0.7)',
              color: '#ffe066',
              borderRadius: 4,
              animation: 'hud-flap 0.9s ease-in-out infinite',
            }}
          >
            🪶 FLYING
          </span>
        )}
        {total > 0 && (
          <span
            key={collected}
            className="px-3 py-1.5 text-[10px] inline-block"
            style={{
              background: 'rgba(10, 8, 20, 0.85)',
              border: '2px solid rgba(248,224,48,0.6)',
              color: '#ffd700',
              borderRadius: 4,
              letterSpacing: 1,
              animation: 'hud-pop 0.35s ease',
            }}
          >
            ✦ {collected}/{total}
          </span>
        )}
        <MuteButton />
        <button
          onClick={onPause}
          title="Pause (Esc)"
          aria-label="Pause"
          className="pointer-events-auto cursor-pointer px-2 py-1.5 text-[11px] leading-none bg-card/90 border border-primary/40 hover:border-primary/80 transition-colors"
          style={{ borderRadius: 'var(--radius)', fontFamily: 'inherit', color: '#f8e030' }}
        >
          ⏸
        </button>
      </div>
    </div>
  );
};

export default GameHud;
