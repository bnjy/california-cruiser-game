import {
    NATIVE_W, NATIVE_H,
    SIDEWALK_Y, ROAD_TOP_Y, ROAD_BOTTOM_Y,
    PLAYER_START_X, PLAYER_MIN_X, PLAYER_MAX_X, PLAYER_MIN_Y, PLAYER_MAX_Y, PLAYER_SPEED,
    BASE_SCROLL_SPEED,
    REP_SEGMENTS,
    FAN_TIERS,
    MIC_DURATION,
} from '../config.js';
import { rollPickup } from '../logic/pickups.js';
import { fanCashReward, haterCashReward, fanRepReward, haterRepReward, formatAccuracy } from '../logic/scoring.js';
import { saveHighScore } from '../logic/highscore.js';
import { calcScrollSpeed, calcFanDelay, calcHaterDelay, calcRivalCarDelay, calcPickupDelay, shouldDrainRep } from '../logic/difficulty.js';
import { addRep as calcAddRep, calcSegment, segmentBonuses, calcSegmentProgress, applyRepPenalty } from '../logic/rep.js';
import { comboMultiplier } from '../logic/combo.js';
import { playSfx } from '../sfx.js';

export default class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }

    create() {
        // --- State ---
        this.cash = 0;
        this.rep = 0;
        this.lastSegmentAwarded = 0;
        this.hp = 3;
        this.maxHp = 3;
        this.vinylAmmo = 15;
        this.vinylsThrown = 0;
        this.vinylsHit = 0;
        this.combo = 0;
        this.scrollSpeed = BASE_SCROLL_SPEED;
        this.gameTime = 0;
        this.isInvincible = false;
        this.micActive = false;
        this.micTimer = null;
        this.gameOver = false;

        // --- Background layers ---
        this.bgBack = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-back').setOrigin(0, 0);
        this.bgSun = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-sun').setOrigin(0, 0);
        this.bgBuildings = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-buildings').setOrigin(0, 0);
        this.bgPalms = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-palms').setOrigin(0, 0);
        this.bgHighway = this.add.tileSprite(0, 0, NATIVE_W, NATIVE_H, 'bg-highway').setOrigin(0, 0);

        // --- Player car ---
        this.createPlayerCar();

        // --- Groups ---
        this.fans = this.add.group();
        this.haters = this.add.group();
        this.activeVinyls = [];
        this.activeBottles = [];
        this.roadPickups = this.add.group();
        this.rivalCars = this.add.group();

        // --- Spawn timers ---
        this.fanTimer = this.time.addEvent({ delay: calcFanDelay(0), callback: this.spawnFan, callbackScope: this, loop: true });
        this.time.delayedCall(500, this.spawnFan, [], this);
        this.haterTimer = this.time.addEvent({ delay: calcHaterDelay(0), callback: this.spawnHater, callbackScope: this, loop: true });
        this.pickupTimer = this.time.addEvent({ delay: calcPickupDelay(0), callback: this.spawnRoadPickup, callbackScope: this, loop: true });
        this.rivalCarTimer = this.time.addEvent({ delay: calcRivalCarDelay(0), callback: this.spawnRivalCar, callbackScope: this, loop: true });

        // --- Input ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey('W');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceBar.on('down', this.throwVinyl, this);
        this.input.keyboard.on('keydown-ESC', this.pauseGame, this);

        // Touch: hold + drag on left half steers (virtual stick), tap right half throws
        this.input.addPointer(1);
        this.input.on('pointerdown', (pointer, over) => {
            if (over.length === 0 && pointer.x >= NATIVE_W / 2) this.throwVinyl();
        });
        if (this.sys.game.device.input.touch) {
            this.add.text(NATIVE_W - 120, 8, '||', {
                fontSize: '14px', fontFamily: 'monospace', color: '#ffffff', stroke: '#000', strokeThickness: 3,
                padding: { x: 6, y: 2 }
            }).setDepth(20).setInteractive().on('pointerdown', this.pauseGame, this);
        }

        // --- HUD ---
        this.createHUD();
    }

    createPlayerCar() {
        this.player = this.add.sprite(PLAYER_START_X, ROAD_BOTTOM_Y, 'car-run-1').setOrigin(0.5, 1);
        this.player.setDepth(10);
        this.player.play('car-driving');
    }

    // ========== SPAWNING ==========

    spawnFan() {
        if (this.gameOver) return;
        const variant = Phaser.Math.Between(1, 3);
        const fanY = Phaser.Math.Between(SIDEWALK_Y - 5, SIDEWALK_Y + 5);
        const fan = this.add.sprite(NATIVE_W + 60, fanY, `cityman${variant}-walk`).setOrigin(0.5, 1);
        fan.setScale(0.7);
        fan.play(`fan-walk-${variant}`);
        fan.flipX = true;
        const tier = Phaser.Math.Between(0, FAN_TIERS.length - 1);
        fan.setData('variant', variant);
        fan.setData('tier', tier);
        fan.setData('speed', Phaser.Math.Between(FAN_TIERS[tier].minSpeed, FAN_TIERS[tier].maxSpeed));
        fan.setData('caught', false);
        this.fans.add(fan);
    }

    spawnHater() {
        if (this.gameOver) return;
        const variant = Phaser.Math.Between(1, 3);
        const haterY = Phaser.Math.Between(SIDEWALK_Y - 5, SIDEWALK_Y + 5);
        const hater = this.add.sprite(NATIVE_W + 60, haterY, `graffiti${variant}-walk`).setOrigin(0.5, 1);
        hater.setScale(0.46);
        hater.play(`hater-walk-${variant}`);
        hater.flipX = true;
        hater.setData('variant', variant);
        hater.setData('tier', Phaser.Math.Between(0, FAN_TIERS.length - 1));
        hater.setData('speed', Phaser.Math.Between(20, 40));
        hater.setData('converted', false);
        hater.setData('throwing', false);
        hater.setData('throwCooldown', Phaser.Math.Between(2000, 4000));
        hater.setData('lastThrow', 0);

        const indicator = this.add.circle(hater.x, hater.y - 70, 4, 0xff0000).setDepth(5);
        hater.setData('indicator', indicator);

        this.haters.add(hater);
    }

    spawnRoadPickup() {
        if (this.gameOver) return;
        const lanes = [ROAD_TOP_Y, ROAD_BOTTOM_Y];
        const y = Phaser.Utils.Array.GetRandom(lanes) - 20;

        const { key: pickupKey, type: pickupType, value: pickupValue } = rollPickup(Math.random(), Math.random());

        const pickup = this.add.image(NATIVE_W + 20, y, pickupKey).setOrigin(0.5);
        pickup.setScale(pickupKey === 'dollar' ? 0.15 : (pickupKey === 'microphone' ? 1.5 : 0.7));
        pickup.setData('type', pickupType);
        pickup.setData('value', pickupValue);
        pickup.setData('key', pickupKey);
        pickup.setDepth(5);

        this.tweens.add({
            targets: pickup, y: y - 4, duration: 400,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        this.roadPickups.add(pickup);
    }

    spawnRivalCar() {
        if (this.gameOver) return;
        const lanes = [ROAD_TOP_Y, ROAD_BOTTOM_Y];
        const y = Phaser.Utils.Array.GetRandom(lanes);

        const rival = this.add.sprite(NATIVE_W + 150, y, 'black-car-1').setOrigin(0.5, 1);
        rival.play('rival-driving');
        rival.setDepth(9);
        rival.setData('speed', Math.min(this.scrollSpeed + 100, 280));
        rival.setData('hit', false);
        rival.flipX = true;

        this.rivalCars.add(rival);
    }

    // ========== HATER BOTTLE THROWING ==========

    haterThrowBottle(hater) {
        if (hater.getData('converted') || !hater.active) return;

        hater.setData('throwing', true);
        const variant = hater.getData('variant');
        // No throw spritesheet exists — freeze the walk pose during the wind-up
        hater.anims.stop();
        hater.setData('speed', 0);

        this.time.delayedCall(600, () => {
            if (!hater.active || hater.getData('converted')) return;

            const bottle = this.add.image(hater.x, hater.y - 40, 'battery').setOrigin(0.5);
            bottle.setScale(0.6);
            bottle.setDepth(8);

            this.activeBottles.push({
                sprite: bottle, vx: -80, vy: 60, gravity: 120, active: true
            });
        });

        this.time.delayedCall(1300, () => {
            if (!hater.active || hater.getData('converted')) return;
            hater.setData('throwing', false);
            hater.setData('speed', Phaser.Math.Between(20, 40));
            hater.play(`hater-walk-${variant}`);
        });
    }

    // ========== PAUSE ==========

    pauseGame() {
        if (this.gameOver) return;
        this.scene.pause();
        this.scene.launch('Pause');
    }

    // ========== VINYL THROWING ==========

    throwVinyl() {
        if (this.vinylAmmo <= 0 || this.gameOver) return;

        this.vinylAmmo--;
        this.vinylsThrown++;
        this.updateHUD();
        playSfx(this, 'throw');

        const startX = this.player.x + 10;
        const startY = this.player.y - 50;

        const vinyl = this.add.image(startX, startY, 'vinyl').setOrigin(0.5);
        vinyl.setScale(0.7);
        vinyl.setDepth(8);

        const throwSpeed = 200;
        const vx = throwSpeed * 0.7;
        const vy = -throwSpeed * 0.8;

        this.activeVinyls.push({
            sprite: vinyl, vx, vy,
            gravity: 320,
            active: true
        });
    }

    // ========== DAMAGE & HP ==========

    takeDamage(amount) {
        if (this.isInvincible || this.gameOver) return;

        this.hp = Math.max(0, this.hp - amount);
        this.updateHUD();
        this.showFloatText(this.player.x, this.player.y - 70, `-${amount} HP`, '#ff4444');
        this.isInvincible = true;
        playSfx(this, 'hurt');

        this.player.setTint(0xff0000);
        this.tweens.add({
            targets: this.player, alpha: 0.3, duration: 100,
            yoyo: true, repeat: 7,
            onComplete: () => {
                this.player.clearTint();
                this.player.setAlpha(1);
                this.isInvincible = false;
            }
        });

        if (this.hp <= 0) this.triggerGameOver();
    }

    triggerGameOver() {
        this.gameOver = true;
        playSfx(this, 'gameover');

        const newHighScore = saveHighScore(localStorage, this.cash);

        this.fanTimer.remove();
        this.haterTimer.remove();
        this.pickupTimer.remove();
        this.rivalCarTimer.remove();

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver', {
                cash: this.cash,
                newHighScore,
                rep: Math.round(this.rep),
                accuracy: formatAccuracy(this.vinylsThrown, this.vinylsHit),
                vinylsThrown: this.vinylsThrown,
                vinylsHit: this.vinylsHit,
                time: Math.floor(this.gameTime)
            });
        });
    }

    // ========== REP METER ==========

    addRep(amount) {
        this.rep = calcAddRep(this.rep, amount, this.micActive);

        const currentSegment = calcSegment(this.rep);
        const bonuses = segmentBonuses(this.lastSegmentAwarded, currentSegment);
        for (const bonus of bonuses) {
            this.cash += bonus;
        }
        this.lastSegmentAwarded = Math.max(this.lastSegmentAwarded, currentSegment);

        this.updateHUD();
    }

    activateMicrophone() {
        this.micActive = true;
        this.showFloatText(this.player.x, this.player.y - 70, '2x REPUTATION!', '#ff6ec7');
        if (this.micTimer) this.micTimer.remove();
        this.micTimer = this.time.delayedCall(MIC_DURATION, () => {
            this.micActive = false;
            this.micTimer = null;
            this.updateHUD();
        });
    }

    // ========== COLLISION CHECKS ==========

    checkVinylHits(dt) {
        for (let i = this.activeVinyls.length - 1; i >= 0; i--) {
            const v = this.activeVinyls[i];
            if (!v.active) { this.activeVinyls.splice(i, 1); continue; }

            v.vy += v.gravity * dt;
            v.sprite.x += v.vx * dt;
            v.sprite.y += v.vy * dt;
            v.sprite.angle += 400 * dt;

            let hit = false;

            if (v.sprite.y >= SIDEWALK_Y - 60 && v.sprite.y <= SIDEWALK_Y + 30) {
                for (const fan of this.fans.getChildren()) {
                    if (!fan.active || fan.getData('caught')) continue;
                    if (Math.abs(v.sprite.x - fan.x) < 40) {
                        this.vinylHitFan(v, fan);
                        hit = true; break;
                    }
                }
                if (!hit) {
                    for (const hater of this.haters.getChildren()) {
                        if (!hater.active || hater.getData('converted')) continue;
                        if (Math.abs(v.sprite.x - hater.x) < 40) {
                            this.vinylHitHater(v, hater);
                            hit = true; break;
                        }
                    }
                }
            }

            if (hit) continue;
            if (v.sprite.y > NATIVE_H + 30 || v.sprite.x > NATIVE_W + 60 || v.sprite.y < -30) {
                v.sprite.destroy(); v.active = false;
                this.combo = 0;
            }
        }
    }

    vinylHitFan(vinylData, fan) {
        vinylData.sprite.destroy();
        vinylData.active = false;
        fan.setData('caught', true);
        this.vinylsHit++;
        this.combo++;

        const mult = comboMultiplier(this.combo);
        const cashGain = fanCashReward(fan.getData('tier')) * mult;
        const repGain = fanRepReward();
        this.cash += cashGain;
        this.addRep(repGain);
        this.updateHUD();
        playSfx(this, 'catch');

        fan.setData('speed', 0);

        this.showDollarFloat(fan.x, fan.y - 60);
        this.showFloatText(fan.x, fan.y - 80, `+$${cashGain}`);
        if (mult > 1) this.showFloatText(fan.x, fan.y - 95, `COMBO x${mult}!`, '#ffff00');

        this.time.delayedCall(800, () => {
            if (fan.active) {
                this.tweens.add({ targets: fan, alpha: 0, duration: 300, onComplete: () => fan.destroy() });
            }
        });
    }

    vinylHitHater(vinylData, hater) {
        vinylData.sprite.destroy();
        vinylData.active = false;
        hater.setData('converted', true);
        this.vinylsHit++;
        this.combo++;

        const mult = comboMultiplier(this.combo);
        const cashGain = haterCashReward(hater.getData('tier')) * mult;
        const repGain = haterRepReward();
        this.cash += cashGain;
        this.addRep(repGain);
        this.updateHUD();
        playSfx(this, 'convert');

        const variant = hater.getData('variant');

        const indicator = hater.getData('indicator');
        if (indicator) indicator.destroy();

        hater.play(`hater-hurt-${variant}`);
        hater.setData('speed', 0);

        this.time.delayedCall(400, () => {
            if (!hater.active) return;
            this.showDollarFloat(hater.x, hater.y - 60);
            this.showFloatText(hater.x, hater.y - 80, `+$${cashGain}`, '#00ff00');
            this.showFloatText(hater.x + 30, hater.y - 70, 'CONVERTED!', '#ff6ec7');
            if (mult > 1) this.showFloatText(hater.x, hater.y - 95, `COMBO x${mult}!`, '#ffff00');
        });

        this.time.delayedCall(1200, () => {
            if (hater.active) {
                this.tweens.add({ targets: hater, alpha: 0, duration: 300, onComplete: () => hater.destroy() });
            }
        });
    }

    checkBottleHits(dt) {
        for (let i = this.activeBottles.length - 1; i >= 0; i--) {
            const b = this.activeBottles[i];
            if (!b.active) { this.activeBottles.splice(i, 1); continue; }

            b.vy += b.gravity * dt;
            b.sprite.x += b.vx * dt;
            b.sprite.y += b.vy * dt;
            b.sprite.angle += 300 * dt;

            const dx = Math.abs(b.sprite.x - this.player.x);
            const dy = Math.abs(b.sprite.y - (this.player.y - 25));
            if (dx < 50 && dy < 25) {
                b.sprite.destroy(); b.active = false;
                this.takeDamage(1);
                continue;
            }

            if (b.sprite.y > NATIVE_H + 20 || b.sprite.x < -30) {
                b.sprite.destroy(); b.active = false;
            }
        }
    }

    checkPickupCollisions() {
        for (const pickup of [...this.roadPickups.getChildren()]) {
            if (!pickup.active) continue;
            if (Math.abs(pickup.x - this.player.x) < 50 &&
                Math.abs(pickup.y - (this.player.y - 20)) < 25) {
                const type = pickup.getData('type');
                const value = pickup.getData('value');

                if (type === 'vinyl') {
                    this.vinylAmmo += value;
                    this.showFloatText(Math.round(pickup.x), Math.round(pickup.y) - 30, `+${value} VINYL`);
                } else if (type === 'microphone') {
                    this.activateMicrophone();
                } else if (type === 'cash') {
                    this.cash += value;
                    this.showFloatText(Math.round(pickup.x), Math.round(pickup.y) - 10, `+$${value}`, '#00ff00');
                }

                pickup.setActive(false);
                this.updateHUD();
                playSfx(this, 'pickup');
                this.tweens.killTweensOf(pickup);
                this.tweens.add({
                    targets: pickup, scaleX: pickup.scaleX * 1.5, scaleY: pickup.scaleY * 1.5,
                    alpha: 0, duration: 200, onComplete: () => pickup.destroy()
                });
            }
        }
    }

    checkRivalCarCollisions() {
        for (const rival of [...this.rivalCars.getChildren()]) {
            if (!rival.active || rival.getData('hit')) continue;
            const dx = Math.abs(rival.x - this.player.x);
            const dy = Math.abs(rival.y - this.player.y);
            if (dx < 70 && dy < 20) {
                rival.setData('hit', true);
                this.takeDamage(1);

                const knockY = this.player.y < (ROAD_TOP_Y + ROAD_BOTTOM_Y) / 2 ? ROAD_BOTTOM_Y : ROAD_TOP_Y;
                this.tweens.add({
                    targets: this.player, y: knockY, duration: 200, ease: 'Power2'
                });
            }
        }
    }

    // ========== HUD ==========

    createHUD() {
        const s = { fontSize: '12px', fontFamily: 'monospace', color: '#ffffff', stroke: '#000', strokeThickness: 3 };

        this.cashText = this.add.text(NATIVE_W - 10, 8, '$0', { ...s, fontSize: '14px', color: '#00ff00' }).setOrigin(1, 0).setDepth(20);
        this.ammoText = this.add.text(NATIVE_W - 10, 26, 'VINYL: 15', { ...s, color: '#ff6ec7' }).setOrigin(1, 0).setDepth(20);
        this.accuracyText = this.add.text(NATIVE_W - 10, 40, 'ACC: ---', { ...s, color: '#00ffff' }).setOrigin(1, 0).setDepth(20);

        this.hpIcons = [];
        for (let i = 0; i < this.maxHp; i++) {
            const icon = this.add.text(10 + i * 14, NATIVE_H - 16, '\u2665', {
                fontSize: '12px', fontFamily: 'monospace', color: '#ff0044', stroke: '#000', strokeThickness: 2
            }).setDepth(20);
            this.hpIcons.push(icon);
        }

        this.repLabel = this.add.text(8, 10, 'REPUTATION', {
            fontSize: '10px', fontFamily: 'monospace', color: '#ffffff', stroke: '#000', strokeThickness: 2
        }).setOrigin(0, 0.5).setDepth(20);

        this.repSegments = [];
        const colors = [0x44ff44, 0x88ff44, 0xffff00, 0xff8800, 0xff0044];
        const barStartX = 82;
        const barY = 10;
        const segW = 24;
        const segH = 8;
        const gap = 2;
        for (let i = 0; i < REP_SEGMENTS; i++) {
            const x = barStartX + i * (segW + gap);
            const bg = this.add.rectangle(x, barY, segW, segH, 0x333333).setOrigin(0, 0.5).setDepth(20);
            const fill = this.add.rectangle(x, barY, segW, segH, colors[i]).setOrigin(0, 0.5).setDepth(20);
            fill.setScale(0, 1);
            this.repSegments.push({ bg, fill, color: colors[i] });
        }

        this.micText = this.add.text(NATIVE_W / 2, 8, '2x REPUTATION!', {
            fontSize: '12px', fontFamily: 'monospace', color: '#ff6ec7', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5, 0).setDepth(20).setAlpha(0);
    }

    updateHUD() {
        this.cashText.setText(`$${this.cash}`);
        this.ammoText.setText(`VINYL: ${this.vinylAmmo}`);
        this.accuracyText.setText(`ACC: ${formatAccuracy(this.vinylsThrown, this.vinylsHit)}`);

        for (let i = 0; i < this.maxHp; i++) {
            this.hpIcons[i].setAlpha(i < this.hp ? 1 : 0.2);
        }

        for (let i = 0; i < REP_SEGMENTS; i++) {
            this.repSegments[i].fill.setScale(calcSegmentProgress(this.rep, i), 1);
        }

        this.micText.setAlpha(this.micActive ? 1 : 0);
    }

    // ========== EFFECTS ==========

    showFloatText(x, y, message, color = '#00ff00') {
        const text = this.add.text(x, y, message, {
            fontSize: '12px', fontFamily: 'monospace', color
        }).setOrigin(0.5).setDepth(25);
        this.tweens.add({
            targets: text, y: y - 40, alpha: 0, duration: 1800,
            ease: 'Power2', onComplete: () => text.destroy()
        });
    }

    showDollarFloat(x, y) {
        const dollar = this.add.image(x, y, 'dollar').setOrigin(0.5).setScale(0.15).setDepth(25);
        this.tweens.add({
            targets: dollar, y: y - 50, alpha: 0, scaleX: 0.2, scaleY: 0.2,
            duration: 2000, ease: 'Power2', onComplete: () => dollar.destroy()
        });
    }

    // ========== DIFFICULTY RAMP ==========

    updateDifficulty() {
        this.scrollSpeed = calcScrollSpeed(this.gameTime);

        this.fanTimer.delay = calcFanDelay(this.gameTime);
        this.haterTimer.delay = calcHaterDelay(this.gameTime);
        this.rivalCarTimer.delay = calcRivalCarDelay(this.gameTime);
        this.pickupTimer.delay = calcPickupDelay(this.gameTime);
    }

    // ========== MAIN UPDATE ==========

    update(_, delta) {
        if (this.gameOver) return;
        const dt = delta / 1000;
        this.gameTime += dt;

        // Parallax
        const speed = this.scrollSpeed * dt;
        this.bgBack.tilePositionX += speed * 0.1;
        this.bgSun.tilePositionX += speed * 0.15;
        this.bgBuildings.tilePositionX += speed * 0.3;
        this.bgPalms.tilePositionX += speed * 0.5;
        this.bgHighway.tilePositionX += speed * 1.0;

        // Player movement
        const stick = this.input.manager.pointers.find(p => p.isDown && p.downX < NATIVE_W / 2);
        const sx = stick ? stick.x - stick.downX : 0;
        const sy = stick ? stick.y - stick.downY : 0;
        const DEAD = 6;
        if (this.cursors.up.isDown || this.keyW.isDown || sy < -DEAD)
            this.player.y = Math.max(PLAYER_MIN_Y, this.player.y - PLAYER_SPEED * dt);
        if (this.cursors.down.isDown || this.keyS.isDown || sy > DEAD)
            this.player.y = Math.min(PLAYER_MAX_Y, this.player.y + PLAYER_SPEED * dt);
        if (this.cursors.left.isDown || this.keyA.isDown || sx < -DEAD)
            this.player.x = Math.max(PLAYER_MIN_X, this.player.x - PLAYER_SPEED * dt);
        if (this.cursors.right.isDown || this.keyD.isDown || sx > DEAD)
            this.player.x = Math.min(PLAYER_MAX_X, this.player.x + PLAYER_SPEED * dt);

        // Move fans
        for (const fan of [...this.fans.getChildren()]) {
            if (!fan.active) continue;
            fan.x -= (fan.getData('speed') + this.scrollSpeed * 0.3) * dt;
            if (fan.x < -80) fan.destroy();
        }

        // Move haters + bottle throwing logic
        for (const hater of [...this.haters.getChildren()]) {
            if (!hater.active) continue;
            const spd = hater.getData('speed') || 0;
            hater.x -= (spd + this.scrollSpeed * 0.3) * dt;

            const ind = hater.getData('indicator');
            if (ind && ind.active) { ind.x = hater.x; ind.y = hater.y - 70; }

            if (!hater.getData('converted') && !hater.getData('throwing') && hater.x < NATIVE_W - 50) {
                const lastThrow = hater.getData('lastThrow') || 0;
                const cooldown = hater.getData('throwCooldown') || 3000;
                if (this.time.now - lastThrow > cooldown) {
                    hater.setData('lastThrow', this.time.now);
                    this.haterThrowBottle(hater);
                }
            }

            if (hater.x < -80) {
                if (ind) ind.destroy();
                hater.destroy();
            }
        }

        // Move road pickups
        for (const pickup of [...this.roadPickups.getChildren()]) {
            if (!pickup.active) continue;
            pickup.x -= this.scrollSpeed * dt;
            if (pickup.x < -30) {
                this.tweens.killTweensOf(pickup);
                pickup.destroy();
            }
        }

        // Move rival cars
        for (const rival of [...this.rivalCars.getChildren()]) {
            if (!rival.active) continue;
            rival.x -= rival.getData('speed') * dt;
            if (rival.x < -200) rival.destroy();
        }

        // Update projectiles & collisions
        this.checkVinylHits(dt);
        this.checkBottleHits(dt);
        this.checkPickupCollisions();
        this.checkRivalCarCollisions();

        // Difficulty ramp
        this.updateDifficulty();

        // REP drain if accuracy < 30%
        if (shouldDrainRep(this.vinylsThrown, this.vinylsHit)) {
            this.rep = applyRepPenalty(this.rep, 2 * dt);
            this.updateHUD();
        }
    }
}
