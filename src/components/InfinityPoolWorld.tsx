import { useEffect } from 'react';

interface InfinityPoolWorldProps {
  onClose: () => void;
}

const InfinityPoolWorld = ({ onClose }: InfinityPoolWorldProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(4, 6, 20, 0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div style={{ position: 'relative', width: '95vw', height: '90vh' }}>
        <video
          src="/NakedCastelPool.mp4"
          autoPlay
          loop
          playsInline
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          background: '#000',
            borderRadius: '10px',
            border: '2px solid rgba(255,215,0,0.4)',
            boxShadow: '0 0 60px rgba(0,160,200,0.25), 0 0 120px rgba(0,0,0,0.8)',
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(8,12,28,0.88)',
            border: '1.5px solid rgba(255,215,0,0.6)',
            borderRadius: '6px',
            color: '#FFD700',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            padding: '6px 12px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          ✕ CLOSE
        </button>
      </div>
    </div>
  );
};

export default InfinityPoolWorld;
