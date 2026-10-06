/**
 * High score persistence — storage is injected (localStorage in the browser).
 * Storage can be blocked (private mode, disabled site data), so never throw.
 */

import { isHighScore } from './scoring.js';

export const HIGHSCORE_KEY = 'california-cruiser-highscore';

export function loadHighScore(storage) {
    try {
        const value = parseInt(storage.getItem(HIGHSCORE_KEY), 10);
        return Number.isFinite(value) && value > 0 ? value : 0;
    } catch {
        return 0;
    }
}

// Saves cash if it beats the stored score; returns whether it was a new high score
export function saveHighScore(storage, cash) {
    if (!isHighScore(cash, loadHighScore(storage))) return false;
    try {
        storage.setItem(HIGHSCORE_KEY, String(cash));
    } catch {
        // Still a new high score for this session's Game Over screen
    }
    return true;
}
