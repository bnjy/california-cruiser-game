import { NATIVE_W, NATIVE_H, PLAYER_START_X, ROAD_BOTTOM_Y, SIDEWALK_Y } from '../config.js';
import { loadHighScore } from '../logic/highscore.js';

export default class TitleScene extends Phaser.Scene {
    constructor() { super('Title'); }

    create() {
        // --- Background layers ---
        this.bgBack = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-back').setOrigin(0, 0);
        this.bgSun = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-sun').setOrigin(0, 0);
        this.bgBuildings = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-buildings').setOrigin(0, 0);
        this.bgPalms = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-palms').setOrigin(0, 0);
        this.bgHighway = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-highway').setOrigin(0, 0);

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
            "You're an underground hip-hop artist.",
            "Cruising the boulevard in the city of Angels.",
            "Throwing your new mixtape to the people.",
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
        const highScore = loadHighScore(localStorage);
        if (highScore > 0) {
            this.add.text(NATIVE_W / 2, 158, `HIGH SCORE: $${highScore}`, {
                fontSize: '12px', fontFamily: 'monospace', color: '#ffff00',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(10);
        }

        // --- Start prompt (hidden until typewriter finishes) ---
        const prompt = this.sys.game.device.input.touch ? 'TAP TO START' : 'PRESS SPACE TO START';
        this.startText = this.add.text(NATIVE_W / 2, NATIVE_H - 40, prompt, {
            fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
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
        const bgm = this.sound.get('bgm');
        if (bgm?.isPaused) {
            bgm.resume();
        } else if (!bgm?.isPlaying) {
            this.sound.play('bgm', { loop: true, volume: 0.4 });
        }

        // --- Input ---
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());
        this.input.once('pointerdown', () => this.startGame());
    }

    showStartPrompt() {
        this.startText.setAlpha(1);
        this.tweens.add({ targets: this.startText, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });
    }

    spawnTitleFan() {
        const variant = Phaser.Math.Between(1, 3);
        const fan = this.add.sprite(NATIVE_W + 60, SIDEWALK_Y, `cityman${variant}-walk`)
            .setOrigin(0.5, 1)
            .setScale(0.7)
            .play(`fan-walk-${variant}`);
        fan.flipX = true;
        fan.setData('speed', Phaser.Math.Between(30, 60));
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

        // Frame-rate independent: 60 px/s at the highway layer
        const speed = 60 * dt;
        this.bgBack.tilePositionX += speed * 0.1;
        this.bgSun.tilePositionX += speed * 0.15;
        this.bgBuildings.tilePositionX += speed * 0.3;
        this.bgPalms.tilePositionX += speed * 0.5;
        this.bgHighway.tilePositionX += speed;

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
