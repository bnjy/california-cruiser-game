// ============================================================
// California Cruiser — Milestone 1: Drive and Throw
// ============================================================

const NATIVE_W = 896;
const NATIVE_H = 240;
const SCALE = 3;

// Y positions (native coordinates) — bottom of sprite (origin 0.5, 1)
// 3 lanes on the visible road/sidewalk surface of the 240px canvas:
const SIDEWALK_Y = 195;     // sidewalk lane — just above the curb
const ROAD_TOP_Y = 218;     // top road lane — between the white lines
const ROAD_BOTTOM_Y = 238;  // bottom road lane — near canvas bottom

// Player movement bounds (Y = bottom of car sprite since origin is 0.5, 1)
const PLAYER_START_X = 160;
const PLAYER_MIN_X = 60;
const PLAYER_MAX_X = 400;
const PLAYER_MIN_Y = SIDEWALK_Y;    // top bound: can't go above sidewalk
const PLAYER_MAX_Y = ROAD_BOTTOM_Y; // bottom bound: bottom road lane
const PLAYER_SPEED = 120; // pixels/sec in all directions
const BASE_SCROLL_SPEED = 80;

// ============================================================
// Boot Scene — load all assets
// ============================================================
class BootScene extends Phaser.Scene {
    constructor() { super('Boot'); }

    preload() {
        // Background layers
        this.load.image('bg-back', 'assets/layers/back.png');
        this.load.image('bg-sun', 'assets/layers/sun.png');
        this.load.image('bg-buildings', 'assets/layers/buildings.png');
        this.load.image('bg-palms', 'assets/layers/palms.png');
        this.load.image('bg-highway', 'assets/layers/highway.png');

        // Player car frames (individual images → animation)
        for (let i = 1; i <= 5; i++) {
            this.load.image(`car-run-${i}`, `assets/cars/red/car-running${i}.png`);
        }
        this.load.image('car-static', 'assets/cars/red/car1.png');

        // Pedestrian sprite sheets (128x128 per frame)
        for (let h = 1; h <= 3; h++) {
            this.load.spritesheet(`homeless${h}-walk`, `assets/characters/homeless${h}/Walk.png`, {
                frameWidth: 128, frameHeight: 128
            });
            this.load.spritesheet(`homeless${h}-attack1`, `assets/characters/homeless${h}/Attack_1.png`, {
                frameWidth: 128, frameHeight: 128
            });
        }

        // Items
        this.load.image('vinyl', 'assets/items/vinyl.png');
        this.load.image('dollar', 'assets/items/single_dollar.png');
    }

    create() {
        this.scene.start('Title');
    }
}

// ============================================================
// Title Scene
// ============================================================
class TitleScene extends Phaser.Scene {
    constructor() { super('Title'); }

    create() {
        // Parallax background for title
        this.bgBack = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-back').setOrigin(0, 0);
        this.bgSun = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-sun').setOrigin(0, 0);
        this.bgBuildings = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-buildings').setOrigin(0, 0);
        this.bgPalms = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-palms').setOrigin(0, 0);
        this.bgHighway = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-highway').setOrigin(0, 0);

        // Static car on the road
        this.add.image(PLAYER_START_X, ROAD_BOTTOM_Y, 'car-static').setOrigin(0.5, 1);

        // Title text
        const titleStyle = {
            fontSize: '32px',
            fontFamily: 'monospace',
            color: '#ff6ec7',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#ff00ff', blur: 8, fill: true }
        };
        this.add.text(NATIVE_W / 2, 50, 'CALIFORNIA CRUISER', titleStyle).setOrigin(0.5);

        // Subtitle
        const subStyle = {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#00ffff',
            stroke: '#000',
            strokeThickness: 2
        };
        this.add.text(NATIVE_W / 2, 80, 'Throw vinyls. Build your rep. Own the boulevard.', subStyle).setOrigin(0.5);

        // High score
        const highScore = localStorage.getItem('california-cruiser-highscore') || 0;
        if (highScore > 0) {
            this.add.text(NATIVE_W / 2, 100, `HIGH SCORE: $${highScore}`, {
                fontSize: '10px', fontFamily: 'monospace', color: '#ffff00',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5);
        }

        // Start prompt (blinking)
        const startText = this.add.text(NATIVE_W / 2, NATIVE_H - 40, 'PRESS SPACE TO START', {
            fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Game');
        });
    }

    update() {
        // Slow parallax scroll on title
        this.bgBack.tilePositionX += 0.1;
        this.bgSun.tilePositionX += 0.15;
        this.bgBuildings.tilePositionX += 0.3;
        this.bgPalms.tilePositionX += 0.5;
        this.bgHighway.tilePositionX += 1;
    }
}

// ============================================================
// Game Scene — Milestone 1 gameplay
// ============================================================
class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }

    create() {
        // State
        this.cash = 0;
        this.rep = 0;
        this.vinylAmmo = 15;
        this.vinylsThrown = 0;
        this.vinylsHit = 0;
        this.scrollSpeed = BASE_SCROLL_SPEED;

        // --- Background layers (parallax) ---
        this.bgBack = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-back').setOrigin(0, 0);
        this.bgSun = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-sun').setOrigin(0, 0);
        this.bgBuildings = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-buildings').setOrigin(0, 0);
        this.bgPalms = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-palms').setOrigin(0, 0);
        this.bgHighway = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-highway').setOrigin(0, 0);

        // --- Player car ---
        this.createPlayerCar();

        // --- Fan group ---
        this.fans = this.add.group();
        this.fanSpawnTimer = this.time.addEvent({
            delay: 1800,
            callback: this.spawnFan,
            callbackScope: this,
            loop: true
        });
        // Spawn first fan quickly
        this.time.delayedCall(500, this.spawnFan, [], this);

        // --- Vinyl road pickups ---
        this.vinylPickups = this.physics.add.group();
        this.pickupTimer = this.time.addEvent({
            delay: 5000,
            callback: this.spawnVinylPickup,
            callbackScope: this,
            loop: true
        });

        // --- Cash float texts ---
        this.cashFloats = this.add.group();

        // --- Pedestrians on road (jaywalkers) ---
        this.jaywalkers = this.add.group();
        this.jaywalkerTimer = this.time.addEvent({
            delay: 4000,
            callback: this.spawnJaywalker,
            callbackScope: this,
            loop: true
        });

        // --- Vinyl projectile tracking (manual, no physics group) ---
        this.activeVinyls = [];

        // --- Input ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey('W');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceBar.on('down', this.throwVinyl, this);

        // --- HUD ---
        this.createHUD();
    }

    createPlayerCar() {
        // Create animation from individual frames
        const carFrames = [];
        for (let i = 1; i <= 5; i++) {
            this.textures.get(`car-run-${i}`);
            carFrames.push({ key: `car-run-${i}` });
        }

        if (!this.anims.exists('car-driving')) {
            this.anims.create({
                key: 'car-driving',
                frames: carFrames,
                frameRate: 10,
                repeat: -1
            });
        }

        this.player = this.add.sprite(PLAYER_START_X, ROAD_BOTTOM_Y, 'car-run-1').setOrigin(0.5, 1);
        this.player.setDepth(10); // Car renders above pedestrians
        this.player.play('car-driving');
    }

    // Returns which lane the player is closest to (for collision checks)
    getPlayerLane() {
        const y = this.player.y;
        const dBottom = Math.abs(y - ROAD_BOTTOM_Y);
        const dTop = Math.abs(y - ROAD_TOP_Y);
        const dSidewalk = Math.abs(y - SIDEWALK_Y);
        if (dSidewalk <= dTop && dSidewalk <= dBottom) return 'sidewalk';
        if (dTop <= dBottom) return 'road-top';
        return 'road-bottom';
    }

    // --- Fan spawning ---
    spawnFan() {
        const variant = Phaser.Math.Between(1, 3);
        const animKey = `homeless${variant}-walk`;
        const catchAnimKey = `homeless${variant}-attack1`;

        // Create walk animation if it doesn't exist
        const walkKey = `fan-walk-${variant}`;
        if (!this.anims.exists(walkKey)) {
            this.anims.create({
                key: walkKey,
                frames: this.anims.generateFrameNumbers(`homeless${variant}-walk`, { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }

        const catchKey = `fan-catch-${variant}`;
        if (!this.anims.exists(catchKey)) {
            const attackFrameCount = variant === 2 ? 10 : 5;
            this.anims.create({
                key: catchKey,
                frames: this.anims.generateFrameNumbers(catchAnimKey, { start: 0, end: attackFrameCount - 1 }),
                frameRate: 12,
                repeat: 0
            });
        }

        // On the sidewalk lane
        const fanY = Phaser.Math.Between(SIDEWALK_Y - 5, SIDEWALK_Y + 5);
        const fan = this.add.sprite(NATIVE_W + 60, fanY, `homeless${variant}-walk`).setOrigin(0.5, 1);
        fan.setScale(0.7); // Scale down to fit the scene proportions
        fan.play(walkKey);
        fan.flipX = true; // Face left (walking direction)

        // Store metadata
        fan.setData('variant', variant);
        fan.setData('speed', Phaser.Math.Between(30, 60));
        fan.setData('caught', false);
        fan.setData('catchKey', catchKey);

        this.fans.add(fan);
    }

    // --- Jaywalker spawning (pedestrians on the road lanes) ---
    spawnJaywalker() {
        const variant = Phaser.Math.Between(1, 3);
        const walkKey = `fan-walk-${variant}`;
        // Ensure animation exists
        if (!this.anims.exists(walkKey)) {
            this.anims.create({
                key: walkKey,
                frames: this.anims.generateFrameNumbers(`homeless${variant}-walk`, { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Only spawn on the 3 defined lanes
        const lanes = [SIDEWALK_Y, ROAD_TOP_Y, ROAD_BOTTOM_Y];
        const y = Phaser.Utils.Array.GetRandom(lanes);

        const jaywalker = this.add.sprite(NATIVE_W + 60, y, `homeless${variant}-walk`).setOrigin(0.5, 1);
        jaywalker.setScale(0.55);
        jaywalker.play(walkKey);
        jaywalker.flipX = true;
        jaywalker.setData('speed', Phaser.Math.Between(20, 40));
        jaywalker.setData('hit', false);
        jaywalker.setData('laneY', y);

        this.jaywalkers.add(jaywalker);
    }

    // --- Check car vs jaywalker collision (proximity-based) ---
    checkJaywalkerCollisions() {
        const jaywalkerChildren = this.jaywalkers.getChildren();
        for (let i = jaywalkerChildren.length - 1; i >= 0; i--) {
            const jw = jaywalkerChildren[i];
            if (!jw.active || jw.getData('hit')) continue;

            const dx = Math.abs(jw.x - this.player.x);
            const dy = Math.abs(jw.y - this.player.y);

            // Close enough horizontally and vertically
            if (dx < 45 && dy < 20) {
                // Car hit a jaywalker — REP penalty
                jw.setData('hit', true);
                this.rep = Math.max(0, this.rep - 15);
                this.updateHUD();

                // Show penalty text
                this.showFloatText(jw.x, jw.y - 50, '-15 REP', '#ff4444');

                // Jaywalker knocked away
                this.tweens.add({
                    targets: jw,
                    y: jw.y - 30,
                    x: jw.x - 40,
                    alpha: 0,
                    angle: -90,
                    duration: 400,
                    onComplete: () => jw.destroy()
                });
            }
        }
    }

    // --- Vinyl throwing ---
    throwVinyl() {
        if (this.vinylAmmo <= 0) return;

        this.vinylAmmo--;
        this.vinylsThrown++;
        this.updateHUD();

        // Launch from the car window area (top-center of car)
        const startX = this.player.x + 10;
        const startY = this.player.y - 50;

        const vinyl = this.add.image(startX, startY, 'vinyl').setOrigin(0.5);
        vinyl.setScale(0.7);

        // Manual velocity — fixed 45° arc upward-right
        const throwSpeed = 200;
        const vinylData = {
            sprite: vinyl,
            vx: throwSpeed * 0.7,   // rightward
            vy: -throwSpeed * 0.8,  // upward
            gravity: 320,
            active: true
        };

        this.activeVinyls.push(vinylData);
    }

    // --- Vinyl pickup spawning ---
    spawnVinylPickup() {
        const lanes = [ROAD_TOP_Y, ROAD_BOTTOM_Y];
        const y = Phaser.Utils.Array.GetRandom(lanes) - 20;

        const pickup = this.physics.add.sprite(NATIVE_W + 20, y, 'vinyl').setOrigin(0.5);
        pickup.setScale(0.7);
        pickup.body.setAllowGravity(false);
        pickup.setData('speed', this.scrollSpeed);

        // Gentle bob animation
        this.tweens.add({
            targets: pickup,
            y: y - 4,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.vinylPickups.add(pickup);
    }

    // --- Float text effect ---
    showFloatText(x, y, message, color = '#00ff00') {
        const text = this.add.text(x, y, message, {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: color,
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    // --- Dollar float from fan ---
    showDollarFloat(x, y) {
        const dollar = this.add.image(x, y, 'dollar').setOrigin(0.5);
        dollar.setScale(0.15);

        this.tweens.add({
            targets: dollar,
            y: y - 40,
            alpha: 0,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => dollar.destroy()
        });
    }

    // --- HUD ---
    createHUD() {
        const hudStyle = {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ffffff',
            stroke: '#000',
            strokeThickness: 3
        };

        this.cashText = this.add.text(NATIVE_W - 10, 10, '$0', {
            ...hudStyle, fontSize: '14px', color: '#00ff00'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.ammoText = this.add.text(NATIVE_W - 10, 28, 'VINYL: 15', {
            ...hudStyle, color: '#ff6ec7'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.accuracyText = this.add.text(NATIVE_W - 10, 42, 'ACC: ---', {
            ...hudStyle, color: '#00ffff'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.repText = this.add.text(10, 10, 'REP: 0', {
            ...hudStyle, fontSize: '12px', color: '#ffff00'
        }).setOrigin(0, 0).setScrollFactor(0);
    }

    updateHUD() {
        this.cashText.setText(`$${this.cash}`);
        this.ammoText.setText(`VINYL: ${this.vinylAmmo}`);
        const acc = this.vinylsThrown > 0
            ? Math.round((this.vinylsHit / this.vinylsThrown) * 100)
            : 0;
        this.accuracyText.setText(`ACC: ${this.vinylsThrown > 0 ? acc + '%' : '---'}`);
        this.repText.setText(`REP: ${this.rep}`);
    }

    // --- Update vinyl positions (manual physics) ---
    updateVinyls(dt) {
        for (let i = this.activeVinyls.length - 1; i >= 0; i--) {
            const v = this.activeVinyls[i];
            if (!v.active) {
                this.activeVinyls.splice(i, 1);
                continue;
            }

            // Apply gravity
            v.vy += v.gravity * dt;
            v.sprite.x += v.vx * dt;
            v.sprite.y += v.vy * dt;

            // Spin
            v.sprite.angle += 400 * dt;

            // Check if vinyl is near any fan — hit detection
            if (v.sprite.y >= SIDEWALK_Y - 50 && v.sprite.y <= SIDEWALK_Y + 25) {
                const fans = this.fans.getChildren();
                let hit = false;
                for (let j = 0; j < fans.length; j++) {
                    const fan = fans[j];
                    if (!fan.active || fan.getData('caught')) continue;

                    const dist = Math.abs(v.sprite.x - fan.x);
                    if (dist < 40) {
                        this.vinylHit(v, fan);
                        hit = true;
                        break;
                    }
                }
                if (hit) continue;
            }

            // Vinyl went off screen or past sidewalk — remove
            if (v.sprite.y > NATIVE_H + 30 || v.sprite.x > NATIVE_W + 60 || v.sprite.y < -30) {
                v.sprite.destroy();
                v.active = false;
            }
        }
    }

    vinylHit(vinylData, fan) {
        // Destroy vinyl
        vinylData.sprite.destroy();
        vinylData.active = false;
        fan.setData('caught', true);

        this.vinylsHit++;
        const cashGain = 100;
        const repGain = 10;
        this.cash += cashGain;
        this.rep += repGain;
        this.updateHUD();

        // Fan catches — play catch animation
        const catchKey = fan.getData('catchKey');
        fan.play(catchKey);
        fan.setData('speed', 0); // Stop moving

        // Dollar float up
        this.showDollarFloat(fan.x, fan.y - 60);
        this.showFloatText(fan.x, fan.y - 80, `+$${cashGain}`);
        this.showFloatText(fan.x + 30, fan.y - 70, `+${repGain} REP`, '#ffff00');

        // Remove fan after catch animation
        this.time.delayedCall(800, () => {
            if (fan.active) {
                this.tweens.add({
                    targets: fan,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => fan.destroy()
                });
            }
        });
    }

    // --- Pickup collection ---
    checkPickupCollisions() {
        const pickups = this.vinylPickups.getChildren();
        const playerBounds = {
            x: this.player.x - 50,
            y: this.player.y - 40,
            w: 100,
            h: 40
        };

        for (let i = pickups.length - 1; i >= 0; i--) {
            const pickup = pickups[i];
            if (!pickup.active) continue;

            if (Math.abs(pickup.x - this.player.x) < 50 &&
                Math.abs(pickup.y - (this.player.y - 20)) < 25) {
                // Collected!
                this.vinylAmmo += 3;
                this.updateHUD();
                this.showFloatText(pickup.x, pickup.y - 10, '+3 VINYL', '#ff6ec7');

                // Brief flash
                this.tweens.add({
                    targets: pickup,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => pickup.destroy()
                });
            }
        }
    }

    // --- Main update loop ---
    update(time, delta) {
        const dt = delta / 1000;

        // Parallax scrolling
        const speed = this.scrollSpeed * dt;
        this.bgBack.tilePositionX += speed * 0.1;
        this.bgSun.tilePositionX += speed * 0.15;
        this.bgBuildings.tilePositionX += speed * 0.3;
        this.bgPalms.tilePositionX += speed * 0.5;
        this.bgHighway.tilePositionX += speed * 1.0;

        // Free 4-directional movement (continuous while held)
        if (this.cursors.up.isDown || this.keyW.isDown) {
            this.player.y = Math.max(PLAYER_MIN_Y, this.player.y - PLAYER_SPEED * dt);
        }
        if (this.cursors.down.isDown || this.keyS.isDown) {
            this.player.y = Math.min(PLAYER_MAX_Y, this.player.y + PLAYER_SPEED * dt);
        }
        if (this.cursors.left.isDown || this.keyA.isDown) {
            this.player.x = Math.max(PLAYER_MIN_X, this.player.x - PLAYER_SPEED * dt);
        }
        if (this.cursors.right.isDown || this.keyD.isDown) {
            this.player.x = Math.min(PLAYER_MAX_X, this.player.x + PLAYER_SPEED * dt);
        }

        // Move fans left (sidewalk)
        const fanChildren = this.fans.getChildren();
        for (let i = fanChildren.length - 1; i >= 0; i--) {
            const fan = fanChildren[i];
            if (!fan.active) continue;
            const fanSpeed = fan.getData('speed') || 40;
            fan.x -= (fanSpeed + this.scrollSpeed * 0.3) * dt;
            if (fan.x < -80) fan.destroy();
        }

        // Move jaywalkers left (road)
        const jwChildren = this.jaywalkers.getChildren();
        for (let i = jwChildren.length - 1; i >= 0; i--) {
            const jw = jwChildren[i];
            if (!jw.active) continue;
            const jwSpeed = jw.getData('speed') || 30;
            jw.x -= (jwSpeed + this.scrollSpeed * 0.5) * dt;
            if (jw.x < -80) jw.destroy();
        }

        // Move vinyl pickups left
        const pickupChildren = this.vinylPickups.getChildren();
        for (let i = pickupChildren.length - 1; i >= 0; i--) {
            const pickup = pickupChildren[i];
            if (!pickup.active) continue;
            pickup.x -= this.scrollSpeed * dt;
            if (pickup.x < -30) pickup.destroy();
        }

        // Update vinyl projectiles (manual physics)
        this.updateVinyls(dt);

        // Check collisions
        this.checkJaywalkerCollisions();
        this.checkPickupCollisions();
    }
}

// ============================================================
// Phaser Game Config
// ============================================================
const config = {
    type: Phaser.AUTO,
    width: NATIVE_W,
    height: NATIVE_H,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: SCALE
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, TitleScene, GameScene]
};

const game = new Phaser.Game(config);
