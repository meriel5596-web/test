// sound.mjs - deterministic score + SFX for film2 (15 s, 120 BPM), synthesized in code. No samples, no network.
// Usage: node sound.mjs out.wav
// The music is a soft 120 BPM bed (C - Am - F - G, G leads back into C so the loop closes);
// SFX sit on the film's own events (dotState / drawShape times in index.html). Silence before the two big hits.
import fs from 'node:fs';

const SR = 48000, DUR = 15, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function add(t0, len, fn, gain = 1, pan = 0) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n; i++) { const k = s0 + i; if (k < 0 || k >= N) continue; const v = fn(i / SR); L[k] += v * gl; R[k] += v * gr; }
}

/* ---------- music bed ---------- */
const BEAT = .5;
// music level envelope: drops out before the two big hits (fill at 5.95, flip at 12.0), thins for the end card
function bed(t) {
  if (t > 5.55 && t < 5.95) return .15;
  if (t > 11.45 && t < 12.0) return .1;
  return 1;
}
// kick
for (let b = 0; b < 30; b++) {
  const t = b * BEAT; if (bed(t) < .5) continue;
  add(t, .32, x => { const f = 45 + 75 * Math.exp(-x * 30); return Math.sin(2 * Math.PI * f * x) * Math.exp(-x * 11); }, .55);
}
// hats on the off-beats (one-pole high-passed noise)
for (let b = 0; b < 30; b++) {
  const t = b * BEAT + .25; if (bed(t) < .5) continue;
  let prev = 0;
  add(t, .06, x => { const n = rnd(); const h = n - prev; prev = n; return h * Math.exp(-x * 70); }, .08, (b % 2 ? .3 : -.3));
}
// pad chords: C (0-4) Am (4-8) F (8-12) G (12-15)
const chords = [[0, 4, [48, 60, 64, 67]], [4, 8, [45, 57, 60, 64]], [8, 12, [41, 57, 60, 65]], [12, 15, [43, 55, 59, 62]]];
chords.forEach(([a, b, notes]) => notes.forEach((m, i) => {
  const f = hz(m), len = b - a;
  add(a, len, x => {
    const env = Math.min(1, x / .08) * Math.min(1, (len - x) / .06) * bed(a + x);
    const v = Math.sin(2 * Math.PI * f * x) + .25 * Math.sin(2 * Math.PI * f * 2.003 * x) + .12 * Math.sin(2 * Math.PI * f * 3 * x);
    return v * env * (1 + .08 * Math.sin(2 * Math.PI * .5 * x));
  }, i === 0 ? .07 : .035, (i - 1.5) * .25);
}));
// bass pulse on each beat (root)
chords.forEach(([a, b, notes]) => {
  for (let t = a; t < b - .01; t += BEAT) add(t, .42, x => Math.sin(2 * Math.PI * hz(notes[0] - 12) * x) * Math.exp(-x * 6) * bed(t + x), .16);
});
// plucked arpeggio while the type orbits (8.0-10.0)
const arp = [65, 69, 72, 77, 72, 69, 65, 72];
for (let i = 0; i < 16; i++) {
  const t = 8 + i * .125, m = arp[i % arp.length];
  add(t, .3, x => (Math.sin(2 * Math.PI * hz(m) * x) + .3 * Math.sin(2 * Math.PI * hz(m) * 2 * x)) * Math.exp(-x * 14), .06, Math.sin(i * .8) * .5);
}

/* ---------- SFX on picture events ---------- */
const click = (t, g = 1) => { add(t, .012, () => rnd() * .9, .35 * g); add(t, .05, x => Math.sin(2 * Math.PI * 2200 * x) * Math.exp(-x * 90), .25 * g); };
const pop = (t, f0 = 520, f1 = 980, g = 1, pan = 0) => add(t, .12, x => Math.sin(2 * Math.PI * (f0 + (f1 - f0) * Math.min(1, x / .05)) * x) * Math.exp(-x * 30), .32 * g, pan);
const tick = (t, g = 1) => add(t, .05, x => Math.sin(2 * Math.PI * 3200 * x) * Math.exp(-x * 80), .18 * g);
function whoosh(t, len, g = 1, rev = false, pan = 0) {
  let lp = 0;
  add(t, len, x => {
    const u = x / len, shape = rev ? Math.pow(u, 2.2) : Math.sin(Math.PI * Math.min(1, u * 1.25)) * (1 - u * .3);
    const c = .02 + .25 * (rev ? u : Math.sin(Math.PI * u)); lp += c * (rnd() - lp);
    return lp * shape * 2.2;
  }, .45 * g, pan);
}
const boom = (t, g = 1) => { add(t, 1.2, x => Math.sin(2 * Math.PI * (38 + 30 * Math.exp(-x * 9)) * x) * Math.exp(-x * 3.2), .7 * g); whoosh(t - .02, .35, .7 * g); };
function sparkle(t, len, n, g = 1) { for (let i = 0; i < n; i++) { const tt = t + (i / n) * len + rnd() * .03, f = 2400 + 2600 * Math.abs(rnd()); add(tt, .18, x => Math.sin(2 * Math.PI * f * x) * Math.exp(-x * 26), .05 * g, rnd() * .8); } }
const thud = (t, g = 1) => add(t, .2, x => Math.sin(2 * Math.PI * (90 + 60 * Math.exp(-x * 40)) * x) * Math.exp(-x * 18), .4 * g);

// opening: cursor press + toggle
click(.97); pop(1.02, 700, 1100, .7);
// letters bend away (soft ticks, one per letter, stereo-spread)
for (let i = 0; i < 9; i++) tick(1.08 + i * .035 + .2, .5);
// kept letters spring into place
pop(1.32, 300, 420, .5); pop(1.37, 330, 460, .5); pop(1.42, 360, 500, .5); pop(1.47, 400, 560, .5);
// toggle collapses into the dot, dot flies to the full stop and lands
whoosh(1.95, .5, .5, false, .3); pop(2.45, 680, 1320, 1);
// jump to the graph, letters drop
whoosh(3.0, .5, .6, false, -.3); thud(3.5, .8);
// spring trace: rising tone that follows the same spring
{ const z = .32, w = 7.5, wd = w * Math.sqrt(1 - z * z);
  add(3.5, 1.5, x => { const s = 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x)); const f = 300 + 500 * s; return Math.sin(2 * Math.PI * f * x) * Math.exp(-x * 1.6); }, .07); }
tick(3.94, 1.3);                        // graph peak
pop(4.5, 500, 760, .9);                 // 300명 callout
// shoots to centre, grows to fill (silence before), square, pill, contract
whoosh(5.0, .38, .8); boom(5.95, 1);
pop(6.0, 220, 300, .8); whoosh(6.05, .45, .35, false, .4);
pop(6.5, 260, 420, .8); for (let i = 0; i < 9; i++) tick(7.0 + i * .02, .35);
whoosh(7.45, .55, .7, true); pop(8.0, 900, 1500, .8);
// orbit -> letters scatter into dots -> halftone
sparkle(10.0, .7, 26, 1); whoosh(10.1, .9, .4);
// halftone swells, silence, flip
whoosh(11.2, .8, .5, true); boom(12.0, .9);
// end card lines
pop(12.02, 420, 640, .7); pop(12.14, 520, 760, .5); pop(12.26, 600, 900, .6); pop(12.4, 680, 1320, .9);
// return: rewind through halftone, graph, toggle
whoosh(13.6, .45, .5, true, -.3); sparkle(13.65, .3, 10, .6); tick(14.12, 1); thud(14.42, .6);
click(14.62, .8); pop(14.66, 1100, 700, .5);

/* ---------- master: soft clip, normalise to -1 dBFS, 5 ms edge ramps so the loop seam does not click ---------- */
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.2); R[i] = Math.tanh(R[i] * 1.2); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = Math.pow(10, -1 / 20) / peak, ramp = SR * .005;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const e = Math.min(1, i / ramp, (N - 1 - i) / ramp);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g * e)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g * e)) * 32767), 46 + i * 4);
}
fs.writeFileSync(process.argv[2] || 'mix.wav', buf);
console.log('wrote', process.argv[2] || 'mix.wav');
