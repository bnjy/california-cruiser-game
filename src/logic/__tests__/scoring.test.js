import { describe, it, expect } from 'vitest';
import {
    fanCashReward, haterCashReward,
    fanRepReward, haterRepReward,
    calcAccuracy, formatAccuracy,
    isHighScore,
} from '../scoring.js';

describe('fanCashReward', () => {
    it('returns 10', () => {
        expect(fanCashReward()).toBe(10);
    });
});

describe('haterCashReward', () => {
    it('returns 200', () => {
        expect(haterCashReward()).toBe(200);
    });
});

describe('rep rewards', () => {
    it('fan gives 10 rep', () => {
        expect(fanRepReward()).toBe(10);
    });
    it('hater gives 25 rep', () => {
        expect(haterRepReward()).toBe(25);
    });
});

describe('calcAccuracy', () => {
    it('returns 0 when nothing thrown', () => {
        expect(calcAccuracy(0, 0)).toBe(0);
    });
    it('returns 100 for perfect accuracy', () => {
        expect(calcAccuracy(10, 10)).toBe(100);
    });
    it('rounds to nearest integer', () => {
        expect(calcAccuracy(3, 1)).toBe(33);
    });
});

describe('formatAccuracy', () => {
    it('returns --- when nothing thrown', () => {
        expect(formatAccuracy(0, 0)).toBe('---');
    });
    it('returns percentage string', () => {
        expect(formatAccuracy(10, 7)).toBe('70%');
    });
});

describe('isHighScore', () => {
    it('returns true when cash exceeds previous', () => {
        expect(isHighScore(500, 400)).toBe(true);
    });
    it('returns false when equal', () => {
        expect(isHighScore(400, 400)).toBe(false);
    });
    it('returns false when lower', () => {
        expect(isHighScore(300, 400)).toBe(false);
    });
});
