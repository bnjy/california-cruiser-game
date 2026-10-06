/**
 * Road pickup selection — pure functions, no Phaser dependencies.
 */

import {
    BONUS_PICKUPS,
    PICKUP_VINYL_CHANCE, PICKUP_MIC_CHANCE, PICKUP_DOLLAR_CHANCE,
    VINYL_PICKUP_AMMO, DOLLAR_PICKUP_CASH,
} from '../config.js';

// roll picks the pickup kind, bonusRoll picks which bonus item — both in [0, 1)
export function rollPickup(roll, bonusRoll) {
    if (roll < PICKUP_VINYL_CHANCE) {
        return { key: 'vinyl', type: 'vinyl', value: VINYL_PICKUP_AMMO };
    }
    if (roll < PICKUP_VINYL_CHANCE + PICKUP_MIC_CHANCE) {
        return { key: 'microphone', type: 'microphone', value: 0 };
    }
    if (roll < PICKUP_VINYL_CHANCE + PICKUP_MIC_CHANCE + PICKUP_DOLLAR_CHANCE) {
        return { key: 'dollar', type: 'cash', value: DOLLAR_PICKUP_CASH };
    }
    const item = BONUS_PICKUPS[Math.floor(bonusRoll * BONUS_PICKUPS.length)];
    return { key: item.key, type: 'cash', value: item.cash };
}

