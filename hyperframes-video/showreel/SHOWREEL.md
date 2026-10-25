# 김희정 쇼릴 (showreel)

A 15 s, 1080×1920, 30 fps "showreel" version of the instructor reel: same copy, more motion.
Lives in its own HyperFrames root so the reel in `../index.html` stays as it is. Run every command from this folder
(`npx hyperframes check`, `snapshot`, `render`); the pinned CLI (0.8.196) resolves from `../node_modules`.

- Colours: ground #0A0A0F, ink #FFFFFF, accent #2F6BFF. Font: Pretendard (assets/fonts), titles at 900.
- Motion blur on (`data-motion-blur="on"` on the root) for the whips and the zoom.
- Copy: the reel's three lines + 'DM 주세요', plus from the poster: 26년, the four course areas, '생성형 AI 실무 활용 전문 강사'.

## Scenes (each change on a bar line of the music, 122 BPM)
| Time | Scene | Moves |
|---|---|---|
| 0–3.933 | slam | 'AI,' on frame 0 · '어렵게' slams in with a squash · '배우지'/'마세요!' whip in from opposite sides · strike through '어렵게' · blue floods out of the '!' |
| 3.933–7.867 | count | slot-machine count-up 0 → 26 · '년' pops · words rise · black pill wipes open on '진짜 AI 교육' · whip pan up |
| 7.867–11.8 | punch | setup line lands from the whip · '내 일에 바로 쓰는 AI로!' slams in letter by letter · four course chips snap in (in the music's stop) · zoom through |
| 11.8–15 | card | iris opens on the photo + push in · accent ring springs out · name letter by letter · role · 'DM 주세요' button pops, holds 2.3 s |

Check: 0 errors. 8 warnings remain on purpose: the count-up's passing digits (0, 1, 7, 8 …) are on screen < 0.4 s each — they are the spin, not lines to read.

## Sound
Mix script `../sound/mix.mjs` with `../sound/showreel-cues.json` (14 effects, every file different). Credits: `../sound/showreel-CREDITS.txt`.
- Music: "Tech House vibes" by Alejandro Magaña (A. M.), Mixkit #130, from 12.35 s; Mixkit Stock Music Free License
  (checked 25 Oct 2026: social media video posts allowed). Not committed — download it again to rebuild.
- Beat grid from measured kicks: 2.52 + n × 0.4913 s in the track. Bar lines in the video 0.006, 3.936, 7.866, 11.796 →
  cut errors −3 ms, +1 ms, +4 ms.
- All 14 effects: each source page checked 25 Oct 2026, all CC0 (Freesound ×9, Kenney ×5).
- Loudness on the exported MP4: −16.1 LUFS integrated, true peak −4.7 dBFS (stereo and mono the same).
- Proof: `../sound/checks/showreel-waveform.png` (red = cue starts, yellow = bar lines), `../sound/checks/showreel-frames.png`.

Headphone checks (measured, not heard): 0.5 s slam over the music's first beat · 2.0–3.9 s riser into the blue-flood impact ·
7.7 s whip-pan swoosh · 9.1 s chip click in the music's stop · 11.65–11.85 s zoom chop + iris impact back to back.

## Rebuild
1. `curl -L -o ../sound-effects-cache/music-130.mp3 https://assets.mixkit.co/music/130/130.mp3`
2. PowerShell, Edge as the browser (see ../CLAUDE.md): `npx hyperframes render -o ../sound-effects-cache/showreel-silent.mp4`
3. `node ../sound/mix.mjs ../sound-effects-cache/showreel-silent.mp4 ../renders/kimheejung-showreel.mp4 ../sound/showreel-cues.json`
