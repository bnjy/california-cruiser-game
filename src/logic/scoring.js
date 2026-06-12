/**
 * Pure scoring logic — no Phaser dependencies.
 */

import { FAN_TIERS } from '../config.js';

export function fanCashReward(tier) {
    return FAN_TIERS[tier].cash;
}

// Converting a hater pays 2x the fan reward for its tier
export function haterCashReward(tier) {
    return fanCashReward(tier) * 2;
}

export function fanRepReward() {
    return 10;
}

export function haterRepReward() {
    return fanRepReward() * 2;
}

export function calcAccuracy(thrown, hit) {
    if (thrown === 0) return 0;
    return Math.round((hit / thrown) * 100);
}

export function formatAccuracy(thrown, hit) {
    if (thrown === 0) return '---';
    return calcAccuracy(thrown, hit) + '%';
}

export function isHighScore(cash, previousHigh) {
    return cash > previousHigh;
}
