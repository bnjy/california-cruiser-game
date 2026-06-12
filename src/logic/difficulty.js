/**
 * Difficulty ramp calculations — pure functions, no Phaser dependencies.
 */

import { BASE_SCROLL_SPEED } from '../config.js';

export function calcScrollSpeed(gameTime) {
    return Math.min(220, BASE_SCROLL_SPEED + (gameTime * 1.2));
}

export function calcFanDelay(gameTime) {
    return Math.max(800, 1800 - gameTime * 10);
}

export function calcHaterDelay(gameTime) {
    return Math.max(2000, 6000 - gameTime * 40);
}

export function calcRivalCarDelay(gameTime) {
    return Math.max(8000, 25000 - gameTime * 100);
}

// Pickups get scarcer over time
export function calcPickupDelay(gameTime) {
    return Math.min(7000, 3500 + gameTime * 25);
}

export function shouldDrainRep(vinylsThrown, vinylsHit) {
    return vinylsThrown > 5 && (vinylsHit / vinylsThrown) < 0.3;
}
