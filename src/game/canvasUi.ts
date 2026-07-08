// Shared canvas-drawn UI primitives, styled to match the DOM HUD.

interface HintPillOpts {
  /** 0..1 gold intensity; dimmer for secondary hints like "re-watch" */
  dim?: boolean;
  time?: number;
}

/** Dark pill with gold border and Press Start 2P text, centered on x. */
export function drawHintPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: HintPillOpts = {}
): void {
  const bob = opts.time !== undefined ? Math.sin(opts.time * 0.004) * 3 : 0;
  ctx.save();
  ctx.font = '10px "Press Start 2P", monospace';
  const tw = ctx.measureText(text).width;
  const pad = 12;
  const bw = tw + pad * 2;
  const bh = 26;
  const canvasW = ctx.canvas.width;
  let bx = x - bw / 2;
  bx = Math.max(8, Math.min(canvasW - bw - 8, bx));
  const by = y - bh / 2 + bob;

  ctx.fillStyle = 'rgba(10, 8, 20, 0.88)';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 6);
  ctx.fill();

  ctx.strokeStyle = opts.dim ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 215, 0, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 6);
  ctx.stroke();

  ctx.fillStyle = opts.dim ? 'rgba(255, 215, 0, 0.6)' : '#FFD700';
  ctx.fillText(text, bx + pad, by + bh / 2 + 4);
  ctx.restore();
}
