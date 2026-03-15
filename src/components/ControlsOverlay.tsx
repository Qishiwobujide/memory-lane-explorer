interface ControlsOverlayProps {
  showTricks?: boolean;
}

const controls = [
  { key: '←→', label: 'Move' },
  { key: 'SPACE', label: 'Jump (3×)' },
  { key: 'F', label: 'Fly ↑↓' },
  { key: 'ENTER', label: 'Grab Memory' },
  { key: 'ESC', label: 'Menu' },
];

const trickControls = [
  { key: '1', label: 'Flip' },
  { key: '2', label: 'Grab' },
  { key: '3', label: 'Spin' },
];

const ControlsOverlay = ({ showTricks = false }: ControlsOverlayProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex gap-3 flex-wrap justify-center px-4 py-2 bg-card/90 border border-primary/40" style={{ borderRadius: 'var(--radius)' }}>
      {[...controls, ...(showTricks ? trickControls : [])].map((c) => (
        <div key={c.key} className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-primary/20 border border-primary/50 text-[7px] text-primary" style={{ borderRadius: '2px' }}>
            {c.key}
          </span>
          <span className="text-[7px] text-muted-foreground">{c.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ControlsOverlay;
