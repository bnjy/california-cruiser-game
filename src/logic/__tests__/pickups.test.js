import { describe, it, expect } from 'vitest';
import { rollPickup } from '../pickups.js';
import { BONUS_PICKUPS } from '../../config.js';

describe('rollPickup', () => {
    it('gives a vinyl pickup worth +5 ammo for low rolls', () => {
        expect(rollPickup(0, 0)).toEqual({ key: 'vinyl', type: 'vinyl', value: 5 });
        expect(rollPickup(0.34, 0)).toEqual({ key: 'vinyl', type: 'vinyl', value: 5 });
    });

    it('gives a microphone just after the vinyl range', () => {
        expect(rollPickup(0.35, 0)).toEqual({ key: 'microphone', type: 'microphone', value: 0 });
        expect(rollPickup(0.39, 0).type).toBe('microphone');
    });

    it('gives a $50 dollar pickup after the microphone range', () => {
        expect(rollPickup(0.40, 0)).toEqual({ key: 'dollar', type: 'cash', value: 50 });
        expect(rollPickup(0.49, 0).key).toBe('dollar');
    });

    it('gives a bonus item for the remaining rolls, picked by bonusRoll', () => {
        expect(rollPickup(0.5, 0)).toEqual({ key: BONUS_PICKUPS[0].key, type: 'cash', value: BONUS_PICKUPS[0].cash });
        const last = BONUS_PICKUPS[BONUS_PICKUPS.length - 1];
        expect(rollPickup(0.99, 0.9999)).toEqual({ key: last.key, type: 'cash', value: last.cash });
    });

    it('can reach every bonus item', () => {
        const keys = new Set();
        for (let i = 0; i < BONUS_PICKUPS.length; i++) {
            keys.add(rollPickup(0.9, (i + 0.5) / BONUS_PICKUPS.length).key);
        }
        expect(keys.size).toBe(BONUS_PICKUPS.length);
    });
});
