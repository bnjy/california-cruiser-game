import { NATIVE_W, NATIVE_H } from '../config.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOver'); }

    create(data) {
        this.cameras.main.setBackgroundColor('#1a0a2e');

        this.add.text(NATIVE_W / 2, 30, 'WRECKED', {
            fontSize: '36px', fontFamily: 'monospace', color: '#ff0044',
            stroke: '#000', strokeThickness: 5,
            shadow: { offsetX: 2, offsetY: 2, color: '#ff0000', blur: 10, fill: true }
        }).setOrigin(0.5);

        const stats = [
            `CASH: $${data.cash}`,
            `ACCURACY: ${data.accuracy}%  (${data.vinylsHit}/${data.vinylsThrown})`,
            `REP: ${data.rep}`,
            `TIME: ${data.time}s`,
        ];

        const highScore = parseInt(localStorage.getItem('california-cruiser-highscore') || '0');
        const isNew = data.cash >= highScore && data.cash > 0;
        if (isNew) stats.push('', 'NEW HIGH SCORE!');
        stats.push('', `HIGH SCORE: $${highScore}`);

        this.add.text(NATIVE_W / 2, 90, stats.join('\n'), {
            fontSize: '10px', fontFamily: 'monospace', color: '#ffffff',
            stroke: '#000', strokeThickness: 2, align: 'center', lineSpacing: 4
        }).setOrigin(0.5, 0);

        const retry = this.add.text(NATIVE_W / 2, NATIVE_H - 30, 'PRESS SPACE TO RETRY', {
            fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({ targets: retry, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Title'));
    }
}
