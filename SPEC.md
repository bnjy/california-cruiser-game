# California Cruiser

A pixel-art side-scrolling action game. Drive a red sports car along a California boulevard at sunset, throwing vinyl records at fans to earn cash. Dodge haters and a rival rapper's car. Cash earned is your score.

**Vibe:** TMNT: Turtles in Time, Super Star Wars, Mega Man 7.

**Tech:** Phaser 3 (CDN), ES modules under `src/`, 896x240 native at 3x scale.

---

## Core Loop

1. Car auto-scrolls right along the boulevard.
2. Fans walk the sidewalk. Press **Space** to throw a vinyl — it arcs toward them.
3. Fan catches it → cash floats up, REP meter fills.
4. Miss → vinyl wasted (ammo is limited).
5. Dodge hater bottles and the rival rapper's car to survive.
6. Speed and danger ramp up over time. Game ends when HP hits 0.

---

## Controls

Arrow keys / WASD to move freely in all directions across 3 lanes (sidewalk, top road, bottom road). Space to throw. Space on menus to start/restart.

---

## Mechanics

**Vinyl Throwing** — 15 ammo to start. Fixed 45° arc from the car window. Vinyl pickups on the road grant +3.

**Fans** — Walk the sidewalk right-to-left. Hit by vinyl → celebrate, award cash + REP. Three speed tiers: slow ($100), medium ($150), fast ($200). Three character variants used randomly.

**Jaywalkers** — Pedestrians on the road lanes. Hit one with your car → -15 REP penalty.

**Haters** — Sidewalk enemies with a red indicator. Throw bottles at your car (1 HP damage). Hit a hater with vinyl → converts to a fan for 2x rewards.

**Rival Rapper Car** — Black car appears in your lane. 2 HP damage + knockback. Can't be destroyed — just dodge. Appears after ~45s, frequency increases.

**Road Pickups** — Vinyl (+3 ammo), microphone (2x REP for 8s), cash dollar (+$50), plus assorted retro items for bonus cash.

**REP Meter** — 5-segment bar. Fills from catches. Each segment awards a cash bonus. Fill all 5 → **GOLD RECORD mode** (5s of auto-aim, 3x cash). Resets after.

**Car Health** — 3 HP. No regen. 0 HP → "WRECKED" game over.

**Difficulty Ramp** — Scroll speed, fan density, hater ratio, rival car frequency all increase gradually. Pickups get scarcer.

---

## Screens

1. **Title** — Synthwave parallax background, "Press SPACE to Start", high score.
2. **Gameplay HUD** — REP meter, HP hearts, cash total, ammo count, accuracy %.
3. **Game Over** — "WRECKED", final score, high score, accuracy, "Press SPACE to Retry".

---

## Milestones

### M1 — Drive and Throw ✓
Core loop: parallax scrolling, player car, fans on sidewalk, vinyl throwing with arc, hit detection, cash + ammo system, basic HUD, title screen.

### M2 — Enemies and REP ✓
Haters with bottle throwing, hater conversion, HP system + game over, REP meter + GOLD RECORD mode, microphone power-up, rival rapper car, bonus pickups, difficulty ramp.

### M3 — Polish
Screen shake, particles, power-up VFX, GOLD RECORD VFX, high score localStorage, decorative idle NPCs, difficulty tuning. Stretch: sound, mobile touch, combo system.
