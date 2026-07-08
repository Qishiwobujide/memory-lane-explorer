import { useMuted } from '@/hooks/use-audio';

interface MuteButtonProps {
  className?: string;
}

const MuteButton = ({ className = '' }: MuteButtonProps) => {
  const [muted, toggle] = useMuted();

  return (
    <button
      onClick={toggle}
      title={muted ? 'Unmute (M)' : 'Mute (M)'}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      className={`pointer-events-auto cursor-pointer bg-card/90 border border-primary/40 px-2 py-1.5 text-[11px] leading-none select-none hover:border-primary/80 transition-colors ${className}`}
      style={{ borderRadius: 'var(--radius)', fontFamily: '"Press Start 2P", monospace' }}
    >
      <span style={{ color: muted ? '#888' : '#f8e030' }}>{muted ? '🔇' : '🔊'}</span>
    </button>
  );
};

export default MuteButton;
