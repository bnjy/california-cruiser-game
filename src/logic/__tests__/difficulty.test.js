import { describe, it, expect } from 'vitest';
import {
    calcScrollSpeed, calcFanDelay, calcHaterDelay,
    calcRivalCarDelay, calcPickupDelay, shouldDrainRep,
} from '../difficulty.js';

describe('calcScrollSpeed', () => {
    it('equals base speed at time 0', () => {
        expect(calcScrollSpeed(0)).toBe(80);
    });
    it('increases linearly with time', () => {
        expect(calcScrollSpeed(10)).toBe(92);
        expect(calcScrollSpeed(100)).toBe(200);
    });
    it('caps at 220', () => {
        expect(calcScrollSpeed(200)).toBe(220);
        expect(calcScrollSpeed(300)).toBe(220);
    });
});

describe('calcFanDelay', () => {
    it('starts at 1800ms', () => {
        expect(calcFanDelay(0)).toBe(1800);
    });
    it('floors at 800ms', () => {
        expect(calcFanDelay(200)).toBe(800);
    });
    it('decreases with time', () => {
        expect(calcFanDelay(50)).toBe(1300);
    });
});

describe('calcHaterDelay', () => {
    it('starts at 6000ms', () => {
        expect(calcHaterDelay(0)).toBe(6000);
    });
    it('decreases with time', () => {
        expect(calcHaterDelay(50)).toBe(4000);
    });
    it('floors at 2000ms', () => {
        expect(calcHaterDelay(300)).toBe(2000);
    });
});

describe('calcRivalCarDelay', () => {
    it('starts at 25000ms', () => {
        expect(calcRivalCarDelay(0)).toBe(25000);
    });
    it('decreases with time', () => {
        expect(calcRivalCarDelay(60)).toBe(19000);
    });
    it('floors at 8000ms', () => {
        expect(calcRivalCarDelay(300)).toBe(8000);
    });
});

describe('calcPickupDelay', () => {
    it('starts at 3500ms', () => {
        expect(calcPickupDelay(0)).toBe(3500);
    });
    it('increases with time (pickups get scarcer)', () => {
        expect(calcPickupDelay(60)).toBe(5000);
    });
    it('caps at 7000ms', () => {
        expect(calcPickupDelay(300)).toBe(7000);
    });
});

describe('shouldDrainRep', () => {
    it('returns false when fewer than 6 thrown', () => {
        expect(shouldDrainRep(5, 0)).toBe(false);
    });
    it('returns true when accuracy below 30%', () => {
        expect(shouldDrainRep(10, 2)).toBe(true);
    });
    it('returns false when accuracy at 30%', () => {
        expect(shouldDrainRep(10, 3)).toBe(false);
    });
    it('returns false when accuracy above 30%', () => {
        expect(shouldDrainRep(10, 5)).toBe(false);
    });
});
