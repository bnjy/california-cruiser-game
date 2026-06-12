/**
 * Tiny WebAudio chiptune-style sound effects — synthesized, no audio assets.
 *
 * Uses the AudioContext from Phaser's sound manager. Silently does nothing
 * if the browser fell back to HTML5/no audio or the context isn't running yet.
 */

function tone(ctx, { type = 'square', from, to = from, delay = 0, dur = 0.1, vol = 0.08 }) {
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
}

const SFX = {
    throw: (ctx) => tone(ctx, { from: 600, to: 220, dur: 0.12 }),
    catch: (ctx) => {
        tone(ctx, { from: 523, dur: 0.06 });
        tone(ctx, { from: 659, delay: 0.06, dur: 0.06 });
        tone(ctx, { from: 784, delay: 0.12, dur: 0.1 });
    },
    convert: (ctx) => {
        tone(ctx, { from: 659, dur: 0.06 });
        tone(ctx, { from: 784, delay: 0.06, dur: 0.06 });
        tone(ctx, { from: 988, delay: 0.12, dur: 0.06 });
        tone(ctx, { from: 1319, delay: 0.18, dur: 0.12 });
    },
    pickup: (ctx) => tone(ctx, { type: 'triangle', from: 880, to: 1319, dur: 0.09, vol: 0.1 }),
    hurt: (ctx) => tone(ctx, { type: 'sawtooth', from: 200, to: 70, dur: 0.25, vol: 0.1 }),
    gameover: (ctx) => {
        tone(ctx, { from: 392, dur: 0.15 });
        tone(ctx, { from: 330, delay: 0.15, dur: 0.15 });
        tone(ctx, { from: 262, delay: 0.3, dur: 0.15 });
        tone(ctx, { type: 'sawtooth', from: 196, to: 65, delay: 0.45, dur: 0.5, vol: 0.1 });
    },
};

export function playSfx(scene, name) {
    const ctx = scene.sound.context;
    if (!ctx || ctx.state !== 'running') return;
    const fx = SFX[name];
    if (fx) fx(ctx);
}
