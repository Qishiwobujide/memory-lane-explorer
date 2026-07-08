import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  markCollected,
  getCollected,
  getSceneTotals,
  getOverallTotals,
  subscribe,
  getVersion,
  resetProgress,
} from '../progress';

describe('progress store', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('starts empty', () => {
    expect(getCollected('japan').size).toBe(0);
    expect(getOverallTotals().collected).toBe(0);
    expect(getOverallTotals().total).toBeGreaterThan(0);
  });

  it('marks memories as collected per scene', () => {
    markCollected('japan', 0);
    markCollected('japan', 2);
    markCollected('tokyo', 1);
    expect([...getCollected('japan')]).toEqual([0, 2]);
    expect(getSceneTotals('japan').collected).toBe(2);
    expect(getSceneTotals('tokyo').collected).toBe(1);
    expect(getOverallTotals().collected).toBe(3);
  });

  it('is idempotent — collecting the same memory twice counts once', () => {
    markCollected('castle', 1);
    const versionAfterFirst = getVersion();
    markCollected('castle', 1);
    expect(getSceneTotals('castle').collected).toBe(1);
    expect(getVersion()).toBe(versionAfterFirst); // no notify on repeat
  });

  it('notifies subscribers and bumps the version on change', () => {
    const cb = vi.fn();
    const unsubscribe = subscribe(cb);
    const v0 = getVersion();
    markCollected('concert', 0);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(getVersion()).toBe(v0 + 1);
    unsubscribe();
    markCollected('concert', 1);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('scene totals come from the registry', () => {
    expect(getSceneTotals('japan').total).toBe(3);
    expect(getSceneTotals('castle').total).toBe(3);
    expect(getSceneTotals('concert').total).toBe(2);
    expect(getSceneTotals('tokyo').total).toBe(5);
  });
});
