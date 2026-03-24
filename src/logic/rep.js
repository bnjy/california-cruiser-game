/**
 * Reputation meter logic — pure functions, no Phaser dependencies.
 */

import { REP_PER_SEGMENT, REP_SEGMENTS, REP_MAX, REP_SEGMENT_BONUSES } from '../config.js';

export function addRep(currentRep, amount, micActive) {
    const effective = micActive ? amount * 2 : amount;
    return Math.min(REP_MAX, currentRep + effective);
}

export function calcSegment(rep) {
    return Math.floor(rep / REP_PER_SEGMENT);
}

export function segmentBonuses(previousSegment, currentSegment) {
    const bonuses = [];
    for (let i = previousSegment; i < currentSegment && i < REP_SEGMENTS; i++) {
        bonuses.push(REP_SEGMENT_BONUSES[i]);
    }
    return bonuses;
}

export function calcSegmentProgress(rep, segmentIndex) {
    const segStart = segmentIndex * REP_PER_SEGMENT;
    return Math.max(0, Math.min(1, (rep - segStart) / REP_PER_SEGMENT));
}

export function applyRepPenalty(rep, amount) {
    return Math.max(0, rep - amount);
}
