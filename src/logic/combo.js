/**
 * Combo multiplier logic — pure functions, no Phaser dependencies.
 *
 * Consecutive catches build a cash multiplier; a missed vinyl resets the combo.
 */

export const COMBO_X2_AT = 3;
export const COMBO_X3_AT = 6;

export function comboMultiplier(combo) {
    if (combo >= COMBO_X3_AT) return 3;
    if (combo >= COMBO_X2_AT) return 2;
    return 1;
}
