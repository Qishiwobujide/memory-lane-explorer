// Shared mutable state between the editor overlay (React) and the scene draw loop (canvas).

export interface EditorPin {
  xFrac: number;  // x / canvasW
  yFrac: number;  // y / canvasH
  wFrac?: number; // size override: width  / canvasH
  hFrac?: number; // size override: height / canvasH
  hidden?: boolean;
}

export interface ExtraObject {
  id: string;
  src: string;
  xFrac: number;
  yFrac: number;
  wFrac: number;  // width  / canvasH
  hFrac: number;  // height / canvasH
}

const LS_PINS   = 'editorPins_v1';
const LS_EXTRAS = 'editorExtras_v1';

function loadPins(): Record<string, EditorPin> {
  try { return JSON.parse(localStorage.getItem(LS_PINS) ?? '{}'); } catch { return {}; }
}
function loadExtras(): ExtraObject[] {
  try { return JSON.parse(localStorage.getItem(LS_EXTRAS) ?? '[]'); } catch { return []; }
}
function savePins()   { localStorage.setItem(LS_PINS,   JSON.stringify(editorPins)); }
function saveExtras() { localStorage.setItem(LS_EXTRAS, JSON.stringify(extraObjects)); }

export const editorPins: Record<string, EditorPin> = loadPins();
export const extraObjects: ExtraObject[] = loadExtras();

let _active = false;
export const isEditorActive = () => _active;
export const setEditorActive = (v: boolean) => { _active = v; };

export const setPin = (id: string, xFrac: number, yFrac: number, wFrac?: number, hFrac?: number) => {
  editorPins[id] = { ...editorPins[id], xFrac, yFrac, ...(wFrac != null ? { wFrac } : {}), ...(hFrac != null ? { hFrac } : {}) };
  savePins();
};

export const setHidden = (id: string, hidden: boolean) => {
  if (!editorPins[id]) editorPins[id] = { xFrac: 0, yFrac: 0 };
  editorPins[id].hidden = hidden;
  savePins();
};

export const addExtraObject = (obj: ExtraObject) => { extraObjects.push(obj); saveExtras(); };
export const removeExtraObject = (id: string) => {
  const i = extraObjects.findIndex(o => o.id === id);
  if (i >= 0) extraObjects.splice(i, 1);
  saveExtras();
};
export const updateExtraObject = (id: string, updates: Partial<ExtraObject>) => {
  const obj = extraObjects.find(o => o.id === id);
  if (obj) { Object.assign(obj, updates); saveExtras(); }
};

// Image cache for extra objects (drawn in the game loop)
const imgCache: Record<string, HTMLImageElement> = {};
export const getEditorImage = (src: string) => {
  if (!imgCache[src]) {
    const img = new Image();
    img.src = src;
    imgCache[src] = img;
  }
  return imgCache[src];
};
