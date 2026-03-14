interface MemoryViewerProps {
  videoSrc?: string;
  onClose: () => void;
}

const MemoryViewer = ({ videoSrc, onClose }: MemoryViewerProps) => {
  const isImage = videoSrc ? /\.(jpg|jpeg|png|gif|webp)$/i.test(videoSrc) : false;

  return (
    <>
      <style>{`
        @keyframes mv-fadein {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes mv-shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes mv-blink {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        .mv-card {
          animation: mv-fadein 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mv-border {
          background: linear-gradient(135deg, #FFD700, #FFF0A0, #B8860B, #FFD700, #FFF0A0);
          background-size: 300% 300%;
          animation: mv-shimmer 4s ease infinite;
        }
        .mv-esc {
          animation: mv-blink 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(4, 6, 20, 0.88)', backdropFilter: 'blur(6px)' }}
      >
        {/* Gradient border wrapper */}
        <div className="mv-card mv-border p-[3px] max-w-[92vw]" style={{ borderRadius: '14px' }}>
          {/* Inner card */}
          <div
            className="flex flex-col items-center gap-5"
            style={{
              borderRadius: '12px',
              backgroundColor: 'hsl(230 22% 9%)',
              padding: '32px 36px 24px',
            }}
          >
            {/* Top ornament */}
            <div className="flex items-center gap-3 w-full justify-center">
              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, #B8860B)' }} />
              <span style={{ color: '#FFD700', fontSize: '11px', letterSpacing: '0.25em', fontFamily: 'monospace', opacity: 0.9 }}>
                ✦ MEMORY UNLOCKED ✦
              </span>
              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, #B8860B)' }} />
            </div>

            {/* Media */}
            <div
              style={{
                width: '640px',
                maxWidth: '78vw',
                height: '360px',
                maxHeight: '48vh',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 0 40px rgba(184,134,11,0.25), inset 0 0 0 1px rgba(255,215,0,0.15)',
                background: 'hsl(230 22% 6%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isImage ? (
                <img
                  src={videoSrc}
                  alt="memory"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : videoSrc ? (
                <video
                  width="100%"
                  height="100%"
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => {}}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <span style={{ fontSize: '48px', opacity: 0.5 }}>🎬</span>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: 'monospace' }}>
                    Memory not yet captured
                  </p>
                </div>
              )}
            </div>

            {/* Bottom ornament */}
            <div className="flex items-center gap-3 w-full justify-center" style={{ marginTop: '4px' }}>
              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.4))' }} />
              <p className="mv-esc" style={{ color: 'rgba(255,215,0,0.6)', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
                ESC TO CONTINUE
              </p>
              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(184,134,11,0.4))' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoryViewer;
