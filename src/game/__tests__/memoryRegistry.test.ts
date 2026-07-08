import { describe, expect, it } from 'vitest';
import { memoryRegistry, memoriesByScene, memoryTitle } from '../memoryRegistry';
import { worlds } from '../worlds';

describe('memory registry', () => {
  it('covers every world', () => {
    for (const world of worlds) {
      expect(memoriesByScene[world.key].length).toBeGreaterThan(0);
    }
  });

  it('has 13 memories total', () => {
    expect(memoryRegistry.length).toBe(13);
  });

  it('every memory has a videoSrc to show in the album', () => {
    for (const mem of memoryRegistry) {
      expect(mem.videoSrc, `${mem.sceneKey}[${mem.index}] (${mem.type})`).toBeTruthy();
    }
  });

  it('indices are contiguous per scene', () => {
    for (const world of worlds) {
      memoriesByScene[world.key].forEach((mem, i) => {
        expect(mem.index).toBe(i);
        expect(mem.sceneKey).toBe(world.key);
      });
    }
  });

  it('every memory resolves to a display title', () => {
    for (const mem of memoryRegistry) {
      expect(memoryTitle(mem)).toBeTruthy();
      expect(memoryTitle(mem)).not.toBe('Memory'); // all types should be named
    }
  });
});
