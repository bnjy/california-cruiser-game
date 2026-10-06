# California Cruiser

A pixel-art side-scrolling action game. Drive a red sports car along a California boulevard at sunset, throwing vinyl records at fans to earn cash. Dodge haters and a rival rapper's car. Cash earned is your score.

**Vibe:** TMNT: Turtles in Time, Super Star Wars, Mega Man 7.

**Tech:** Phaser 3 (CDN), ES modules under `src/`, 896x240 native at 3x scale.

---

## Core Loop

1. Car auto-scrolls right along the boulevard.
2. Fans walk the sidewalk. Press **Space** to throw a vinyl — it arcs toward them.
3. Fan catches it → cash floats up, REPUTATION meter fills.
4. Miss → vinyl wasted (ammo is limited).
5. Dodge rival rapper's black car to survive. If hit, one HP lost.
6. Speed and danger ramp up over time. Game ends when HP hits 0.

---

## Controls

Arrow keys / WASD to move freely in all directions across 3 lanes (sidewalk, top road, bottom road). Space to throw. Space on menus to start/restart.

---

## Mechanics

**Vinyl Throwing** — 15 ammo to start. Fixed 45° arc from the car window. Vinyl pickups on the road grant +5.

**Fans** — Walk the sidewalk right-to-left. Hit by vinyl → celebrate, award cash + REPUTATION. Three speed tiers: slow ($100), medium ($150), fast ($200). Three character variants used randomly.

**Haters** — Sidewalk enemies with a red indicator. Throw bottles at your car (1 HP damage). Hit a hater with vinyl → converts to a fan for 2x rewards.

**Rival Rapper Car** — Black car appears in your lane. 2 HP damage + knockback. Can't be destroyed — just dodge. Appears after ~45s, frequency increases.

**Road Pickups** — Vinyl (+5 ammo), microphone (2x REPUTATION for 8s), cash dollar (+$50), plus assorted retro items for bonus cash.

**Combo** — Consecutive catches build a cash multiplier: x2 at 3 hits in a row, x3 at 6. A missed vinyl resets the combo.

**REPUTATION Meter** — 5-segment horizontal bar in the top-left corner. Fills from catches.

**Car Health** — 3 HP. No regen. 0 HP → "WRECKED" game over.

**Difficulty Ramp** — Scroll speed, fan density, hater ratio, rival car frequency all increase gradually. Pickups get scarcer.

---

## Screens

1. **Title** — Synthwave parallax background with typewriter story intro, walking fan NPCs, animated car, high score display, "Press SPACE to Start".
2. **Gameplay HUD** — REPUTATION meter, HP hearts, cash total, ammo count, accuracy %.
3. **Game Over** — "WRECKED", final score, high score, accuracy, "Press SPACE to Retry".

---

## Milestones

### Milestone 1: Drive and Throw

**Goal:** Playable prototype with core driving and vinyl-throwing mechanics

**Features:**
- [x] Phaser 3 project setup with game canvas (896x240 at 3x scale)
- [x] 5-layer parallax scrolling background (back, sun, buildings, palms, highway)
- [x] Player car with keyboard movement (arrow keys + WASD) across 3 lanes
- [x] Vinyl throwing with spacebar (45° arc with gravity)
- [x] Fans spawning on sidewalk (3 character variants, walk right-to-left)
- [x] Vinyl-to-fan hit detection with catch animation
- [x] Cash scoring system (fan catches award $100–$200)
- [x] Ammo system (15 start, vinyl pickups grant +5)
- [x] Basic HUD: cash, ammo count, accuracy %
- [x] Title screen with synthwave parallax and high score display

**Playable Outcome:** Player drives along the boulevard, throws vinyls at fans, sees cash increase, and manages limited ammo.

**Assets Used:**
- Background layers (5): back, sun, buildings, palms, highway
- Player car sprites (5 animation frames + static)
- Pedestrian spritesheets (3 variants: walk + catch animations)
- Vinyl projectile
- Dollar icon

---

### Milestone 2: Enemies and REPUTATION

**Goal:** Full danger/reward loop with enemies, REPUTATION progression, and difficulty scaling

**Features:**
- [x] Haters with red indicators and bottle throwing (1 HP damage)
- [x] Hater-to-fan conversion on vinyl hit (2x rewards)
- [x] HP system (3 hearts, no regen) + game over screen
- [x] REPUTATION meter (5 horizontal segments with cash bonuses per segment)
- [x] Microphone power-up (2x REPUTATION for 8s)
- [x] Rival rapper car (1 HP damage + knockback, undamageable)
- [x] Bonus road pickups (vinyl, dollar, microphone, 14 retro items)
- [x] Difficulty ramp (scroll speed, spawn rates, accuracy drain)

**Playable Outcome:** Dodge haters and rival car, convert haters for bonus cash, fill REPUTATION for cash bonuses, collect pickups, survive increasing difficulty until wrecked.

**Assets Used:**
- Hater animations (hurt, special, attack for variants 1 & 3)
- Rival black car (4 animation frames)
- Battery (hater bottles)
- Microphone power-up
- 16 retro bonus items (cassette, VHS, camera, headphones, radio, watch, LCD game, VCR, film, phone, jojo, cassette player, Rubik's cube, dice, crayon, remote)

---

### Milestone 3: Polish

**Goal:** Juicy feedback, visual polish, and accessibility improvements

**Features:**
- [x] Make a living start scene, when the game is booted but before the game har started, that tells that you are an underground hiphop artist out on the street cruising thorwing out your new mixtape at peope that by that explores you and they become fans.
- [x] High score persistence (localStorage)
- [x] Difficulty tuning pass
- [x] Background music (looping chiptune track)
- [x] Sound effects (synthesized WebAudio chiptune SFX — throw, catch, convert, pickup, hurt, game over)
- [x] Combo system (consecutive catches multiply cash; miss resets)
- [ ] Mobile touch controls (stretch)

**Playable Outcome:** Same core gameplay with polished visual feedback, persistent high scores, and optional sound/mobile support.

**Assets Used:**
- Background music: Chippy Song Thing by Seth_Makes_Sounds (CC0)

---

## Testing

**Framework:** Vitest for unit tests.

**Strategy:** Game logic is extracted into pure functions under `src/logic/` (scoring, difficulty ramp, REPUTATION meter math). These are unit tested. Phaser scenes are integration-tested manually.

**Modules:**
- `src/logic/scoring.js` — Cash/rep rewards, accuracy calculation, high score check.
- `src/logic/difficulty.js` — Scroll speed, spawn delay curves, rep drain threshold.
- `src/logic/rep.js` — REPUTATION addition, segment bonuses, penalties.
- `src/logic/combo.js` — Combo multiplier thresholds.
- `src/logic/pickups.js` — Road pickup selection (vinyl, microphone, dollar, bonus items).

**Run:** `npm test` or `npx vitest` (watch mode).
