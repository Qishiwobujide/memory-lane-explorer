import { useEffect, useRef, useState } from 'react';
import { worlds } from '@/game/worlds';
import { memoriesByScene, memoryTitle, MemoryMeta } from '@/game/memoryRegistry';
import { getCollected, getOverallTotals } from '@/game/progress';
import { useProgress } from '@/hooks/use-progress';
import { audio } from '@/game/audio';
import MemoryViewer from './MemoryViewer';

interface MemoryAlbumProps {
  onClose: () => void;
}

const isImage = (src?: string) => (src ? /\.(jpg|jpeg|png|gif|webp)$/i.test(src) : false);

const typeIcons: Record<string, string> = {
  snowboard: '🏂', helmet: '⛑️', gate: '⛩️',
  chalet: '🏡', mg: '🏎️', castle: '🏯',
  future: '🎸', jasons: '🎷',
  pikachu: '⚡', snorlax: '💤', charizard: '🔥', scream_tail: '🌸', shibuya: '🚶',
};

const MemoryAlbum = ({ onClose }: MemoryAlbumProps) => {
  useProgress();
  const [viewing, setViewing] = useState<MemoryMeta | null>(null);
  const [viewerClosing, setViewerClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const overall = getOverallTotals();

  const closeViewer = () => {
    if (viewerClosing) return;
    setViewerClosing(true);
    audio.play('viewerClose');
    closeTimerRef.current = window.setTimeout(() => {
      setViewing(null);
      setViewerClosing(false);
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (viewing) closeViewer();
        else onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewing, viewerClosing, onClose]);

  return (
    <div
      className="fixed inset-0 z-[150] overflow-y-auto"
      style={{
        background: 'rgba(4, 6, 20, 0.94)',
        backdropFilter: 'blur(6px)',
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      <style>{`
        @keyframes ma-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ma-buzz {
          0%, 100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }
        .ma-tile:hover .ma-tile-inner { border-color: #f8e030; box-shadow: 0 0 16px rgba(248,224,48,0.35); }
        .ma-buzzing { animation: ma-buzz 0.18s ease 2; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-10" style={{ animation: 'ma-in 0.3s ease both' }}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            <div style={{ color: '#f8e030', fontSize: 'clamp(14px,2.4vw,22px)', letterSpacing: 3, textShadow: '2px 2px 0 #8b5e00' }}>
              ✦ MEMORY ALBUM ✦
            </div>
            <div style={{ color: '#ffd080', fontSize: 9, marginTop: 10, letterSpacing: 1 }}>
              {overall.collected}/{overall.total} MEMORIES COLLECTED
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2.5"
            style={{
              fontFamily: 'inherit',
              fontSize: 9,
              letterSpacing: 1,
              color: '#f8e030',
              background: 'rgba(248,224,48,0.1)',
              border: '2px solid rgba(248,224,48,0.6)',
              borderRadius: 4,
            }}
          >
            ← BACK (ESC)
          </button>
        </div>

        {/* Sections per world */}
        {worlds.map((world) => {
          const memories = memoriesByScene[world.key];
          if (!memories.length) return null;
          const collectedSet = getCollected(world.key);
          return (
            <div key={world.key} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: 18 }}>{world.icon}</span>
                <span style={{ color: '#fff', fontSize: 11, letterSpacing: 2, textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                  WORLD {world.world} — {world.title.toUpperCase()}
                </span>
                <span style={{ color: '#ffd080', fontSize: 8 }}>
                  {collectedSet.size}/{memories.length}
                </span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(248,224,48,0.4), transparent)' }} />
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {memories.map((mem) => {
                  const unlocked = collectedSet.has(mem.index);
                  return unlocked ? (
                    <button
                      key={mem.index}
                      className="ma-tile cursor-pointer text-left"
                      style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}
                      onClick={() => {
                        audio.play('viewerOpen');
                        setViewing(mem);
                      }}
                    >
                      <div
                        className="ma-tile-inner overflow-hidden"
                        style={{
                          aspectRatio: '16/10',
                          border: '2px solid rgba(248,224,48,0.55)',
                          borderRadius: 6,
                          background: 'hsl(230 22% 7%)',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        {isImage(mem.videoSrc) ? (
                          <img src={mem.videoSrc} alt={memoryTitle(mem)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <>
                            <span style={{ fontSize: 34 }}>{typeIcons[mem.type] ?? '🎬'}</span>
                            <span
                              style={{
                                position: 'absolute', right: 8, bottom: 6, fontSize: 12,
                                color: '#f8e030', textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
                              }}
                            >
                              ▶
                            </span>
                          </>
                        )}
                      </div>
                      <div style={{ color: '#f8e030', fontSize: 8, marginTop: 8, letterSpacing: 1, lineHeight: 1.5 }}>
                        {memoryTitle(mem).toUpperCase()}
                      </div>
                    </button>
                  ) : (
                    <LockedTile key={mem.index} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {viewing && (
        <MemoryViewer
          videoSrc={viewing.videoSrc}
          title={memoryTitle(viewing)}
          description={viewing.description}
          closing={viewerClosing}
          onClose={closeViewer}
        />
      )}
    </div>
  );
};

const LockedTile = () => {
  const [buzzing, setBuzzing] = useState(0);
  return (
    <div
      className={buzzing ? 'ma-buzzing' : ''}
      key={buzzing}
      onClick={() => {
        audio.play('locked');
        setBuzzing((b) => b + 1);
      }}
      style={{ cursor: 'not-allowed' }}
    >
      <div
        style={{
          aspectRatio: '16/10',
          border: '2px dashed rgba(150,150,160,0.4)',
          borderRadius: 6,
          background: 'rgba(255,255,255,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(150,150,160,0.5)',
          fontSize: 26,
        }}
      >
        ?
      </div>
      <div style={{ color: 'rgba(150,150,160,0.5)', fontSize: 8, marginTop: 8, letterSpacing: 1 }}>
        LOCKED
      </div>
    </div>
  );
};

export default MemoryAlbum;
