# 김희정 강사 홍보 · 이유 4가지 (promo)

15 s, 1080×1920, 30 fps, 6 scenes. Numbered "reasons" format, after the look of the cover of a reference reel (only its cover could be seen, not its motion).
Own HyperFrames root; run commands from this folder (pinned CLI 0.8.196 resolves from `../node_modules`).

- Colours: ground #0A0A0F, ink #FFFFFF, accent #FF7A1A. Font: Pretendard, titles 900.
- Copy and numbers come only from the poster and https://kim-heejung-ai-site.vercel.app/ (500명 이상, 168건). Photos: the site's hero and class photo (students' faces already masked there).
- Motions: only the default list in ../CLAUDE.md (mask reveal, stagger, kinetic type, match cut, push in, hold).

| Time | Scene | Copy | Move |
|---|---|---|---|
| 0–1.967 | hook | AI 강사 김희정이 / 다른 이유 / 4가지 | mask rise (hard cut out) |
| 1.967–4.433 | why1 | 26년 / 해운·물류 현장 실무 | mask rise, orange panel wipes over |
| 4.433–6.9 | why2 | 초보자 눈높이로 / 단계별 설명 | stairs build; last stair opens into the next panel (match cut) |
| 6.9–9.333 | why3 | 실습 중심, 결과물을 만드는 교육 | class photo + kinetic letters, panel closes up |
| 9.333–11.8 | why4 | 검증된 현장 / 500명 이상 / 168건 | cards mask-reveal, push in |
| 11.8–15 | end | 김희정 / 전문 강사 / 문의는 DM 주세요 | photo mask + push in, name letter by letter |

`rail.html` runs over the four reasons: rolling number and four-part progress bar.

Check: 0 errors, 1 warning. The warning (contrast at 7.5 s on digit "4") is a false reading: that digit is below the mask and not on screen.

## Sound
`node ../sound/mix.mjs ../sound-effects-cache/promo-silent.mp4 ../renders/kimheejung-promo.mp4 ../sound/promo-cues.json` — 15 effects, every file different. Credits: `../sound/promo-CREDITS.txt`.
- Music: "Tech House vibes", Mixkit #130, from 12.35 s (not committed; re-download into `../sound-effects-cache/music-130.mp3`).
- Licences checked 8 Nov 2026: Mixkit Stock Music Free License unchanged, social media video posts allowed; all effects CC0 on their source pages. Use case: Instagram Reels.
- Cuts vs beats: −4, +5, +16, −8, +3 ms.
- Exported MP4: −16.2 LUFS, true peak −4.6 dBFS (stereo and mono). Measured, not heard. Most hits reach the −5 dBFS limiter, so hit-vs-music balance needs ears.
- Proof: `../sound/checks/promo-waveform.png`, `../sound/checks/promo-frames.png`.
