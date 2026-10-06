# California Cruiser

Pixel-art side-scrolling game built with Phaser 3. Throw vinyl records at fans from a red sports car cruising a California boulevard. Full game spec lives in `SPEC.md`.

## Tech Stack

- **Engine:** Phaser 3.80.1 loaded from CDN (in `index.html`)
- **Language:** Plain JavaScript, ES modules
- **Build/Dev:** Vite
- **Tests:** Vitest
- **Linting:** ESLint (flat config)

## Commands

```
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # ESLint on src/
npm test             # Run tests once
npm run test:watch   # Tests in watch mode
```

## Project Structure

```
index.html              # Entry point (loads Phaser CDN + src/main.js)
src/
  main.js               # Phaser game config & boot
  config.js             # Game constants (dimensions, speeds, REP values, pickups)
  scenes/
    BootScene.js         # Asset loading
    TitleScene.js        # Title screen
    GameScene.js         # Main gameplay
    GameOverScene.js     # Game over screen
  logic/                 # Pure functions (no Phaser dependency) — unit tested
    scoring.js           # Cash/rep rewards, accuracy, high score
    difficulty.js        # Scroll speed, spawn delay curves
    rep.js               # REP meter math, gold record, penalties
    combo.js             # Combo multiplier thresholds
    pickups.js           # Road pickup selection
    __tests__/           # Vitest tests for logic modules
assets/                  # Pixel art sprites and backgrounds
```

## Architecture Notes

- Game logic that can be pure functions goes in `src/logic/` and is unit tested. Phaser scenes handle rendering and input only.
- Native resolution is 896x240, rendered at 3x scale with pixelated rendering.
- Phaser globals (`Phaser`) are available in browser context via CDN script tag — not an npm import.

## Working With Me

- **Plan first.** For non-trivial features, show the plan before implementing.
- **Always run `npm test` after code changes.** Update tests if the change affects tested logic.
- **Run `npm run lint` after code changes** to catch issues early.
- **Keep it simple.** No levels, no shop, no aim modes, no over-engineering. This is a solo hobby project — favor the simplest approach that works.
- **Spec is truth.** All game mechanics, screens, and milestones are documented in `SPEC.md`. Refer to it for gameplay questions.
