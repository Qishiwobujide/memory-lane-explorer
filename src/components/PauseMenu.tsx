import { useEffect, useState } from 'react';
import { audio } from '@/game/audio';
import { useMuted } from '@/hooks/use-audio';
import { controls, trickControls } from './ControlsOverlay';

interface PauseMenuProps {
  onResume: () => void;
  onBackToMap: () => void;
  showTricks?: boolean;
}

const PauseMenu = ({ onResume, onBackToMap, showTricks = false }: PauseMenuProps) => {
  const [selected, setSelected] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [muted, toggleMuted] = useMuted();

  const items = [
    { label: 'RESUME', action: onResume },
    { label: 'HOW TO PLAY', action: () => setShowHelp(true) },
    { label: `SOUND: ${muted ? 'OFF' : 'ON'}`, action: toggleMuted },
    { label: 'BACK TO MAP', action: onBackToMap },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showHelp) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setShowHelp(false);
          audio.play('menuMove');
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        audio.play('menuMove');
        setSelected((s) => (s + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        audio.play('menuMove');
        setSelected((s) => (s - 1 + items.length) % items.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        audio.play('menuSelect');
        items[selected].action();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onResume();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // items closes over muted/selected — re-bind when they change
  }, [selected, showHelp, muted, onResume, onBackToMap, toggleMuted]);

  return (
    <div
      className="fixed inset-0 z-[180] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(4, 6, 20, 0.8)',
        backdropFilter: 'blur(4px)',
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      <style>{`
        @keyframes pm-in {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="text-center px-10 py-8"
        style={{
          background: 'rgba(6, 4, 18, 0.95)',
          border: '3px solid #f8e030',
          boxShadow: '0 0 26px rgba(248,224,48,0.3), 6px 6px 0 rgba(0,0,0,0.5)',
          borderRadius: 6,
          minWidth: 300,
          animation: 'pm-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        {showHelp ? (
          <>
            <div style={{ color: '#f8e030', fontSize: 13, letterSpacing: 2, textShadow: '2px 2px 0 #8b5e00' }}>
              HOW TO PLAY
            </div>
            <div className="mt-6 flex flex-col gap-3 text-left">
              {[...controls, ...(showTricks ? trickControls : [])].map((c) => (
                <div key={c.key} className="flex items-center gap-3">
                  <span
                    className="px-2 py-1 text-[9px]"
                    style={{ background: 'rgba(248,224,48,0.15)', border: '1px solid rgba(248,224,48,0.5)', color: '#f8e030', borderRadius: 3, minWidth: 58, textAlign: 'center' }}
                  >
                    {c.key}
                  </span>
                  <span style={{ color: '#ccc', fontSize: 9 }}>{c.label}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-7 cursor-pointer"
              onClick={() => setShowHelp(false)}
              style={{ color: '#ffd080', fontSize: 9, background: 'none', border: 'none', fontFamily: 'inherit', letterSpacing: 1 }}
            >
              ← BACK (ESC)
            </button>
          </>
        ) : (
          <>
            <div style={{ color: '#f8e030', fontSize: 15, letterSpacing: 3, textShadow: '2px 2px 0 #8b5e00' }}>
              ⏸ PAUSED
            </div>
            <div className="mt-7 flex flex-col gap-2">
              {items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => {
                    audio.play('menuSelect');
                    item.action();
                  }}
                  onMouseEnter={() => {
                    if (i !== selected) {
                      setSelected(i);
                      audio.play('menuMove');
                    }
                  }}
                  className="cursor-pointer px-4 py-2.5"
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 10,
                    letterSpacing: 1,
                    background: i === selected ? 'rgba(248,224,48,0.15)' : 'transparent',
                    border: i === selected ? '2px solid #f8e030' : '2px solid transparent',
                    borderRadius: 4,
                    color: i === selected ? '#f8e030' : '#bbb',
                    textShadow: i === selected ? '1px 1px 0 #8b5e00' : 'none',
                    transition: 'all 0.1s',
                  }}
                >
                  {i === selected ? '▶ ' : ''}
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PauseMenu;
