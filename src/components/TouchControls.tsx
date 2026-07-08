import { CSSProperties, PointerEvent } from 'react';

interface TouchControlsProps {
  showTricks: boolean;
}

// On-screen controls dispatch synthetic keyboard events, reusing every
// existing input path (jump edge detection, fly toggle, Enter collect,
// Esc pause) with zero changes to the game's input code.
const press = (key: string) => window.dispatchEvent(new KeyboardEvent('keydown', { key }));
const release = (key: string) => window.dispatchEvent(new KeyboardEvent('keyup', { key }));

const btnBase: CSSProperties = {
  fontFamily: '"Press Start 2P", monospace',
  background: 'rgba(10, 8, 20, 0.55)',
  border: '2px solid rgba(248,224,48,0.55)',
  color: '#f8e030',
  borderRadius: '50%',
  touchAction: 'none',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
};

interface HoldButtonProps {
  keyName: string;
  size: number;
  fontSize?: number;
  children: React.ReactNode;
  style?: CSSProperties;
  /** Momentary buttons fire keydown+keyup on tap (Enter, F, tricks). */
  momentary?: boolean;
}

const HoldButton = ({ keyName, size, fontSize = 16, children, style, momentary = false }: HoldButtonProps) => {
  const onDown = (e: PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    press(keyName);
    if (momentary) release(keyName);
  };
  const onUp = (e: PointerEvent) => {
    e.preventDefault();
    if (!momentary) release(keyName);
  };
  return (
    <button
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{ ...btnBase, width: size, height: size, fontSize, ...style }}
    >
      {children}
    </button>
  );
};

const TouchControls = ({ showTricks }: TouchControlsProps) => {
  return (
    <div className="fixed inset-0 z-[110] pointer-events-none" style={{ touchAction: 'none' }}>
      {/* Bottom-left: movement */}
      <div className="absolute bottom-6 left-4 flex items-end gap-2 pointer-events-none">
        <HoldButton keyName="ArrowLeft" size={64} fontSize={20}>◀</HoldButton>
        <HoldButton keyName="ArrowRight" size={64} fontSize={20}>▶</HoldButton>
        <div className="flex flex-col gap-2 ml-1">
          <HoldButton keyName="ArrowUp" size={44} fontSize={14}>▲</HoldButton>
          <HoldButton keyName="ArrowDown" size={44} fontSize={14}>▼</HoldButton>
        </div>
      </div>

      {/* Bottom-right: actions */}
      <div className="absolute bottom-6 right-4 flex flex-col items-end gap-2 pointer-events-none">
        {showTricks && (
          <div className="flex gap-2 mb-1">
            <HoldButton keyName="1" size={40} fontSize={10} momentary>1</HoldButton>
            <HoldButton keyName="2" size={40} fontSize={10} momentary>2</HoldButton>
            <HoldButton keyName="3" size={40} fontSize={10} momentary>3</HoldButton>
          </div>
        )}
        <HoldButton keyName="f" size={44} fontSize={9} momentary style={{ borderRadius: 10 }}>
          FLY
        </HoldButton>
        <div className="flex items-end gap-3">
          <HoldButton
            keyName="Enter"
            size={60}
            fontSize={9}
            momentary
            style={{ border: '2px solid rgba(100,220,255,0.6)', color: '#64dcff' }}
          >
            ACT
          </HoldButton>
          <HoldButton keyName=" " size={76} fontSize={9}>
            JUMP
          </HoldButton>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;
