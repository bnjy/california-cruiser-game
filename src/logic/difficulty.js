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
    return Math.max(2500, 6000 - gameTime * 20);
}

export function calcRivalCarDelay(gameTime) {
    return Math.max(10000, 25000 - gameTime * 60);
}

export function shouldDrainRep(vinylsThrown, vinylsHit) {
    return vinylsThrown > 5 && (vinylsHit / vinylsThrown) < 0.3;
}
