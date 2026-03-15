import { useState, useRef, useEffect } from 'react';
import {
  setPin, setEditorActive, setHidden, editorPins,
  addExtraObject, removeExtraObject, updateExtraObject, extraObjects,
} from '@/game/editorState';

// ── PNG library ────────────────────────────────────────────────────────────────
const PNG_LIBRARY = [
  { group: 'Japan', items: [
    '/PNG_Japan/Sakura Tree.png', '/PNG_Japan/Arc.png', '/PNG_Japan/Background Trees.png',
    '/PNG_Japan/Clouds.png', '/PNG_Japan/House Outside.png', '/PNG_Japan/House Inside.png',
    '/PNG_Japan/Tower.png', '/PNG_Japan/Volcano Fuji.png', '/PNG_Japan/City.png', '/PNG_Japan/Sky.png',
  ]},
  { group: 'Tokyo Neo', items: [
    '/Tokyo_neo/r_2020.png', '/Tokyo_neo/r_2021.png', '/Tokyo_neo/r_2022.png',
    '/Tokyo_neo/r_2023.png', '/Tokyo_neo/r_2025.png', '/Tokyo_neo/r_2026.png',
    '/Tokyo_neo/r_2029.png', '/Tokyo_neo/r_2030.png', '/Tokyo_neo/r_2031.png',
    '/Tokyo_neo/r_2032.png', '/Tokyo_neo/r_2033.png', '/Tokyo_neo/r_2034.png',
    '/Tokyo_neo/r_2036.png', '/Tokyo_neo/r_2041.png', '/Tokyo_neo/r_2042.png',
    '/Tokyo_neo/r_2043.png', '/Tokyo_neo/r_2044.png', '/Tokyo_neo/r_2045.png',
    '/Tokyo_neo/r_2046.png', '/Tokyo_neo/r_2054.png', '/Tokyo_neo/r_2083.png',
    '/Tokyo_neo/r_2084.png', '/Tokyo_neo/r_2086.png', '/Tokyo_neo/r_2087.png',
    '/Tokyo_neo/r_2088.png', '/Tokyo_neo/r_2089.png', '/Tokyo_neo/r_2092.png',
    '/Tokyo_neo/r_2093.png', '/Tokyo_neo/r_2094.png',
  ]},
  { group: 'Characters', items: ['/Character.png', '/Eldad.png', '/pikachu-f.png', '/snorlax.png', '/charizard.gif'] },
  { group: 'Trees', items: [
    '/Trees/birch_3.png', '/Trees/birch_4.png', '/Trees/birch_5.png',
    '/Trees/fir_tree_1.png', '/Trees/fir_tree_2.png', '/Trees/fir_tree_3.png', '/Trees/fir_tree_4.png',
  ]},
  { group: 'Other', items: ['/NakedCastleLogo.png', '/NakedStableLogo.png', '/NakedCastelReal.png', '/JazzClub.png', '/Suite.png'] },
];

// ── Scene pin definitions ──────────────────────────────────────────────────────
interface PinDef {
  id: string; name: string; color: string;
  xFrac: number; yFrac: number; wFrac: number; hFrac: number;
  hidden?: boolean;
}
const SCENE_PINS: Record<string, PinDef[]> = {
  castle: [
    { id: 'castle_bldg', name: '🏰 Castle Building', color: '#ffd700', xFrac: 0.375, yFrac: 0.169, wFrac: 0.400, hFrac: 0.300 },
    { id: 'mem_castle',  name: '📼 Castle Memory',   color: '#ff8800', xFrac: 0.508, yFrac: 0.290, wFrac: 0.098, hFrac: 0.171 },
    { id: 'mem_mg',      name: '🚗 MG Car Memory',   color: '#44aaff', xFrac: 0.520, yFrac: 0.775, wFrac: 0.040, hFrac: 0.070 },
    { id: 'mem_chalet',  name: '🏠 Chalet Memory',   color: '#88ff44', xFrac: 0.680, yFrac: 0.660, wFrac: 0.040, hFrac: 0.070 },
    { id: 'ct_l0', name: 'Tree L0', color: '#66cc88', xFrac: 0.263, yFrac: 0.063, wFrac: 0.132, hFrac: 0.240, hidden: true },
    { id: 'ct_l1', name: 'Tree L1', color: '#66cc88', xFrac: 0.289, yFrac: 0.460, wFrac: 0.150, hFrac: 0.272, hidden: true },
    { id: 'ct_l2', name: 'Tree L2', color: '#66cc88', xFrac: 0.510, yFrac: 0.102, wFrac: 0.123, hFrac: 0.224, hidden: true },
    { id: 'ct_l3', name: 'Tree L3', color: '#66cc88', xFrac: 0.439, yFrac: 0.404, wFrac: 0.132, hFrac: 0.240, hidden: true },
    { id: 'ct_l4', name: 'Tree L4', color: '#88cc66', xFrac: 0.227, yFrac: 0.306, wFrac: 0.114, hFrac: 0.208, hidden: true },
    { id: 'ct_l5', name: 'Tree L5', color: '#88cc66', xFrac: 0.011, yFrac: 0.432, wFrac: 0.123, hFrac: 0.224 },
    { id: 'ct_l6', name: 'Tree L6', color: '#88cc66', xFrac: 0.523, yFrac: 0.441, wFrac: 0.106, hFrac: 0.192, hidden: true },
    { id: 'ct_r0', name: 'Tree R0', color: '#66ccaa', xFrac: 0.069, yFrac: 0.219, wFrac: 0.114, hFrac: 0.207 },
    { id: 'ct_r1', name: 'Tree R1', color: '#66ccaa', xFrac: 0.923, yFrac: 0.466, wFrac: 0.090, hFrac: 0.163 },
    { id: 'ct_r2', name: 'Tree R2', color: '#66ccaa', xFrac: 0.561, yFrac: 0.643, wFrac: 0.106, hFrac: 0.192, hidden: true },
    { id: 'ct_r3', name: 'Tree R3', color: '#aaccaa', xFrac: 0.718, yFrac: 0.197, wFrac: 0.103, hFrac: 0.187 },
    { id: 'ct_r4', name: 'Tree R4', color: '#aaccaa', xFrac: 0.774, yFrac: 0.455, wFrac: 0.100, hFrac: 0.181 },
    { id: 'ct_r5', name: 'Tree R5', color: '#aaccaa', xFrac: 0.297, yFrac: 0.465, wFrac: 0.097, hFrac: 0.176, hidden: true },
    { id: 'ct_b0', name: 'Tree B0', color: '#ccaa66', xFrac: 0.582, yFrac: 0.232, wFrac: 0.079, hFrac: 0.144, hidden: true },
    { id: 'ct_b1', name: 'Tree B1', color: '#ccaa66', xFrac: 0.832, yFrac: 0.310, wFrac: 0.088, hFrac: 0.160 },
    { id: 'ct_b2', name: 'Tree B2', color: '#ccaa66', xFrac: 0.604, yFrac: 0.502, wFrac: 0.075, hFrac: 0.136, hidden: true },
  ],
  tokyo: [
    { id: 'clouds1', name: 'Clouds (left)',       color: '#88aaff', xFrac: -0.070, yFrac: -0.045, wFrac: 1.183, hFrac: 0.186 },
    { id: 'clouds2', name: 'Clouds (right)',      color: '#88aaff', xFrac:  0.466, yFrac: -0.002, wFrac: 1.089, hFrac: 0.146 },
    { id: 'fuji',    name: 'Mt. Fuji',            color: '#aaddff', xFrac: -0.006, yFrac:  0.406, wFrac: 1.024, hFrac: 0.522 },
    { id: 'trees_l', name: 'Tree Line (left)',    color: '#66cc88', xFrac:  0.473, yFrac:  0.236, wFrac: 0.534, hFrac: 0.200, hidden: true },
    { id: 'trees_r', name: 'Tree Line (right)',   color: '#66cc88', xFrac:  0.681, yFrac:  0.714, wFrac: 0.312, hFrac: 0.088, hidden: true },
    { id: 'pagoda',  name: 'Pagoda',              color: '#ffaa44', xFrac:  0.920, yFrac:  0.526, wFrac: 0.185, hFrac: 0.258 },
    { id: 'house',   name: 'House',               color: '#ffcc66', xFrac:  0.540, yFrac:  0.396, wFrac: 0.322, hFrac: 0.446, hidden: true },
    { id: 'ramen',   name: 'Ramen Shop',          color: '#ffdd44', xFrac:  0.242, yFrac:  0.485, wFrac: 0.391, hFrac: 0.380, hidden: true },
    { id: 'doors',   name: 'Doors Building',      color: '#ffbb33', xFrac:  0.781, yFrac:  0.531, wFrac: 0.320, hFrac: 0.250, hidden: true },
    { id: 'arc',     name: 'Torii Gate',          color: '#ff4444', xFrac:  0.544, yFrac:  0.534, wFrac: 0.078, hFrac: 0.067, hidden: true },
    { id: 'neon',    name: 'Neon Sign',           color: '#ff44ff', xFrac:  0.649, yFrac:  0.522, wFrac: 0.039, hFrac: 0.072 },
    { id: 'neo44',   name: 'Neo (r_2044)',         color: '#ff8844', xFrac:  0.793, yFrac:  0.477, wFrac: 0.313, hFrac: 0.313 },
    { id: 'neo20',   name: 'Neo (r_2020)',         color: '#88ff88', xFrac:  0.085, yFrac:  0.243, wFrac: 0.150, hFrac: 0.150, hidden: true },
    { id: 'sakura1', name: 'Sakura Tree 1',       color: '#ff69b4', xFrac: -0.003, yFrac:  0.528, wFrac: 0.278, hFrac: 0.278 },
    { id: 'sakura2', name: 'Sakura Tree 2',       color: '#ff1493', xFrac:  0.438, yFrac:  0.577, wFrac: 0.225, hFrac: 0.225 },
    { id: 'lamp_l',  name: 'Street Lamp (left)',  color: '#ffffaa', xFrac:  0.658, yFrac:  0.650, wFrac: 0.127, hFrac: 0.264, hidden: true },
    { id: 'lamp_r',  name: 'Street Lamp (right)', color: '#ffffaa', xFrac:  0.356, yFrac:  0.467, wFrac: 0.115, hFrac: 0.240, hidden: true },
    { id: 'lantern', name: 'Lantern',             color: '#ffaa00', xFrac:  0.586, yFrac:  0.516, wFrac: 0.043, hFrac: 0.078 },
    { id: 'vend',    name: 'Vending Machine',     color: '#44ffcc', xFrac:  0.522, yFrac:  0.321, wFrac: 0.132, hFrac: 0.160, hidden: true },
    { id: 'robocat', name: 'Robot Cat',           color: '#44ccff', xFrac:  0.877, yFrac:  0.422, wFrac: 0.050, hFrac: 0.061, hidden: true },
    { id: 'pikachu', name: 'Pikachu',             color: '#ffee00', xFrac:  0.331, yFrac:  0.711, wFrac: 0.085, hFrac: 0.085 },
    { id: 'snorlax',   name: 'Snorlax',           color: '#8899cc', xFrac:  0.803, yFrac:  0.376, wFrac: 0.130, hFrac: 0.130 },
    { id: 'charizard', name: 'Charizard',         color: '#ff6600', xFrac:  0.907, yFrac:  0.212, wFrac: 0.122, hFrac: 0.122 },
  ],
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface ObjEntry {
  id: string; name: string; color: string;
  xFrac: number; yFrac: number; wFrac: number; hFrac: number;
  isExtra: boolean; src?: string; hidden?: boolean;
}
type DragMode = 'move' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br';
interface DragState {
  mode: DragMode;
  startMouseX: number; startMouseY: number;
  startX: number; startY: number; startW: number; startH: number;
}

interface Props { sceneKey: string; canvasW: number; canvasH: number; onDisable: () => void; }

const HANDLE_R = 8;
const MIN_SIZE = 0.02;
const fname = (s: string) => s.split('/').pop()?.replace('.png', '').replace('.gif', '') ?? s;

export default function SceneEditorOverlay({ sceneKey, canvasW, canvasH, onDisable }: Props) {
  const defs = SCENE_PINS[sceneKey] ?? [];
  const [objects, setObjects] = useState<ObjEntry[]>(() =>
    defs.map(d => ({
      ...d,
      xFrac: editorPins[d.id]?.xFrac ?? d.xFrac,
      yFrac: editorPins[d.id]?.yFrac ?? d.yFrac,
      wFrac: editorPins[d.id]?.wFrac ?? d.wFrac,
      hFrac: editorPins[d.id]?.hFrac ?? d.hFrac,
      hidden: editorPins[d.id]?.hidden ?? d.hidden ?? false,
      isExtra: false,
    }))
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dragState = useRef<DragState | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const extraCounter = useRef(100);

  useEffect(() => {
    setEditorActive(true);
    defs.forEach(d => {
      setPin(d.id, editorPins[d.id]?.xFrac ?? d.xFrac, editorPins[d.id]?.yFrac ?? d.yFrac, editorPins[d.id]?.wFrac ?? d.wFrac, editorPins[d.id]?.hFrac ?? d.hFrac);
      if (editorPins[d.id] == null && d.hidden) setHidden(d.id, true);
    });
    return () => setEditorActive(false);
  }, [sceneKey]);

  const sel = objects.find(o => o.id === selectedId) ?? null;

  const updateObj = (updated: ObjEntry) => {
    if (updated.isExtra) updateExtraObject(updated.id, updated);
    else setPin(updated.id, updated.xFrac, updated.yFrac, updated.wFrac, updated.hFrac);
    setObjects(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  const getPos = (e: React.MouseEvent) => {
    const r = overlayRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-ui]')) return;
    const pos = getPos(e);

    // Corner handles (only for selected)
    if (sel) {
      const px = sel.xFrac * canvasW, py = sel.yFrac * canvasH;
      const pw = sel.wFrac * canvasH,  ph = sel.hFrac * canvasH;
      const corners: [number, number, DragMode][] = [
        [px, py, 'resize-tl'], [px+pw, py, 'resize-tr'],
        [px, py+ph, 'resize-bl'], [px+pw, py+ph, 'resize-br'],
      ];
      for (const [cx, cy, mode] of corners) {
        if (Math.hypot(pos.x - cx, pos.y - cy) < HANDLE_R + 6) {
          dragState.current = { mode, startMouseX: pos.x, startMouseY: pos.y, startX: sel.xFrac, startY: sel.yFrac, startW: sel.wFrac, startH: sel.hFrac };
          e.preventDefault(); return;
        }
      }
    }

    // Object bounding boxes (back to front)
    for (let i = objects.length - 1; i >= 0; i--) {
      const o = objects[i];
      const px = o.xFrac * canvasW, py = o.yFrac * canvasH;
      const pw = o.wFrac * canvasH,  ph = o.hFrac * canvasH;
      if (pos.x >= px && pos.x <= px+pw && pos.y >= py && pos.y <= py+ph) {
        setSelectedId(o.id);
        setLibraryOpen(false);
        dragState.current = { mode: 'move', startMouseX: pos.x, startMouseY: pos.y, startX: o.xFrac, startY: o.yFrac, startW: o.wFrac, startH: o.hFrac };
        e.preventDefault(); return;
      }
    }
    setSelectedId(null);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current || !selectedId) return;
    const pos = getPos(e);
    const ds = dragState.current;

    setObjects(prev => prev.map(o => {
      if (o.id !== selectedId) return o;
      let { xFrac, yFrac, wFrac, hFrac } = o;
      const { mode, startX, startY, startW, startH } = ds;
      const dxW = (pos.x - ds.startMouseX) / canvasW;
      const dyH = (pos.y - ds.startMouseY) / canvasH;
      const dxH = (pos.x - ds.startMouseX) / canvasH; // x delta in H-fraction units (for size)

      if (mode === 'move') {
        xFrac = startX + dxW; yFrac = startY + dyH;
      } else if (mode === 'resize-br') {
        wFrac = Math.max(MIN_SIZE, startW + dxH); hFrac = Math.max(MIN_SIZE, startH + dyH);
      } else if (mode === 'resize-bl') {
        const nw = Math.max(MIN_SIZE, startW - dxH);
        xFrac = startX + (startW - nw) * canvasH / canvasW; wFrac = nw; hFrac = Math.max(MIN_SIZE, startH + dyH);
      } else if (mode === 'resize-tr') {
        wFrac = Math.max(MIN_SIZE, startW + dxH);
        const nh = Math.max(MIN_SIZE, startH - dyH); yFrac = startY + (startH - nh); hFrac = nh;
      } else if (mode === 'resize-tl') {
        const nw = Math.max(MIN_SIZE, startW - dxH);
        xFrac = startX + (startW - nw) * canvasH / canvasW; wFrac = nw;
        const nh = Math.max(MIN_SIZE, startH - dyH); yFrac = startY + (startH - nh); hFrac = nh;
      }

      const updated = { ...o, xFrac, yFrac, wFrac, hFrac };
      if (o.isExtra) updateExtraObject(o.id, updated);
      else setPin(o.id, xFrac, yFrac, wFrac, hFrac);
      return updated;
    }));
  };

  const onMouseUp = () => { dragState.current = null; };

  // Resize by factor (centred)
  const resize = (factor: number) => {
    if (!sel) return;
    const nw = Math.max(MIN_SIZE, sel.wFrac * factor);
    const nh = Math.max(MIN_SIZE, sel.hFrac * factor);
    updateObj({ ...sel, xFrac: sel.xFrac + (sel.wFrac - nw) * canvasH / (2 * canvasW), yFrac: sel.yFrac + (sel.hFrac - nh) / 2, wFrac: nw, hFrac: nh });
  };

  const toggleHide = () => {
    if (!sel) return;
    const nh = !sel.hidden;
    setHidden(sel.id, nh);
    setObjects(prev => prev.map(o => o.id === sel.id ? { ...o, hidden: nh } : o));
  };

  const deleteObj = () => {
    if (!sel) return;
    if (sel.isExtra) {
      removeExtraObject(sel.id);
      setObjects(prev => prev.filter(o => o.id !== sel.id));
    } else {
      setHidden(sel.id, true);
      setObjects(prev => prev.map(o => o.id === sel.id ? { ...o, hidden: true } : o));
    }
    setSelectedId(null);
  };

  const addFromLibrary = (src: string) => {
    const id = `extra_${extraCounter.current++}`;
    const obj: ObjEntry = { id, name: fname(src), color: '#ffffff', xFrac: 0.4, yFrac: 0.3, wFrac: 0.20, hFrac: 0.20, isExtra: true, src };
    addExtraObject({ id, src, xFrac: obj.xFrac, yFrac: obj.yFrac, wFrac: obj.wFrac, hFrac: obj.hFrac });
    setObjects(prev => [...prev, obj]);
    setSelectedId(id);
    setLibraryOpen(false);
  };

  const copyAll = () => {
    const lines = objects.map(o =>
      o.isExtra && o.src
        ? `di(img('${o.src}'), w*${o.xFrac.toFixed(3)}, h*${o.yFrac.toFixed(3)}, h*${o.wFrac.toFixed(3)}, h*${o.hFrac.toFixed(3)});`
        : `// ${o.name}${o.hidden ? ' [hidden]' : ''}: x=w*${o.xFrac.toFixed(3)} y=h*${o.yFrac.toFixed(3)} w=h*${o.wFrac.toFixed(3)} h=h*${o.hFrac.toFixed(3)}`
    );
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  // Toolbar position: centred above selected object
  const toolbarPos = sel ? (() => {
    const cx = sel.xFrac * canvasW + (sel.wFrac * canvasH) / 2;
    const ty = sel.yFrac * canvasH - 52;
    return { left: Math.max(120, Math.min(canvasW - 120, cx)), top: Math.max(48, ty) };
  })() : null;

  const cursor = dragState.current ? (dragState.current.mode === 'move' ? 'grabbing' : 'nwse-resize') : 'default';

  return (
    <div
      ref={overlayRef}
      style={{ position: 'fixed', inset: 0, zIndex: 200, cursor }}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {/* ── SVG: bounding boxes + corner handles ── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {objects.map(obj => {
          const isSel = obj.id === selectedId;
          const px = obj.xFrac * canvasW, py = obj.yFrac * canvasH;
          const pw = obj.wFrac * canvasH,  ph = obj.hFrac * canvasH;
          return (
            <g key={obj.id} opacity={obj.hidden ? 0.25 : 1}>
              <rect x={px} y={py} width={pw} height={ph} fill="none"
                stroke={obj.color} strokeWidth={isSel ? 2.5 : 1}
                strokeDasharray={isSel ? '0' : '5 3'} />
              {!isSel && (
                <text x={px+4} y={py - 5} fill={obj.color} fontSize={10} fontFamily="monospace"
                  stroke="rgba(0,0,0,0.85)" strokeWidth={3} paintOrder="stroke">{obj.name}</text>
              )}
              {isSel && [[px,py],[px+pw,py],[px,py+ph],[px+pw,py+ph]].map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r={HANDLE_R} fill={obj.color} stroke="white" strokeWidth={2} />
              ))}
            </g>
          );
        })}
      </svg>

      {/* ── Floating toolbar above selected object ── */}
      {sel && toolbarPos && (
        <div
          data-ui="true"
          style={{
            position: 'absolute',
            left: toolbarPos.left,
            top: toolbarPos.top,
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(8,10,24,0.97)',
            border: `1.5px solid ${sel.color}44`,
            borderRadius: 8,
            padding: '5px 8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            userSelect: 'none', whiteSpace: 'nowrap',
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Object name */}
          <span style={{ color: sel.color, fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold', marginRight: 4 }}>
            {sel.hidden ? '🙈 ' : ''}{sel.name}
          </span>

          <Divider />

          {/* Size controls */}
          <TBtn onClick={() => resize(0.75)} title="Much smaller">−−</TBtn>
          <TBtn onClick={() => resize(0.9)}  title="Smaller">−</TBtn>
          <TBtn onClick={() => resize(1.1)}  title="Larger">+</TBtn>
          <TBtn onClick={() => resize(1.25)} title="Much larger">++</TBtn>

          <Divider />

          {/* Hide / Show */}
          <TBtn onClick={toggleHide} title={sel.hidden ? 'Show' : 'Hide'} col="blue">
            {sel.hidden ? '👁' : '🙈'}
          </TBtn>

          {/* Delete */}
          <TBtn onClick={deleteObj} title={sel.isExtra ? 'Delete' : 'Hide permanently'} col="red">🗑</TBtn>

          <Divider />

          {/* Coords hint */}
          <span style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', fontSize: 9 }}>
            {Math.round(sel.xFrac*1000)/1000}, {Math.round(sel.yFrac*1000)/1000}
          </span>

          {/* Deselect */}
          <TBtn onClick={() => setSelectedId(null)} title="Deselect" col="dim">×</TBtn>
        </div>
      )}

      {/* ── Top bar ── */}
      <div
        data-ui="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 38,
          background: 'rgba(6,8,20,0.93)', borderBottom: '1px solid rgba(255,100,180,0.25)',
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
          fontFamily: 'monospace', fontSize: 12,
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <span style={{ color: '#ff69b4', fontWeight: 'bold' }}>🎨 Editor</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
          Click to select · Drag to move · Drag corners to resize
        </span>
        <div style={{ flex: 1 }} />
        <button onClick={copyAll} style={btn(copied ? 'green' : 'pink')}>
          {copied ? '✓ Copied!' : '⎘ Copy positions'}
        </button>
        <button onClick={onDisable} style={btn('dim')}>✕ Exit (` key)</button>
      </div>

      {/* ── Add Object button ── */}
      <button
        data-ui="true"
        onClick={() => setLibraryOpen(v => !v)}
        style={{ ...btn('pink'), position: 'absolute', bottom: 20, left: 20, fontSize: 13, padding: '8px 14px' }}
        onMouseDown={e => e.stopPropagation()}
      >
        📁 {libraryOpen ? 'Close Library' : 'Add Object'}
      </button>

      {/* ── Library panel ── */}
      {libraryOpen && (
        <div
          data-ui="true"
          style={{
            position: 'absolute', bottom: 66, left: 20,
            width: 440, maxHeight: 380,
            background: 'rgba(6,8,20,0.97)', border: '1.5px solid rgba(255,100,180,0.4)',
            borderRadius: 10, padding: 12, overflowY: 'auto',
            fontFamily: 'monospace',
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          <div style={{ color: '#ff69b4', fontWeight: 'bold', fontSize: 12, marginBottom: 10 }}>
            Click a PNG to add it to the scene
          </div>
          {PNG_LIBRARY.map(group => (
            <div key={group.group} style={{ marginBottom: 12 }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 6 }}>{group.group}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {group.items.map(src => (
                  <button
                    key={src} title={fname(src)} onClick={() => addFromLibrary(src)}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 6, padding: 4, cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 3, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff69b4'; e.currentTarget.style.background = 'rgba(255,100,180,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  >
                    <img src={src} style={{ width: 52, height: 52, objectFit: 'contain' }} />
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 8, maxWidth: 56, textAlign: 'center', wordBreak: 'break-all' }}>
                      {fname(src)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TBtn({ onClick, title, children, col = 'default' }: { onClick: () => void; title?: string; children: React.ReactNode; col?: string }) {
  const colors: Record<string, { bg: string; color: string; hover: string }> = {
    default: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', hover: 'rgba(255,255,255,0.18)' },
    red:     { bg: 'rgba(200,40,40,0.2)',    color: '#ff8888',                hover: 'rgba(200,40,40,0.4)' },
    blue:    { bg: 'rgba(60,120,255,0.2)',   color: '#88aaff',                hover: 'rgba(60,120,255,0.35)' },
    dim:     { bg: 'transparent',            color: 'rgba(255,255,255,0.35)', hover: 'rgba(255,255,255,0.1)' },
  };
  const c = colors[col] ?? colors.default;
  return (
    <button
      onClick={onClick} title={title}
      style={{ background: c.bg, border: 'none', color: c.color, borderRadius: 5, cursor: 'pointer', padding: '3px 7px', fontFamily: 'monospace', fontSize: 12, lineHeight: 1 }}
      onMouseEnter={e => { e.currentTarget.style.background = c.hover; }}
      onMouseLeave={e => { e.currentTarget.style.background = c.bg; }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)', margin: '0 2px', display: 'inline-block' }} />;
}

function btn(col: 'pink' | 'green' | 'dim'): React.CSSProperties {
  const m = { pink: ['rgba(255,100,180,0.18)', 'rgba(255,100,180,0.45)', '#ff69b4'], green: ['rgba(50,150,50,0.25)', 'rgba(50,200,50,0.5)', '#88ff88'], dim: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.5)'] }[col];
  return { background: m[0], border: `1px solid ${m[1]}`, color: m[2], borderRadius: 4, cursor: 'pointer', padding: '4px 10px', fontFamily: 'monospace', fontSize: 11 };
}
