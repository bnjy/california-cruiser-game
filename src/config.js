export const NATIVE_W = 896;
export const NATIVE_H = 240;
export const SCALE = 3;

// Y positions (native coordinates) — bottom of sprite (origin 0.5, 1)
export const SIDEWALK_Y = 195;
export const ROAD_TOP_Y = 218;
export const ROAD_BOTTOM_Y = 238;

// Player movement bounds
export const PLAYER_START_X = 160;
export const PLAYER_MIN_X = 60;
export const PLAYER_MAX_X = 400;
export const PLAYER_MIN_Y = SIDEWALK_Y;
export const PLAYER_MAX_Y = ROAD_BOTTOM_Y;
export const PLAYER_SPEED = 120;
export const BASE_SCROLL_SPEED = 80;

// REP meter
export const REP_PER_SEGMENT = 20;
export const REP_SEGMENTS = 5;
export const REP_MAX = REP_PER_SEGMENT * REP_SEGMENTS;
export const REP_SEGMENT_BONUSES = [100, 200, 300, 500, 1000];
export const GOLD_RECORD_DURATION = 5000;

// Bonus pickup definitions
export const BONUS_PICKUPS = [
    { key: 'casette', cash: 10 },
    { key: 'vhs', cash: 10 },
    { key: 'phone', cash: 10 },
    { key: 'rubik1', cash: 10 },
    { key: 'dice1', cash: 5 },
    { key: 'jojo', cash: 5 },
    { key: 'crayon', cash: 5 },
    { key: 'remote', cash: 5 },
    { key: 'radio1', cash: 15 },
    { key: 'film', cash: 15 },
    { key: 'watch', cash: 15 },
    { key: 'headphone', cash: 20 },
    { key: 'casetteplayer', cash: 20 },
    { key: 'camera', cash: 25 },
    { key: 'lcdgame', cash: 30 },
    { key: 'vcr', cash: 30 },
];
