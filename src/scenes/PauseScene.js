import { NATIVE_W, NATIVE_H } from '../config.js';

export default class PauseScene extends Phaser.Scene {
    constructor() { super('Pause'); }

    create() {
        // Pause music
        const bgm = this.sound.get('bgm');
        if (bgm?.isPlaying) bgm.pause();

        // Semi-transparent overlay
        this.add.rectangle(NATIVE_W / 2, NATIVE_H / 2, NATIVE_W, NATIVE_H, 0x000000, 0.7);

        this.add.text(NATIVE_W / 2, 40, 'PAUSED', {
            fontSize: '28px', fontFamily: 'monospace', color: '#ff6ec7',
            stroke: '#000', strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#ff00ff', blur: 8, fill: true }
        }).setOrigin(0.5);

        const options = ['CONTINUE', 'RESTART'];
        this.selected = 0;
        this.optionTexts = options.map((label, i) => {
            return this.add.text(NATIVE_W / 2, 100 + i * 30, label, {
                fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5);
        });

        this.updateSelection();

        // Keyboard input
        this.input.keyboard.on('keydown-UP', () => {
            this.selected = (this.selected - 1 + options.length) % options.length;
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            this.selected = (this.selected + 1) % options.length;
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-SPACE', () => this.confirm());
        this.input.keyboard.on('keydown-ENTER', () => this.confirm());
        this.input.keyboard.on('keydown-ESC', () => this.resume());
    }

    updateSelection() {
        this.optionTexts.forEach((text, i) => {
            if (i === this.selected) {
                text.setColor('#00ffff');
                text.setText(`> ${text.text.replace(/^> /, '')} <`);
            } else {
                text.setColor('#ffffff');
                text.setText(text.text.replace(/^> /, '').replace(/ <$/, ''));
            }
        });
    }

    confirm() {
        if (this.selected === 0) {
            this.resume();
        } else {
            this.restart();
        }
    }

    resume() {
        const bgm = this.sound.get('bgm');
        if (bgm?.isPaused) bgm.resume();
        this.scene.resume('Game');
        this.scene.stop();
    }

    restart() {
        this.scene.stop('Game');
        this.scene.start('Title');
    }
}
