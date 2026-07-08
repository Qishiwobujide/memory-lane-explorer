import { WorldInfo } from '@/game/worlds';

export type TransitionPhase = 'idle' | 'out' | 'in';

interface SceneTransitionProps {
  phase: TransitionPhase;
  /** World banner shown while fading into a scene; null when returning to the map. */
  banner: WorldInfo | null;
  /** Changes every world entry so the banner animation re-runs. */
  bannerKey: number;
}

const SceneTransition = ({ phase, banner, bannerKey }: SceneTransitionProps) => {
  return (
    <>
      <style>{`
        @keyframes st-banner {
          0%   { opacity: 0; transform: translateY(22px); }
          17%  { opacity: 1; transform: translateY(0); }
          78%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>

      {/* Fade layer */}
      <div
        className="fixed inset-0 z-[300] pointer-events-none bg-black"
        style={{
          opacity: phase === 'out' ? 1 : 0,
          transition: phase === 'out' ? 'opacity 350ms ease-in' : 'opacity 450ms ease-out',
        }}
      />

      {/* World title banner */}
      {banner && (
        <div
          key={bannerKey}
          className="fixed inset-0 z-[301] pointer-events-none flex items-center justify-center"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            animation: 'st-banner 1.8s ease both',
          }}
        >
          <div
            className="text-center px-10 py-7"
            style={{
              background: 'rgba(6, 4, 18, 0.9)',
              border: '3px solid #f8e030',
              boxShadow: '0 0 30px rgba(248,224,48,0.35), 6px 6px 0 rgba(0,0,0,0.5)',
              borderRadius: 4,
            }}
          >
            <div style={{ color: '#f8e030', fontSize: 'clamp(9px,1.4vw,13px)', letterSpacing: 3, textShadow: '2px 2px 0 #8b5e00' }}>
              WORLD {banner.world}
            </div>
            <div style={{ color: '#ffffff', fontSize: 'clamp(16px,3vw,30px)', marginTop: 14, letterSpacing: 2, textShadow: '3px 3px 0 rgba(0,0,0,0.8)' }}>
              {banner.title.toUpperCase()}
            </div>
            {banner.subtitle && (
              <div style={{ color: '#ffd080', fontSize: 'clamp(7px,1vw,10px)', marginTop: 12, letterSpacing: 1, opacity: 0.85 }}>
                {banner.subtitle}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SceneTransition;
