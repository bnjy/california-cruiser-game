import { NATIVE_W, NATIVE_H, PLAYER_START_X, ROAD_BOTTOM_Y } from '../config.js';

export default class TitleScene extends Phaser.Scene {
    constructor() { super('Title'); }

    create() {
        this.bgBack = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-back').setOrigin(0, 0);
        this.bgSun = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-sun').setOrigin(0, 0);
        this.bgBuildings = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-buildings').setOrigin(0, 0);
        this.bgPalms = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-palms').setOrigin(0, 0);
        this.bgHighway = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-highway').setOrigin(0, 0);

        this.add.image(PLAYER_START_X, ROAD_BOTTOM_Y, 'car-static').setOrigin(0.5, 1);

        this.add.text(NATIVE_W / 2, 50, 'CALIFORNIA CRUISER', {
            fontSize: '32px', fontFamily: 'monospace', color: '#ff6ec7',
            stroke: '#000', strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#ff00ff', blur: 8, fill: true }
        }).setOrigin(0.5);

        this.add.text(NATIVE_W / 2, 80, 'Throw vinyls. Build your rep. Own the boulevard.', {
            fontSize: '10px', fontFamily: 'monospace', color: '#00ffff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        const highScore = localStorage.getItem('california-cruiser-highscore') || 0;
        if (highScore > 0) {
            this.add.text(NATIVE_W / 2, 100, `HIGH SCORE: $${highScore}`, {
                fontSize: '10px', fontFamily: 'monospace', color: '#ffff00',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5);
        }

        const startText = this.add.text(NATIVE_W / 2, NATIVE_H - 40, 'PRESS SPACE TO START', {
            fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({ targets: startText, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game'));
    }

    update() {
        this.bgBack.tilePositionX += 0.1;
        this.bgSun.tilePositionX += 0.15;
        this.bgBuildings.tilePositionX += 0.3;
        this.bgPalms.tilePositionX += 0.5;
        this.bgHighway.tilePositionX += 1;
    }
}
