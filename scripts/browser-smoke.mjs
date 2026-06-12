/* eslint-disable */
/**
 * Browser smoke test: drives the real game in headless Chrome and verifies
 * the core loop (throw → hit → reward → combo → miss reset) without errors.
 *
 * Requires the Vite dev server running on localhost:5173.
 * Run: node scripts/browser-smoke.mjs
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()} [${m.location().url}]`);
});
page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`);
});

await page.goto('http://localhost:5173/');
await page.waitForFunction(() => window.game?.scene?.isActive('Title'), null, { timeout: 15000 });
await page.keyboard.press('Space');
await page.waitForFunction(() => window.game.scene.isActive('Game'), null, { timeout: 5000 });

// Drive a real vinyl→fan hit through the actual update loop
async function hitPedestrian(kind) {
    await page.evaluate((kind) => {
        const scene = window.game.scene.keys.Game;
        kind === 'fan' ? scene.spawnFan() : scene.spawnHater();
        const group = kind === 'fan' ? scene.fans : scene.haters;
        const ped = group.getChildren().at(-1);
        ped.x = scene.player.x + 80;
        ped.setData('speed', 0);
        scene.throwVinyl();
    }, kind);
    await page.waitForTimeout(1200);
}

await hitPedestrian('fan');
await hitPedestrian('fan');
await hitPedestrian('hater');
await hitPedestrian('fan'); // 4th consecutive hit → x2 combo active

// Deliberate miss: throw with nothing in range → combo must reset
await page.evaluate(() => window.game.scene.keys.Game.throwVinyl());
await page.waitForTimeout(2500);

const state = await page.evaluate(() => {
    const scene = window.game.scene.keys.Game;
    return {
        thrown: scene.vinylsThrown,
        hits: scene.vinylsHit,
        combo: scene.combo,
        cash: scene.cash,
        rep: scene.rep,
        fps: Math.round(window.game.loop.actualFps),
        audio: scene.sound.context?.state ?? 'n/a',
    };
});

// Force game over (fresh localStorage → NEW HIGH SCORE banner shows, the
// tallest layout) and check no Game Over texts overlap each other
await page.evaluate(() => {
    const scene = window.game.scene.keys.Game;
    scene.isInvincible = false;
    scene.hp = 1;
    scene.takeDamage(1);
});
await page.waitForFunction(() => window.game.scene.isActive('GameOver'), null, { timeout: 5000 });
await page.waitForTimeout(300);

const textOverlaps = await page.evaluate(() => {
    const texts = window.game.scene.keys.GameOver.children.list.filter((o) => o.type === 'Text');
    const found = [];
    for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
            const a = texts[i].getBounds();
            const b = texts[j].getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(a, b)) {
                found.push(`"${texts[i].text.split('\n')[0]}" overlaps "${texts[j].text.split('\n')[0]}"`);
            }
        }
    }
    return found;
});

await browser.close();

console.log('state:', JSON.stringify(state));
const failures = [];
if (errors.length) failures.push(`page errors:\n${errors.join('\n')}`);
if (state.hits !== 4) failures.push(`expected 4 hits, got ${state.hits}`);
if (state.combo !== 0) failures.push(`expected combo reset to 0 after miss, got ${state.combo}`);
if (state.cash < 100) failures.push(`expected cash from rewards, got ${state.cash}`);
if (state.fps < 10) failures.push(`game loop appears stalled (fps ${state.fps})`);
if (textOverlaps.length) failures.push(`Game Over text overlaps:\n${textOverlaps.join('\n')}`);

if (failures.length) {
    console.error('FAIL\n' + failures.join('\n'));
    process.exit(1);
}
console.log('PASS');
