# California Cruiser

A pixel-art side-scrolling action game built with Phaser 3. Drive a red sports car along a California boulevard at sunset, throwing vinyl records at hip-hop heads to earn cash. Dodge taggers and a rival rapper's car. Cash earned is your score.

**Inspired by childhood gaming memories such as** TMNT: Turtles in Time, Super Star Wars, Mega Man 7

![Phaser 3](https://img.shields.io/badge/Phaser-3.80.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## How to Play

1. Run `npm run dev` and open in browser
2. Read the story intro, then press **Space** to start

### Controls

| Key               | Action              |
|-------------------|---------------------|
| Arrow keys / WASD | Move across 3 lanes |
| Space             | Throw vinyl record  |
| Esc               | Pause/restart menu  |

### Gameplay

- Throw vinyl records at hip-hop heads walking the sidewalk to earn cash — faster walkers pay more ($100/$150/$200)
- Chain catches without missing to build a combo multiplier (x2 at 3 hits, x3 at 6)
- Catch vinyl pickups on the road to replenish ammo (+5)
- Dodge tagger bottles and the rival rapper's car — both deal 1 HP damage
- Hit taggers with vinyls to convert them into fans for 2x rewards
- Fill the REPUTATION meter — each segment unlocks a cash bonus
- Grab microphones for 2x REPUTATION gain
- Collect retro bonus items (cassettes, VHS tapes, cameras, etc.) for extra cash
- Difficulty ramps over time — enemies come faster, pickups get scarcer — survive as long as you can

## Tech Stack

- **Engine:** [Phaser 3](https://phaser.io/) (v3.80.1 via CDN)
- **Architecture:** ES modules
- **Resolution:** 896x240 native at 3x scale

## Project Structure

```
├── index.html              Entry point
├── SPEC.md                 Game design document
├── src/
│   ├── main.js             Phaser game initialization
│   ├── config.js           Game constants & configuration
│   ├── sfx.js              Synthesized WebAudio sound effects
│   ├── scenes/
│   │   ├── BootScene.js    Asset preloading
│   │   ├── TitleScene.js   Title screen
│   │   ├── GameScene.js    Main game loop
│   │   ├── PauseScene.js   Pause menu
│   │   └── GameOverScene.js
│   └── logic/              Pure functions (unit tested)
│       ├── scoring.js      Cash/rep rewards, accuracy
│       ├── difficulty.js   Speed and spawn rate curves
│       ├── rep.js          REP meter math and segment bonuses
│       ├── combo.js        Combo multiplier thresholds
│       ├── pickups.js      Road pickup selection
│       └── highscore.js    High score persistence
├── scripts/
│   └── browser-smoke.mjs   Headless-browser gameplay smoke test
└── public/assets/          Game-ready sprites (served/copied as-is by Vite)
    ├── cars/               Player & rival car frames
    ├── characters/         NPC sprite sheets
    ├── items/              Pickups & projectiles
    ├── layers/             Parallax background layers
    └── sound/              Background music
```

## Asset Credits

### Background & Car Sprites — Miami Synth

- **Author:** [Luis Zuno (Ansimuz)](https://ansimuz.com)
- **License:** [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)
- **Source:** [ansimuz.com](https://ansimuz.com)
- **Social:** [@ansimuz](https://twitter.com/ansimuz)

Used for: parallax background layers (sun, buildings, palms, highway) and car sprites.

### Character Sprites

- **Author:** [CraftPix.net](https://craftpix.net)
- **License:** [CraftPix File License](https://craftpix.net/file-licenses/) — free for personal and commercial use, no attribution required
- **Source:** [craftpix.net](https://craftpix.net)

Used for: Characters & NPC animations (walk, attack, hurt, special).

### Retro Item Sprites

- **Author:** [knekko](https://opengameart.org/users/knekko)
- **License:** [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)
- **Source:** [OpenGameArt — Retro Items](https://opengameart.org/content/retro-items)

Used for: bonus pickup items (vinyl, cassette, VHS, phone, Rubik's cube, dice, camera, etc.).

### Background Music — Chippy Song Thing

- **Author:** [Seth_Makes_Sounds](https://freesound.org/people/Seth_Makes_Sounds/)
- **License:** [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)
- **Source:** [freesound.org/s/663445](https://freesound.org/s/663445/)

Used for: looping background music throughout the game. Sound effects are synthesized at runtime with WebAudio — no audio asset files.

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server
npm run build      # Production build
npm test           # Run unit tests
npm run lint       # Lint src/

# Browser smoke test (requires dev server running + Chrome)
node scripts/browser-smoke.mjs
```
