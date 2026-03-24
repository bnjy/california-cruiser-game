import { describe, it, expect } from 'vitest';
import {
    addRep, calcSegment, segmentBonuses,
    calcSegmentProgress, applyRepPenalty,
} from '../rep.js';

describe('addRep', () => {
    it('adds rep normally', () => {
        expect(addRep(0, 10, false)).toBe(10);
    });
    it('doubles with mic active', () => {
        expect(addRep(0, 10, true)).toBe(20);
    });
    it('caps at REP_MAX (100)', () => {
        expect(addRep(95, 10, false)).toBe(100);
    });
    it('caps even with mic doubling', () => {
        expect(addRep(90, 10, true)).toBe(100);
    });
});

describe('calcSegment', () => {
    it('returns 0 for no rep', () => {
        expect(calcSegment(0)).toBe(0);
    });
    it('returns 1 after filling first segment', () => {
        expect(calcSegment(20)).toBe(1);
    });
    it('returns 5 at max rep', () => {
        expect(calcSegment(100)).toBe(5);
    });
    it('returns segment mid-fill', () => {
        expect(calcSegment(15)).toBe(0);
        expect(calcSegment(45)).toBe(2);
    });
});

describe('segmentBonuses', () => {
    it('returns empty when no new segments', () => {
        expect(segmentBonuses(0, 0)).toEqual([]);
    });
    it('returns first bonus crossing segment 0→1', () => {
        expect(segmentBonuses(0, 1)).toEqual([100]);
    });
    it('returns multiple bonuses for multi-segment jump', () => {
        expect(segmentBonuses(0, 3)).toEqual([100, 200, 300]);
    });
    it('returns remaining bonuses from mid-segment', () => {
        expect(segmentBonuses(2, 5)).toEqual([300, 500, 1000]);
    });
    it('caps at REP_SEGMENTS', () => {
        expect(segmentBonuses(0, 10)).toEqual([100, 200, 300, 500, 1000]);
    });
});

describe('calcSegmentProgress', () => {
    it('returns 0 for empty segment', () => {
        expect(calcSegmentProgress(0, 0)).toBe(0);
    });
    it('returns 1 for full segment', () => {
        expect(calcSegmentProgress(20, 0)).toBe(1);
    });
    it('returns 0.5 for half-filled segment', () => {
        expect(calcSegmentProgress(10, 0)).toBe(0.5);
    });
    it('returns 0 for future segment', () => {
        expect(calcSegmentProgress(10, 2)).toBe(0);
    });
    it('clamps to 1 for past segments', () => {
        expect(calcSegmentProgress(60, 1)).toBe(1);
    });
});

describe('applyRepPenalty', () => {
    it('subtracts penalty', () => {
        expect(applyRepPenalty(50, 15)).toBe(35);
    });
    it('floors at 0', () => {
        expect(applyRepPenalty(10, 20)).toBe(0);
    });
});
