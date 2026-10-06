import { describe, it, expect } from 'vitest';
import { loadHighScore, saveHighScore, HIGHSCORE_KEY } from '../highscore.js';

function fakeStorage(initial = {}) {
    const data = { ...initial };
    return {
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = v; },
        data,
    };
}

const blocked = {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('blocked'); },
};

describe('loadHighScore', () => {
    it('returns 0 when nothing is stored', () => {
        expect(loadHighScore(fakeStorage())).toBe(0);
    });
    it('returns the stored score as a number', () => {
        expect(loadHighScore(fakeStorage({ [HIGHSCORE_KEY]: '1500' }))).toBe(1500);
    });
    it('returns 0 for garbage values', () => {
        expect(loadHighScore(fakeStorage({ [HIGHSCORE_KEY]: 'abc' }))).toBe(0);
        expect(loadHighScore(fakeStorage({ [HIGHSCORE_KEY]: '-50' }))).toBe(0);
    });
    it('returns 0 when storage is blocked', () => {
        expect(loadHighScore(blocked)).toBe(0);
    });
});

describe('saveHighScore', () => {
    it('saves and reports a better score', () => {
        const s = fakeStorage({ [HIGHSCORE_KEY]: '100' });
        expect(saveHighScore(s, 200)).toBe(true);
        expect(s.data[HIGHSCORE_KEY]).toBe('200');
    });
    it('does not save a tie or a worse score', () => {
        const s = fakeStorage({ [HIGHSCORE_KEY]: '200' });
        expect(saveHighScore(s, 200)).toBe(false);
        expect(saveHighScore(s, 100)).toBe(false);
        expect(s.data[HIGHSCORE_KEY]).toBe('200');
    });
    it('does not count $0 as a high score', () => {
        expect(saveHighScore(fakeStorage(), 0)).toBe(false);
    });
    it('does not throw when storage is blocked', () => {
        expect(saveHighScore(blocked, 500)).toBe(true);
    });
});
