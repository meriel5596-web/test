# 촬영 없이 만든 영상 (howto)

30 s, 1080×1920, 30 fps, 7 scenes. Teaser of the workflow ChatGPT project → Google Flow → Vstory, made to raise questions: the finished 3D video comes first with '이 3D 영상, 얼마 들었을까요?' → '무료 기능으로 만들었어요', the instructions and prompts stay hidden as grey bars, and it ends on '궁금하세요?'.
Own HyperFrames root; run commands from this folder (pinned CLI 0.8.196 resolves from `../node_modules`).

- Colours: ground #0D100B, ink #FFFFFF, accent #FFC83D (picked from the images' gloves; not asked in advance). Font: Pretendard, titles 900.
- Pictures: the user's five Flow images and clips from the user's finished Vstory video (43 s, HEVC, re-encoded to H.264 in assets/video). Order follows that video.
- '무료' comes from the user (the video was made with free features).

Scenes (beats of 0.4913 s): hook 0–3.933 · brief 3.933–7.867 · three 7.867–11.8 · flow 11.8–16.7 · vstory 16.7–21.633 · result 21.633–25.567 · ask 25.567–30. `rail.html` shows the current tool from 3.933 to 21.633.
Match cuts: input box brief → three; the fan of images flow → vstory (same positions).

Check: 0 errors. One warning (`film_silent`) is expected: the composition is silent and sound is mixed afterwards.

## Sound
`node ../sound/mix.mjs ../sound-effects-cache/howto-silent.mp4 ../renders/kimheejung-howto.mp4 ../sound/howto-cues.json` — 17 effects, every file different, plus the finished video's own sound under 'result' with the music ducked 14 dB. Credits: `../sound/howto-CREDITS.txt`.
Needs `../sound-effects-cache/music-130.mp3` and `howto-result.wav` (not committed; the wav is seconds 25–28.93 of the user's video).
Licences checked 8 Nov 2026. Loudness measured on the MP4; not heard. Proof: `../sound/checks/howto-waveform.png`, `howto-frames.png`.
