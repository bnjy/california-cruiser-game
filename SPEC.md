# California Cruiser — Game Specification

## Overview

**California Cruiser** is a pixel-art side-scrolling action game built with Phaser 3. You drive a red sports car along a California boulevard at sunset, throwing vinyl records at fans on the sidewalk to earn cash and build your REP. Dodge bottle-throwing haters and a rival rapper's car. Cash earned is your score.

**Inspirations:** TMNT: Turtles in Time, Super Star Wars, The Lost Vikings, Mega Man 7.

**Tech stack:** Phaser 3 (CDN), single `index.html` + assets folder.

---

## Core Loop

1. Your car auto-scrolls right along the boulevard.
2. Fans walk along the sidewalk above the road.
3. Press Space to throw a vinyl record — it arcs upward toward the sidewalk.
4. Fan catches it → cash floats up, REP meter fills.
5. Miss → vinyl wasted (ammo is limited).
6. Dodge hater bottles and the rival rapper's car to survive.
7. Speed and enemy density ramp up gradually over time.
8. Game ends when HP hits 0. Cash earned = your final score.

Simple to learn, hard to master at speed.

---

## Screen Layout

**Native resolution:** 896 x 240, rendered at 3x scale (2688 x 720) with nearest-neighbor filtering (`pixelArt: true`).

| Y Zone (approx) | Region | Purpose |
|---|---|---|
| 0–155 | Skyline / background | Buildings, palms, sun (parallax layers) — not playable |
| 155–200 | Sidewalk lane (y=195) | Fans and haters walk here; player can drive here too |
| 200–225 | Road top lane (y=218) | Upper road lane; road pickups spawn here |
| 225–240 | Road bottom lane (y=238) | Lower road lane; player starts here |

The player, fans, and jaywalkers all move on 3 lanes: sidewalk (y=195), road top (y=218), and road bottom (y=238). The player moves freely between all 3 lanes in all 4 directions.

---

## Controls

| Input | Action |
|---|---|
| Up / W | Move car up (continuous — can reach sidewalk) |
| Down / S | Move car down (continuous) |
| Left / A | Move car left (continuous) |
| Right / D | Move car right (continuous) |
| Space | Throw vinyl (fixed 45° arc from car window toward sidewalk) |
| Space (on menus) | Start / Restart |

The car moves freely in all 4 directions across all 3 lanes (sidewalk, top road lane, bottom road lane). Movement is bounded to keep the car on-screen.

---

## Mechanics

### Vinyl Throwing (Ammo)
- Player starts with **15 vinyls**.
- Space throws one vinyl from the **car window** in a fixed 45° parabolic arc toward the sidewalk (manual physics with gravity).
- If the vinyl overlaps a fan/hater at sidewalk Y-level → hit. Otherwise it lands on the sidewalk and is wasted.
- At 0 ammo, throws are blocked.
- **Vinyl pickups** (`vinyl.png`) spawn on the road. Driving over one grants **+3 vinyls**.

### Fans (Targets)
- Walk along **both the sidewalk and the road**. Sidewalk fans are vinyl targets. Road fans (jaywalkers) are obstacles.
- Sidewalk fans: Walk right-to-left using the Walk animation (8 frames, 128x128). When hit by a vinyl → play Attack_1 animation (catch/celebrate), dollar floats up with score text, +$100 cash, +10 REP.
- 3 speed tiers: **Slow** (walking), **Medium** (fast walk), **Fast** (Run animation). Faster fans = more cash/REP but harder to hit.
- Cash awarded per catch: Slow **$100**, Medium **$150**, Fast **$200**.
- Use all 3 character variants (Homeless 1/2/3) randomly.

### Jaywalkers (Pedestrian Obstacles)
- Pedestrians that walk on any of the 3 lanes (sidewalk, top road, bottom road).
- If the player's car hits a jaywalker → **-15 REP** penalty. The jaywalker is knocked away.
- The player must dodge them by moving in any direction.

### Haters (Sidewalk Enemies)
- Also walk the sidewalk, visually distinguished by a **red indicator** above their head (drawn programmatically).
- Use Homeless_1 and Homeless_3 variants (the ones with the Special animation).
- Periodically stop and play the **Special animation** (13 frames) to throw a bottle (`battery1.png`) that arcs downward toward the road.
- Bottle hit on player car → **1 HP damage**, car flashes red, 1.5s invincibility.
- Hit a hater with a vinyl → plays **Hurt** animation, then converts to a celebrating fan (Attack_1). Awards **2x cash** and **2x REP** (bonus for converting).

### Rival Rapper Car (Road Enemy)
- Black car (`128px` frames, 4-frame animation loop) appears from the right in the player's current lane.
- Contact with player → **2 HP damage**, player knocked to the other lane (forced tween).
- Cannot be destroyed — dodge by switching lanes.
- Starts appearing after ~45 seconds. Frequency increases over time (every 30–45s early, every 15–20s late).

### Road Pickups
Items spawn on the road surface. Drive over them to collect.

| Item | Sprite | Effect |
|---|---|---|
| Vinyl refill | `vinyl.png` | +3 ammo |
| Microphone | `microphone.png` (scaled to 32px) | REP x2 for 8 seconds |
| Cash bonus | `single_dollar.png` (scaled to ~32x14) | +$50 |

### REP Meter
- Vertical VU-style bar on the left side of the HUD with **5 segments**.
- Fills from successful vinyl catches. REP per catch: Slow fan **+5**, Medium **+10**, Fast **+15**. Hater conversion **+25**.
- Each segment filled awards a **cash bonus**: $100, $200, $300, $500, $1000 (segments 1–5).
- Microphone power-up active → all REP gains **doubled**.
- Filling all 5 segments triggers **"GOLD RECORD" mode**: for 5 seconds, all throws auto-aim at nearest fan, all catches worth **3x cash**.
- REP meter **resets** after GOLD RECORD mode ends.
- If accuracy drops below 30%, the REP meter slowly drains.

### Car Health
- **3 HP** (displayed as 3 car icons or hearts in HUD).
- Bottle hit → 1 HP damage.
- Rival car hit → 2 HP damage.
- HP does **not** regenerate.
- 0 HP → **"WRECKED"** game over.

### Difficulty Ramp
- Scroll speed increases gradually over time (not in discrete steps).
- Fan density increases (max 3 on screen early → max 6–7 late).
- Hater ratio increases (0% at start → ~35% after several minutes).
- Rival car frequency increases.
- Road pickup density decreases (resources get scarcer).

### Accuracy Tracking
- HUD shows accuracy: `hits / throws` as a percentage.
- Encourages thoughtful throwing over spamming.

---

## Screens

1. **Title Screen** — Game logo, synthwave background (parallax layers), "Press SPACE to Start", high score display.
2. **Gameplay HUD** — REP meter (left), HP icons (bottom-left), cash total (top-right), vinyl ammo count (right), accuracy % (right).
3. **Game Over Screen** — "WRECKED", final cash score, high score, accuracy stats, "Press SPACE to Retry".

---

## Asset Inventory

### Background Layers (parallax, back-to-front)

| Layer | File | Dimensions | Scroll Speed |
|---|---|---|---|
| Sky + mountains | `assetLibrary/Miami-synth-files/Layers/back.png` | 224x240 | 0.1x |
| Synthwave sun | `assetLibrary/Miami-synth-files/Layers/sun.png` | 400x240 | 0.15x |
| City skyline | `assetLibrary/Miami-synth-files/Layers/buildings.png` | 256x240 | 0.3x |
| Palm cluster | `assetLibrary/Miami-synth-files/Layers/palms.png` | 224x240 | 0.5x |
| Single palm | `assetLibrary/Miami-synth-files/Layers/palm-tree.png` | 133x208 | 0.5x |
| Highway | `assetLibrary/Miami-synth-files/Layers/highway.png` | 896x240 | 1.0x |

All layers tile horizontally via `tileSprite`.

### Player Car (Red)

| Asset | File | Dimensions | Usage |
|---|---|---|---|
| Static 1 | `assetLibrary/Miami-synth-files/sprites/red-car/car1.png` | 184x68 | Title screen |
| Static 2 | `assetLibrary/Miami-synth-files/sprites/red-car/car2.png` | 184x68 | Unused |
| Running 1–5 | `assetLibrary/Miami-synth-files/sprites/red-car/running/car-running[1-5].png` | 184x68 each | Driving animation (5 frames, 10fps) |

### Enemy Car (Black)

| Asset | File | Dimensions | Usage |
|---|---|---|---|
| Frames 1–4 | `assetLibrary/Miami-synth-files/sprites/black-car/128/[1-4]Rpix128.png` | 128x38 each | Rival car animation (4 frames, 8fps) |

### Pedestrian Characters (128x128 per frame, sprite sheets)

| Animation | Frames | Width | Used For |
|---|---|---|---|
| Walk | 8 | 1024px | Fans/haters walking sidewalk (primary) |
| Run | 8 | 1024px | Fast fans |
| Attack_1 | 5 | 640px | Fan catching vinyl / celebrating |
| Attack_2 | 3 | 384px | Hater taunt variant |
| Hurt | 3 | 384px | Hater hit by vinyl |
| Special | 13 | 1664px | Hater throwing bottle (Homeless_1 & Homeless_3 only) |
| Idle | 6 | 768px | Decorative sidewalk NPCs |
| Idle_2 | 9–11 | 1152–1408px | Decorative sidewalk NPCs |
| Jump | 12–16 | — | Not used |
| Dead | 4 | 512px | Not used (tone) |

**Character paths:**
- `assetLibrary/Free-Homeless-Character-Sprite-Sheets-Pixel-Art/Homeless_1/`
- `assetLibrary/Free-Homeless-Character-Sprite-Sheets-Pixel-Art/Homeless_2/`
- `assetLibrary/Free-Homeless-Character-Sprite-Sheets-Pixel-Art/Homeless_3/`

**Role assignment:**
- **Fans:** All 3 variants (Walk, Run, Attack_1).
- **Haters:** Homeless_1 and Homeless_3 only (they have the Special/bottle-throw animation). Distinguished by red indicator.

### Retro Items

| Sprite | Dimensions | Game Role |
|---|---|---|
| `retroitems/vinyl.png` | 32x32 | Ammo: thrown projectile + road pickup (+3) |
| `retroitems/single_dollar.png` | 230x100 | Cash drop from fans (scaled ~46x20) + road pickup (scaled ~32x14) |
| `retroitems/microphone.png` | 18x19 | Power-up: REP x2 for 8s (scaled to 32px) |
| `retroitems/battery1.png` | 32x32 | Hater's thrown bottle projectile |
| All other `retroitems/*.png` | 32x32 | Bonus cash road pickups ($5–$30) |
| `retroitems/pocketknife.png` | 32x32 | Not used (tone) |

---

## Milestones

### Milestone 1 — Drive and Throw (Playable)

**Goal:** Core throw-catch-earn loop is functional and fun.

1. Phaser 3 project scaffolding: `index.html`, CDN Phaser, game config (896x240 native, 3x scale, `pixelArt: true`).
2. Parallax scrolling background with all 6 layers at correct relative speeds, tiling horizontally.
3. Player car at fixed X position (left quarter of screen) with 5-frame driving animation at 10fps.
4. 2 road lanes: Up/Down keys switch lanes with smooth tween (~150ms).
5. Fans spawn from right edge at sidewalk Y-level, walk left (Walk animation, random variant). 2–4 on screen.
6. Vinyl throwing: Space launches a vinyl from the car in a parabolic arc toward the sidewalk (Arcade physics with gravity). Fixed 45° angle.
7. Hit detection: vinyl overlaps fan → fan plays Attack_1, dollar floats up with "+$100", cash awarded.
8. Ammo system: starts at 15, HUD counter, blocked at 0.
9. Vinyl road pickups spawn periodically, +3 ammo on collection.
10. Basic HUD: cash total, vinyl ammo count, accuracy %.
11. Title screen with synthwave background and "Press SPACE to Start".
12. Game runs endlessly (no HP/game-over yet — that's M2).

**Deliverable:** You drive, throw vinyls at fans, see cash accumulate, and collect ammo refills. The core loop works.

---

### Milestone 2 — Enemies and REP (Playable)

**Goal:** Full combat, danger, and the REP meter make the game a real challenge.

1. Haters on sidewalk: red indicator, Special animation bottle throw, bottle arcs toward road.
2. Bottle damage: 1 HP, car flashes red, 1.5s invincibility.
3. Hater conversion: hit with vinyl → Hurt → Attack_1 (fan). 2x cash, 2x REP.
4. Car HP: 3 HP displayed as icons. 0 HP → "WRECKED" game over screen with retry.
5. REP meter: 5-segment VU bar, fills from catches, segment bonuses, GOLD RECORD mode at full.
6. Microphone power-up: spawns rarely on road, REP x2 for 8 seconds.
7. Rival rapper car: black car from right in player's lane, 2 HP damage + lane knockback, dodge by switching lanes.
8. Bonus retro item road pickups (cassettes, cameras, etc.) for cash variety.
9. Accuracy tracking in HUD.
10. Gradual speed ramp: scroll speed, fan density, hater ratio, rival car frequency all increase over time.
11. Game over screen: "WRECKED", final score, "Press SPACE to Retry".

**Deliverable:** Full gameplay with danger, REP rewards, and a real game-over condition. The game is challenging and replayable.

---

### Milestone 3 — Polish and Juice (Playable)

**Goal:** Game feel, visual polish, and completeness for portfolio.

1. Screen shake on bottle hit and rival car collision.
2. Item collect visual feedback (scale pop / particle burst).
3. Vinyl shatter particles on miss.
4. Microphone power-up VFX: pulsing glow, HUD countdown.
5. GOLD RECORD mode VFX: golden tint on vinyls, auto-aim line, screen tint.
6. Speed lines at high speeds.
7. High score persistence via localStorage.
8. Decorative idle pedestrians on sidewalk edges (Idle/Idle_2 animations, non-interactive).
9. Fan speed variety: slow, medium, fast tiers with different cash/REP values.
10. Difficulty ramp tuning: enemy density curve, pickup scarcity curve.
11. **Stretch:** Synthwave background music loop + SFX (throw, catch, bottle break, engine).
12. **Stretch:** Mobile/touch support (tap to throw, swipe to switch lanes).
13. **Stretch:** Combo system (consecutive catches without miss → x2, x3, x4 multiplier).

**Deliverable:** A polished, complete game ready to share and add to portfolio.

---

## Technical Notes

- **Physics:** Phaser Arcade Physics for vinyl arcs (gravity on Y), bottle arcs, and overlap detection.
- **Sprite sheets:** `this.load.spritesheet()` with `frameWidth: 128, frameHeight: 128` for all pedestrians.
- **Car animations:** Load individual PNGs, create animation from frame array.
- **Tiling:** `this.add.tileSprite()` for all background layers.
- **Scenes:** `BootScene` → `TitleScene` → `GameScene` → `GameOverScene` (restart loops to Title).
- **Object pooling:** Phaser Groups with `maxSize` for vinyls, fans, bottles, pickups.
- **Scaling:** `single_dollar.png` (230x100) scaled to ~32x14 as road pickup, ~46x20 floating from fans. `microphone.png` (18x19) scaled to ~32x34 on road.
- **Frame rate:** 60 FPS target.
- **Deployment:** Single `index.html` + `assets/` folder, Phaser 3 via CDN.
