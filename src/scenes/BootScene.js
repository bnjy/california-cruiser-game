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

        // Fan sprites — City Men (128x128 per frame)
        for (let c = 1; c <= 3; c++) {
            this.load.spritesheet(`cityman${c}-walk`, `assets/characters/cityman${c}/Walk.png`, {
                frameWidth: 128, frameHeight: 128
            });
        }
        // Hater sprites — Graffiti Artists (256x256 per frame)
        for (let g = 1; g <= 3; g++) {
            this.load.spritesheet(`graffiti${g}-walk`, `assets/characters/graffiti${g}/Walk.png`, {
                frameWidth: 256, frameHeight: 256
            });
            this.load.spritesheet(`graffiti${g}-hurt`, `assets/characters/graffiti${g}/Hurt_1.png`, {
                frameWidth: 256, frameHeight: 256
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
        // Shared animations — created once here, used by Title and Game
        // Fan animations — City Men
        for (let v = 1; v <= 3; v++) {
            if (!this.anims.exists(`fan-walk-${v}`)) {
                this.anims.create({
                    key: `fan-walk-${v}`,
                    frames: this.anims.generateFrameNumbers(`cityman${v}-walk`, { start: 0, end: 9 }),
                    frameRate: 10, repeat: -1
                });
            }
        }
        // Hater animations — Graffiti Artists
        for (let v = 1; v <= 3; v++) {
            if (!this.anims.exists(`hater-walk-${v}`)) {
                this.anims.create({
                    key: `hater-walk-${v}`,
                    frames: this.anims.generateFrameNumbers(`graffiti${v}-walk`, { start: 0, end: 9 }),
                    frameRate: 10, repeat: -1
                });
            }
            if (!this.anims.exists(`hater-hurt-${v}`)) {
                this.anims.create({
                    key: `hater-hurt-${v}`,
                    frames: this.anims.generateFrameNumbers(`graffiti${v}-hurt`, { start: 0, end: 4 }),
                    frameRate: 10, repeat: 0
                });
            }
        }
        if (!this.anims.exists('car-driving')) {
            const carFrames = [];
            for (let i = 1; i <= 5; i++) carFrames.push({ key: `car-run-${i}` });
            this.anims.create({ key: 'car-driving', frames: carFrames, frameRate: 10, repeat: -1 });
        }
        if (!this.anims.exists('rival-driving')) {
            const rivalFrames = [];
            for (let i = 1; i <= 4; i++) rivalFrames.push({ key: `black-car-${i}` });
            this.anims.create({ key: 'rival-driving', frames: rivalFrames, frameRate: 8, repeat: -1 });
        }

        this.scene.start('Title');
    }
}
