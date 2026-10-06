import { describe, it, expect } from 'vitest';
import { comboMultiplier, COMBO_X2_AT, COMBO_X3_AT } from '../combo.js';

describe('comboMultiplier', () => {
    it('returns 1 below the x2 threshold', () => {
        expect(comboMultiplier(0)).toBe(1);
        expect(comboMultiplier(1)).toBe(1);
        expect(comboMultiplier(COMBO_X2_AT - 1)).toBe(1);
    });

    it('returns 2 from the x2 threshold', () => {
        expect(comboMultiplier(COMBO_X2_AT)).toBe(2);
        expect(comboMultiplier(COMBO_X3_AT - 1)).toBe(2);
    });

    it('returns 3 from the x3 threshold onward', () => {
        expect(comboMultiplier(COMBO_X3_AT)).toBe(3);
        expect(comboMultiplier(100)).toBe(3);
    });
});
