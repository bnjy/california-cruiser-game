# California Cruiser

A pixel-art side-scrolling action game built with Phaser 3. Drive a red sports car along a California boulevard at sunset, throwing vinyl records at fans to earn cash. Dodge haters and a rival rapper's car. Cash earned is your score.

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

- Throw vinyl records at fans walking the sidewalk to earn cash
- Catch vinyl pickups on the road to replenish ammo (+3)
- Avoid hater bottles (1 HP damage) and the rival rapper's car (2 HP damage)
- Hit haters with vinyls to convert them into fans for 2x rewards
- Fill the REPUTATION meter to unlock **GOLD RECORD** mode (auto-aim, 3x cash)
- Grab microphones for 2x REPUTATION gain
- Collect retro bonus items (cassettes, VHS tapes, cameras, etc.) for extra cash
- Difficulty ramps over time — survive as long as you can

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
│   └── scenes/
│       ├── BootScene.js    Asset preloading
│       ├── TitleScene.js   Title screen
│       ├── GameScene.js    Main game loop
│       └── GameOverScene.js
├── assets/                 Game-ready sprites
│   ├── cars/               Player & rival car frames
│   ├── characters/         NPC sprite sheets
│   ├── items/              Pickups & projectiles
│   ├── layers/             Parallax background layers
│   └── sound/              Background music
└── assetLibrary/           Original source assets
```

## Asset Credits

### Background & Car Sprites — Miami Synth

- **Author:** [Luis Zuno (Ansimuz)](https://ansimuz.com)
- **License:** [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)
- **Source:** [ansimuz.com](https://ansimuz.com)
- **Social:** [@ansimuz](https://twitter.com/ansimuz)

Used for: parallax background layers (sun, buildings, palms, highway) and car sprites.

### Character Sprites — Free Homeless Character Sprite Sheets

- **Author:** [CraftPix.net](https://craftpix.net)
- **License:** [CraftPix File License](https://craftpix.net/file-licenses/) — free for personal and commercial use, no attribution required
- **Source:** [craftpix.net](https://craftpix.net)

Used for: fan and hater NPC animations (walk, attack, hurt, special).

### Retro Item Sprites

- **Author:** [knekko](https://opengameart.org/users/knekko)
- **License:** [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)
- **Source:** [OpenGameArt — Retro Items](https://opengameart.org/content/retro-items)

Used for: bonus pickup items (vinyl, cassette, VHS, phone, Rubik's cube, dice, camera, etc.).

### Background Music — Chippy Song Thing

- **Author:** [Seth_Makes_Sounds](https://freesound.org/people/Seth_Makes_Sounds/)
- **License:** [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)
- **Source:** [freesound.org/s/663445](https://freesound.org/s/663445/)

Used for: looping background music throughout the game.

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server
npm run build      # Production build
npm test           # Run tests
npm run lint       # Lint src/
```
