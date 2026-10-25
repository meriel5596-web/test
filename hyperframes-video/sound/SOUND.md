# Sound pass — 김희정 강사 홍보 릴스

Made with the `sound-effects` skill (approach credit: Vox's sound-pass prompt, @Voxyz_ai).
Python is not installed on this PC, so the skill's `sound_pass.py` (librosa) was not run; the same steps were done with
FFmpeg and Node (`sound/mix.mjs`, cue list `sound/cues.json`). Every number below was measured, not heard.

- **Video**: `renders/kimheejung-reel-sound.mp4` (1080×1920, 30 fps, 15.0 s, AAC 48 kHz stereo). Silent version: `renders/kimheejung-reel.mp4`.
- **Use case**: Instagram Reels.

## Licence check (25 Oct 2026)
- Mixkit Stock Music Free License (https://mixkit.co/license/#musicFree): unchanged, "Social Media video posts" allowed.
- All 8 effects: each sound's own page checked today, all say Creative Commons 0 (Freesound ×7, Kenney ×1).
- The music file is downloaded at runtime into `sound-effects-cache/` and is **not committed** (Mixkit forbids redistributing the file on its own).

## Music
"It's Love" by Michael Ramir C., Mixkit #834, https://assets.mixkit.co/music/834/834.mp3 — Mixkit Stock Music Free License.
Starts 35.65 s into the track, so the first kick of its loud section (39.30 s) lands on the 26년 reveal at 3.65 s.
Fade in 0.25 s, fade out over the last 1.4 s. Bed at -13 dB before the master gain.

## Beat grid
Kicks found from a <120 Hz low-pass of the track: 39.30, 39.84, 40.38, 40.94, 41.48, 42.02 s → one every 0.544 s (~110 BPM).
Grid in the video: 3.65 + n × 0.544 s. librosa was not available, so the grid comes from these measured kick onsets.

| Cut / reveal | Time | Nearest beat | Error |
|---|---|---|---|
| 26년 reveal (hook → career) | 3.650 | 3.650 | 0 ms |
| career → shift cut | 7.467 | 7.458 | +9 ms |
| letters start popping | 8.557 | 8.546 | +11 ms |
| bar → CTA button (match cut) | 11.267 | 11.266 | +1 ms |

Scene starts were moved by ~0.13 s (career 3.6–7.467, shift 7.467–11.267, cta 11.267–15) to land on these beats.

## Cues (one file each, no sound used twice)
| # | Start | Picture | Sound | Gain | Over the bed |
|---|---|---|---|---|---|
| 1 | 0.280 | '어렵게' pops in | kit/pop.ogg | -6 dB | (music fading in) |
| 2 | 1.700 | build to the reveal | kit/riser.ogg (peaks 3.65) | -9 dB | — |
| 3 | 3.400 | hook blurs out | kit/whoosh.ogg | -4 dB | +7.8 dB |
| 4 | 3.625 | 26년 rises (reveal) | kit/impact.ogg | +2 dB | +9.8 dB (loudest) |
| 5 | 7.240 | push in clears scene 2 | transition/fs-786514-swoosh-v2.ogg | -11 dB | +8.6 dB |
| 6 | 8.530 | 내 일에 바로 쓰는 AI로! pops in | pop/fs-824189-pop-in-sfx.ogg | -4 dB | +5.3 dB |
| 7 | 11.297 | bar opens into the button | kit/click.ogg | -4 dB | +3.8 dB |
| 8 | 12.197 | name complete, '문의는 DM 주세요' lands | ding/kenney-interface-confirmation-001.ogg | -13 dB | +6.8 dB |

Each sound is placed so its peak lands one frame after its picture. "Over the bed" = 33 ms RMS at the hit vs. 0.3–0.6 s before it.

## Loudness (measured on the exported MP4)
| | Integrated | True peak |
|---|---|---|
| Stereo | -16.1 LUFS | -4.8 dBFS |
| Mono | -16.1 LUFS | -4.8 dBFS |
Target: about -16 LUFS, true peak below -4 dBFS. Master: one fixed gain, then a 4×-oversampled limiter at -5 dBFS.

## Check with headphones (riskiest 5)
1. **1.7–3.7 s** — the riser under the hook into the impact on the music's drop: does the build feel natural, not too early?
2. **3.6 s** — whoosh + impact + the first loud bar together: too crowded?
3. **7.2–7.5 s** — swoosh on the push in and the cut: does it match the move?
4. **11.27 s** — the click on the button: quietest hit (+3.8 dB), is it audible on a phone?
5. **13.6–15 s** — music fade-out under the end card: does it end cleanly, not cut off?

Proof images: `sound/checks/waveform.png` (red = cue starts, yellow = beats on cuts), `sound/checks/cue-frames.png` (frames just before/after cues).

## Rebuild
1. Download the music: `curl -L -o sound-effects-cache/music-834.mp3 https://assets.mixkit.co/music/834/834.mp3`
2. Render silent: `npx hyperframes render -o sound-effects-cache/silent.mp4` (Edge, PowerShell — see CLAUDE.md)
3. Mix: `node sound/mix.mjs sound-effects-cache/silent.mp4 renders/kimheejung-reel-sound.mp4`
