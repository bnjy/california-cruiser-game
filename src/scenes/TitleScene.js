import { NATIVE_W, NATIVE_H, PLAYER_START_X, ROAD_BOTTOM_Y, SIDEWALK_Y } from '../config.js';

export default class TitleScene extends Phaser.Scene {
    constructor() { super('Title'); }

    create() {
        // --- Background layers ---
        this.bgBack = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-back').setOrigin(0, 0);
        this.bgSun = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-sun').setOrigin(0, 0);
        this.bgBuildings = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-buildings').setOrigin(0, 0);
        this.bgPalms = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-palms').setOrigin(0, 0);
        this.bgHighway = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-highway').setOrigin(0, 0);

        // --- Ensure animations exist ---
        this.createAnimations();

        // --- Animated player car ---
        this.add.sprite(PLAYER_START_X, ROAD_BOTTOM_Y, 'car-run-1')
            .setOrigin(0.5, 1)
            .play('car-driving');

        // --- Title ---
        this.add.text(NATIVE_W / 2, 28, 'CALIFORNIA CRUISER', {
            fontSize: '32px', fontFamily: 'monospace', color: '#ff6ec7',
            stroke: '#000', strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#ff00ff', blur: 8, fill: true }
        }).setOrigin(0.5).setDepth(10);

        // --- Typewriter narrative ---
        const storyLines = [
            "You're an underground hip-hop artist...",
            "Cruising the boulevard in your ride...",
            "Throwing your new mixtape to the people...",
            "They hear it. Your reputation grows.",
        ];
        const fullText = storyLines.join('\n');
        this.storyText = this.add.text(NATIVE_W / 2, 56, '', {
            fontSize: '12px', fontFamily: 'monospace', color: '#00ffff',
            stroke: '#000', strokeThickness: 2,
            align: 'center', lineSpacing: 4
        }).setOrigin(0.5, 0).setDepth(10);

        this.typeIndex = 0;
        this.typeTimer = this.time.addEvent({
            delay: 35,
            callback: () => {
                this.storyText.setText(fullText.substring(0, this.typeIndex + 1));
                this.typeIndex++;
                if (this.typeIndex >= fullText.length) {
                    this.typeTimer.remove(false);
                    this.typeTimer = null;
                    this.showStartPrompt();
                }
            },
            loop: true
        });

        // --- High score ---
        const highScore = localStorage.getItem('california-cruiser-highscore') || 0;
        if (highScore > 0) {
            this.add.text(NATIVE_W / 2, 158, `HIGH SCORE: $${highScore}`, {
                fontSize: '12px', fontFamily: 'monospace', color: '#ffff00',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(10);
        }

        // --- Start prompt (hidden until typewriter finishes) ---
        this.startText = this.add.text(NATIVE_W / 2, NATIVE_H - 40, 'PRESS SPACE TO START', {
            fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setAlpha(0).setDepth(10);

        // --- Walking fans on sidewalk ---
        this.titleFans = [];
        this.spawnTitleFan();
        this.fanSpawnTimer = this.time.addEvent({
            delay: 3000,
            callback: this.spawnTitleFan,
            callbackScope: this,
            loop: true
        });

        // --- Background music ---
        if (!this.sound.get('bgm')?.isPlaying) {
            this.sound.play('bgm', { loop: true, volume: 0.4 });
        }

        // --- Input ---
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    }

    createAnimations() {
        for (let v = 1; v <= 3; v++) {
            if (!this.anims.exists(`fan-walk-${v}`)) {
                this.anims.create({
                    key: `fan-walk-${v}`,
                    frames: this.anims.generateFrameNumbers(`cityman${v}-walk`, { start: 0, end: 9 }),
                    frameRate: 10, repeat: -1
                });
            }
        }
        if (!this.anims.exists('car-driving')) {
            const carFrames = [];
            for (let i = 1; i <= 5; i++) carFrames.push({ key: `car-run-${i}` });
            this.anims.create({ key: 'car-driving', frames: carFrames, frameRate: 10, repeat: -1 });
        }
    }

    showStartPrompt() {
        this.startText.setAlpha(1);
        this.tweens.add({ targets: this.startText, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });
    }

    spawnTitleFan() {
        const variant = Phaser.Math.Between(1, 3);
        const fan = this.add.sprite(NATIVE_W + 20, SIDEWALK_Y, `cityman${variant}-walk`)
            .setOrigin(0.5, 1)
            .play(`fan-walk-${variant}`);
        fan.setData('speed', Phaser.Math.Between(20, 40));
        this.titleFans.push(fan);
    }

    startGame() {
        if (this.typeTimer) {
            this.typeTimer.remove(false);
            this.typeTimer = null;
        }
        if (this.fanSpawnTimer) {
            this.fanSpawnTimer.remove(false);
            this.fanSpawnTimer = null;
        }
        this.scene.start('Game');
    }

    update(_, delta) {
        const dt = delta / 1000;

        this.bgBack.tilePositionX += 0.1;
        this.bgSun.tilePositionX += 0.15;
        this.bgBuildings.tilePositionX += 0.3;
        this.bgPalms.tilePositionX += 0.5;
        this.bgHighway.tilePositionX += 1;

        // Move and clean up title fans
        for (let i = this.titleFans.length - 1; i >= 0; i--) {
            const fan = this.titleFans[i];
            fan.x -= fan.getData('speed') * dt;
            if (fan.x < -30) {
                fan.destroy();
                this.titleFans.splice(i, 1);
            }
        }
    }
}
