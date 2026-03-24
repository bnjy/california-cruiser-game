export default class BootScene extends Phaser.Scene {
    constructor() { super('Boot'); }

    preload() {
        // Background layers
        this.load.image('bg-back', 'assets/layers/back.png');
        this.load.image('bg-sun', 'assets/layers/sun.png');
        this.load.image('bg-buildings', 'assets/layers/buildings.png');
        this.load.image('bg-palms', 'assets/layers/palms.png');
        this.load.image('bg-highway', 'assets/layers/highway.png');

        // Player car frames
        for (let i = 1; i <= 5; i++) {
            this.load.image(`car-run-${i}`, `assets/cars/red/car-running${i}.png`);
        }
        this.load.image('car-static', 'assets/cars/red/car1.png');

        // Black rival car frames
        for (let i = 1; i <= 4; i++) {
            this.load.image(`black-car-${i}`, `assets/cars/black/${i}Rpix128.png`);
        }

        // Pedestrian sprite sheets (128x128 per frame)
        for (let h = 1; h <= 3; h++) {
            this.load.spritesheet(`homeless${h}-walk`, `assets/characters/homeless${h}/Walk.png`, {
                frameWidth: 128, frameHeight: 128
            });
            this.load.spritesheet(`homeless${h}-attack1`, `assets/characters/homeless${h}/Attack_1.png`, {
                frameWidth: 128, frameHeight: 128
            });
        }
        // Hater-only animations (homeless 1 & 3)
        for (const h of [1, 3]) {
            this.load.spritesheet(`homeless${h}-hurt`, `assets/characters/homeless${h}/Hurt.png`, {
                frameWidth: 128, frameHeight: 128
            });
            this.load.spritesheet(`homeless${h}-special`, `assets/characters/homeless${h}/Special.png`, {
                frameWidth: 128, frameHeight: 128
            });
        }

        // Items
        this.load.image('vinyl', 'assets/items/vinyl.png');
        this.load.image('dollar', 'assets/items/single_dollar.png');
        this.load.image('battery', 'assets/items/battery1.png');
        this.load.image('microphone', 'assets/items/microphone.png');

        // Bonus retro items
        this.load.image('casette', 'assets/items/casette.png');
        this.load.image('vhs', 'assets/items/vhs.png');
        this.load.image('camera', 'assets/items/camera.png');
        this.load.image('headphone', 'assets/items/Headphone.png');
        this.load.image('radio1', 'assets/items/radio1.png');
        this.load.image('watch', 'assets/items/watch.png');
        this.load.image('lcdgame', 'assets/items/LCDGame.png');
        this.load.image('vcr', 'assets/items/vcr.png');
        this.load.image('film', 'assets/items/film.png');
        this.load.image('phone', 'assets/items/phone.png');
        this.load.image('jojo', 'assets/items/jojo.png');
        this.load.image('casetteplayer', 'assets/items/casetteplayer.png');
        this.load.image('rubik1', 'assets/items/rubik1.png');
        this.load.image('dice1', 'assets/items/dice1.png');
        this.load.image('crayon', 'assets/items/crayon.png');
        this.load.image('remote', 'assets/items/remote.png');

        // Audio
        this.load.audio('bgm', 'assets/sound/663445__seth_makes_sounds__chippy-song-thing.wav');
    }

    create() {
        this.scene.start('Title');
    }
}
