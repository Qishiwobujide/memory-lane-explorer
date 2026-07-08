// Retro 8-bit sound effects synthesized with the Web Audio API — no asset files.
// Module singleton; safe to import anywhere. All sounds are no-ops until the
// AudioContext is unlocked by a user gesture (browser autoplay policy).

export type SfxName =
  | 'menuMove'
  | 'menuSelect'
  | 'jump'
  | 'jumpAir'
  | 'land'
  | 'pickup'
  | 'collect'
  | 'viewerOpen'
  | 'viewerClose'
  | 'pauseOpen'
  | 'pauseClose'
  | 'trick'
  | 'locked';

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let muted = false;
const mediaElements = new Set<HTMLMediaElement>();
const listeners = new Set<() => void>();

const MASTER_VOLUME = 0.35;

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function notify() {
  listeners.forEach((cb) => cb());
}

/** One oscillator note through its own envelope gain. */
function tone(
  ac: AudioContext,
  opts: {
    type?: OscillatorType;
    from: number;          // start frequency (Hz)
    to?: number;           // end frequency (sweep target)
    at?: number;           // start offset (s)
    duration: number;      // seconds
    peak?: number;         // envelope peak gain 0..1
  }
) {
  if (!masterGain) return;
  const t0 = ac.currentTime + (opts.at ?? 0);
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = opts.type ?? 'square';
  osc.frequency.setValueAtTime(opts.from, t0);
  if (opts.to !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.to), t0 + opts.duration);
  }
  const peak = opts.peak ?? 0.5;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + opts.duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + opts.duration + 0.02);
}

/** Short filtered noise burst (landing thud). */
function noiseBurst(ac: AudioContext, duration: number, cutoff: number, peak: number) {
  if (!masterGain) return;
  const length = Math.max(1, Math.floor(ac.sampleRate * duration));
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = cutoff;
  const gain = ac.createGain();
  const t0 = ac.currentTime;
  gain.gain.setValueAtTime(peak, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  src.start(t0);
}

const recipes: Record<SfxName, (ac: AudioContext) => void> = {
  menuMove:    (ac) => tone(ac, { from: 880, duration: 0.05, peak: 0.3 }),
  menuSelect:  (ac) => tone(ac, { from: 660, to: 990, duration: 0.12, peak: 0.4 }),
  jump:        (ac) => tone(ac, { from: 200, to: 550, duration: 0.13 }),
  jumpAir:     (ac) => tone(ac, { from: 350, to: 700, duration: 0.11, peak: 0.4 }),
  land:        (ac) => noiseBurst(ac, 0.07, 320, 0.5),
  pickup:      (ac) => {
    tone(ac, { from: 784, duration: 0.07, peak: 0.4 });
    tone(ac, { from: 1175, at: 0.07, duration: 0.1, peak: 0.4 });
  },
  collect:     (ac) => {
    // C5 E5 G5 C6 fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) =>
      tone(ac, { from: f, at: i * 0.09, duration: i === notes.length - 1 ? 0.28 : 0.1, peak: 0.45 })
    );
  },
  viewerOpen:  (ac) => {
    tone(ac, { type: 'triangle', from: 523, to: 784, duration: 0.16, peak: 0.5 });
    tone(ac, { type: 'triangle', from: 784, to: 1046, at: 0.1, duration: 0.18, peak: 0.4 });
  },
  viewerClose: (ac) => tone(ac, { type: 'triangle', from: 784, to: 392, duration: 0.18, peak: 0.4 }),
  pauseOpen:   (ac) => {
    tone(ac, { from: 660, duration: 0.07, peak: 0.35 });
    tone(ac, { from: 440, at: 0.08, duration: 0.1, peak: 0.35 });
  },
  pauseClose:  (ac) => {
    tone(ac, { from: 440, duration: 0.07, peak: 0.35 });
    tone(ac, { from: 660, at: 0.08, duration: 0.1, peak: 0.35 });
  },
  trick:       (ac) => {
    [523, 659, 880].forEach((f, i) => tone(ac, { from: f, at: i * 0.05, duration: 0.06, peak: 0.35 }));
  },
  locked:      (ac) => tone(ac, { from: 110, duration: 0.18, peak: 0.45 }),
};

export const audio = {
  /** Create/resume the AudioContext. Call from a user gesture. */
  unlock(): void {
    ensureContext();
  },

  /** Play a named sound effect. Never throws; silent before unlock. */
  play(name: SfxName): void {
    const ac = ensureContext();
    if (!ac || ac.state !== 'running' || muted) return;
    try {
      recipes[name](ac);
    } catch {
      // audio must never break the game
    }
  },

  isMuted(): boolean {
    return muted;
  },

  toggleMuted(): boolean {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
    mediaElements.forEach((el) => (el.muted = muted));
    notify();
    return muted;
  },

  /**
   * Keep an <audio>/<video> element's muted flag in sync with the master mute.
   * Returns an unregister function. (Deliberately not createMediaElementSource —
   * that can only attach once per element and breaks on React remounts.)
   */
  registerMediaElement(el: HTMLMediaElement): () => void {
    mediaElements.add(el);
    el.muted = muted;
    return () => {
      mediaElements.delete(el);
    };
  },

  /** Subscribe to mute-state changes (for useSyncExternalStore). */
  subscribe(cb: () => void): () => void {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
};
