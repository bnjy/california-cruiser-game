/**
 * Pure scoring logic — no Phaser dependencies.
 */

export function fanCashReward() {
    return 100;
}

export function haterCashReward() {
    return 200;
}

export function fanRepReward() {
    return 10;
}

export function haterRepReward() {
    return 25;
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
