# California Cruiser

A pixel-art side-scrolling action game built with Phaser 3. Drive a red sports car along a California boulevard at sunset, throwing vinyl records at fans to earn cash. Dodge haters and a rival rapper's car. Cash earned is your score.

**Vibe:** TMNT: Turtles in Time, Super Star Wars, Mega Man 7

![Phaser 3](https://img.shields.io/badge/Phaser-3.80.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## How to Play

1. Open `index.html` in a browser
2. Press **Space** to start

### Controls

| Key | Action |
|-----|--------|
| Arrow keys / WASD | Move across 3 lanes |
| Space | Throw vinyl record |

### Gameplay

- Throw vinyl records at fans walking the sidewalk to earn cash
- Catch vinyl pickups on the road to replenish ammo (+3)
- Avoid hater bottles (1 HP damage) and the rival rapper's car (2 HP damage)
- Hit haters with vinyls to convert them into fans for 2x rewards
- Fill the REP meter to unlock **GOLD RECORD** mode (auto-aim, 3x cash)
- Grab microphones for 2x REP gain
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
│   └── layers/             Parallax background layers
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

## Development

No build step required. Just serve the files:

```bash
# Using Python
python3 -m http.server 8000

# Using Node
npx serve .
```

Then open `http://localhost:8000` in your browser.
