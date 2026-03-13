interface MemoryViewerProps {
  sceneName: string;
  onClose: () => void;
}

const MemoryViewer = ({ sceneName, onClose }: MemoryViewerProps) => {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      <div
        className="flex flex-col items-center gap-6 p-8 max-w-[90vw] gold-glow"
        style={{
          border: '4px solid #FFD700',
          borderRadius: 'var(--radius)',
          backgroundColor: 'hsl(240 15% 12%)',
        }}
      >
        <h2 className="text-sm sm:text-base text-primary text-gold-shadow">
          📼 MEMORY COLLECTED! 📼
        </h2>

        <div
          className="flex items-center justify-center bg-background"
          style={{ width: '640px', maxWidth: '80vw', height: '360px', maxHeight: '50vh' }}
        >
          {sceneName === 'castle' ? (
            <video
              width="100%"
              height="100%"
              controls
              autoPlay
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onError={() => {}}
            >
              <source src="/NakedCastle.mp4" type="video/mp4" />
              <p className="text-muted-foreground text-[10px] p-4 text-center">
                Video could not be loaded. Place NakedCastle.mp4 in the public folder.
              </p>
            </video>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center p-4">
              <span className="text-5xl">🎬</span>
              <p className="text-[10px] text-foreground">
                Your video/photo will appear here
              </p>
              <p className="text-[8px] text-muted-foreground">
                (Add your memory file later)
              </p>
            </div>
          )}
        </div>

        <p className="text-[8px] text-muted-foreground animate-pulse">
          Press ESC to continue
        </p>
      </div>
    </div>
  );
};

export default MemoryViewer;
