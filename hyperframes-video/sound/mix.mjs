// mix.mjs - put the music and the cue list's sound effects under a silent render, then normalise.
// Usage: node sound/mix.mjs <silent.mp4> <out.mp4>
// Every sound is a real recorded file (no synthesis). Music is Mixkit (downloaded at runtime into
// sound-effects-cache/, never committed); effects are the sound-effects skill's bundled CC0 files.
// Loudness: measured, one fixed gain to -16 LUFS, then a peak limiter at -5 dBFS, measured again on the MP4 by the caller.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [silent, out] = process.argv.slice(2);
if (!silent || !out) { console.error('usage: node sound/mix.mjs <silent.mp4> <out.mp4>'); process.exit(1); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SFX = path.resolve(ROOT, '../.agents/skills/sound-effects/sfx');
const cues = JSON.parse(fs.readFileSync(path.join(ROOT, 'sound/cues.json'), 'utf8'));
const DUR = 15, MUSIC_DB = -13, FADE_OUT = 1.4;

const inputs = ['-i', silent, '-ss', String(cues.music.offset), '-t', String(DUR), '-i', path.join(ROOT, cues.music.file)];
const chains = [`[1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${MUSIC_DB}dB,` +
  `afade=t=in:d=0.25,afade=t=out:st=${DUR - FADE_OUT}:d=${FADE_OUT}[m]`];
const labels = ['[m]'];
cues.cues.forEach((c, i) => {
  inputs.push('-i', path.join(SFX, c.file));
  const ms = Math.round(c.start * 1000);
  chains.push(`[${i + 2}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${c.gain_db}dB,adelay=${ms}|${ms}[s${i}]`);
  labels.push(`[s${i}]`);
});
const mix = `${chains.join(';')};${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=first,apad,atrim=0:${DUR}`;

function ff(args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stderr.slice(-2000)); process.exit(1); }
  return r.stderr;
}
// pass 1: measure the raw mix
const p1 = ff([...inputs, '-filter_complex', `${mix},loudnorm=I=-16:TP=-4.5:LRA=11:print_format=json[a]`, '-map', '[a]', '-f', 'null', '-']);
const m = JSON.parse(p1.slice(p1.lastIndexOf('{'), p1.lastIndexOf('}') + 1));
console.log(`raw mix: ${m.input_i} LUFS, true peak ${m.input_tp} dBTP`);
// pass 2: one fixed gain to -16 LUFS (keeps the cue-vs-bed balance exactly as set), then a 4x-oversampled
// peak limiter at -5 dBFS so the true peak stays under -4 dBTP; keep the picture untouched
const gain = (-16 + 0.9 - Number(m.input_i)).toFixed(2);   // +0.9: what the limiter takes back on this mix (measured)
const lim = `aresample=192000,alimiter=limit=${Math.pow(10, -5 / 20).toFixed(4)}:attack=1:release=60:level=disabled,aresample=48000`;
ff(['-y', ...inputs, '-filter_complex', `${mix},volume=${gain}dB,${lim}[a]`, '-map', '0:v', '-map', '[a]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out]);
console.log('wrote', out);
