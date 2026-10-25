# HyperFrames Composition Project

This folder is a [HyperFrames](https://hyperframes.heygen.com) video: HTML, CSS and seekable
animations (GSAP by default) that the `hyperframes` CLI previews in the browser and renders to
MP4.

## Skills — read these first

**Invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that generic web docs don't cover, so compositions written without them break.

**Doing anything with HyperFrames?** Start at `/hyperframes`. Make any video by asking for it; the `/hyperframes` skill carries the contract and the references (each kind of film, story, motion, look, sound, review, captions, overlays). Read it first, especially when there's no project context to orient you.

- `/hyperframes` — read first for any request to make, edit, animate or render a video, motion graphic, captions or overlays. Holds the render contract and the work loop.
- `/hyperframes-cli` — the CLI by job: scaffold, check, look at frames, edit the timeline, preview, render, publish, project history.
- `/hyperframes-registry` — ready-made blocks and components installed as editable source. Search it before hand-building any named visual.
- `/media-use` — get or make any media (music, sound effects, images, voiceover, avatar and generated video, transcripts, cutouts, colour grades) and mix placed audio.
- `/figma` — bring a Figma design, frame, logo or brand into a video.
- `/slideshow` — a presentation or pitch deck. Output is a navigable deck, not a rendered MP4.
- `/remotion-to-hyperframes` — bring existing video code or footage into HyperFrames (Remotion first; also Motion Canvas, Lottie, Three.js, canvas, or renders from other tools) and verify it frame by frame against the original.

**Changing how real footage or images look or reveal?** Load `/media-use` and read its `references/media-treatments.md` before editing, even when the request only says dark, flat, boring, retro, private, or “make the reveal cooler.” It governs how footage is treated, never whether media may be used. Use canonical media treatments and seek-safe motion; do not improvise equivalent CSS/SVG filters or overlays.

> **Tailwind v4 projects** (`hyperframes init --tailwind`): see `hyperframes-cli/references/init-and-scaffold.md` (Tailwind).

> **Using a HyperFrames plugin?** Load skills from that installed bundle and follow
> its `hyperframes/references/plugin-installation.md` execution rules. Update via
> the plugin manager, not the standalone commands below.
>
> **Standalone skill missing or stale?** Run `npx hyperframes skills update <name>` to install/refresh
> the specific skill you need, or bare `npx hyperframes skills update` to refresh the core set plus
> everything already installed — neither pulls the full set. Restart the agent session so
> newly installed skills load.

## Commands

```bash
npm run dev          # human-operated foreground preview (blocks until stopped)
npx hyperframes preview --background  # agent-safe persistent Studio preview
npx hyperframes preview --status      # verify the persistent preview is listening
npx hyperframes preview --stop        # stop it when review is finished
npm run check        # lint + runtime + layout + motion + contrast (one command)
npx hyperframes snapshot --at 1,3,5  # PNG frames at those seconds, to look at before rendering
npm run render       # render to MP4
npm run publish      # publish and get a shareable link
npx hyperframes lint --verbose  # include info-level findings
npx hyperframes lint --json     # machine-readable output for CI
npx hyperframes docs <topic> # reference docs in terminal
```

> **Agents must use `npx hyperframes preview --background` for Studio handoff.** Do not rely
> on a shell/tool `run_in_background` wrapper around `npm run dev`: that foreground process
> remains owned by the invoking session and can disappear while the browser stays open,
> leaving refreshes at `ERR_CONNECTION_TIMED_OUT`. Verify with `preview --status`, keep it
> alive through review, and stop it explicitly with `preview --stop` afterward.

> **Back from the desktop app.** Once this project was opened in the HyperFrames desktop app, run `npx hyperframes catch-up` before your next change here: it lists what the person asked Framey in the app and which files changed since.

> **Pinned CLI version.** These scripts pin an exact `hyperframes@X.Y.Z` so this project re-renders identically over time. Weeks later that pin lags fixes shipped since. To move up: `npx hyperframes@latest upgrade --project . --check` (shows the delta), then `npx hyperframes@latest upgrade --project .` to rewrite the pins. Always unpinned — the pinned script re-runs the old version against itself.

## Documentation

**For quick reference**, use the local CLI docs command (no network required):

```bash
npx hyperframes docs <topic>
```

Topics: `data-attributes`, `gsap`, `compositions`, `rendering`, `examples`, `troubleshooting`

**For full documentation**, discover pages via the machine-readable index — do NOT guess URLs:

```
https://hyperframes.heygen.com/llms.txt
```

## Project Structure

- `index.html` — main composition (root timeline)
- `compositions/` — sub-compositions referenced via `data-composition-src`
- `meta.json` — project metadata (id, name)
- `transcript.json` — whisper word-level transcript (if generated)

## Linting — ALWAYS RUN AFTER CHANGES

After creating or editing any `.html` composition, **always** run the full check before considering the task complete:

```bash
npm run check
```

Fix all errors before presenting the result. Warnings should be reviewed before rendering.

Then look at what you changed: `npx hyperframes snapshot --at <seconds>` (or `--range START,END`, `--composition <id>`) at the moments you edited, and read the frames before you reply. A passing check does not show how it looks.

## Key Rules

1. Every timed element needs `data-start` and a duration. `data-start` is what marks it as timed; `data-track-index` is an optional Studio display lane the render never reads
2. Give timed visual elements `class="clip"`. The framework keys visibility off `data-start`, not the class, but the shared `.clip` CSS is what gives a scene its full-frame box, and `lint` warns without it
3. Register one paused root timeline per composition on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
   Scene timelines manually added to this root must not be paused. A paused
   child does not advance when the root is seeked. The runtime activates
   registered composition siblings, not arbitrary nested scene timelines.
4. A video with sound keeps it on the `<video>` (`data-has-audio="true"`, no `muted`). Use a separate `<audio>` for music, voiceover, replacement audio, J/L cuts, or audio detached in Studio. Silent footage and b-roll: `muted`.
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches

---

# 내 디자인 규칙

위 HyperFrames 규칙은 그대로 지키고, 이 폴더에서 만드는 **모든 영상**은 아래 규칙도 지킨다. 둘이 부딪히면 먼저 사용자에게 묻는다.

## 1. 기본 규격
- 해상도 **1080×1920** (세로 9:16), **30fps**
- 기본 길이 **15초**, 장면 **4개** (장면 하나에 약 3~4초). 사용자가 따로 말하면 그 값을 따른다.

## 2. 글꼴
- `assets/fonts/` 안에 있는 글꼴 파일만 쓴다. CDN·시스템 글꼴·다른 곳에서 가져온 글꼴은 쓰지 않는다.
- 제목은 그 글꼴의 **가장 굵은 굵기**로 쓴다.
- `assets/fonts/`가 없거나 비어 있으면 만들기 전에 사용자에게 글꼴 파일을 달라고 한다.

## 3. 색
- 배경·글자·강조 색은 **영상마다 만들기 전에 사용자에게 묻는다.** 정해 둔 기본 색은 없다.
- 한 영상에서 쓰는 색은 배경·글자·강조 세 가지가 기준이다.

## 4. 이징 (속도 변화)
- 들어올 때는 **감속**(ease-out), 나갈 때는 **가속**(ease-in).
- 처음부터 끝까지 같은 속도로 움직이는 것(linear)은 금지. 단, 끊김 없는 루프의 계속 도는 움직임은 예외로 사용자에게 먼저 묻는다.

## 5. 글자 보이는 시간
- 모든 글자는 완전히 나타난 뒤 **최소 1.5초** 화면에 머문다.

## 6. 안전 영역
- 화면 **위 15%**(0~288px)와 **아래 20%**(1536~1920px)에는 글자를 두지 않는다. 글자는 288~1536px 사이에만 둔다.
- 배경·도형·사진은 안전 영역에 들어가도 된다.

## 7. 쓸 움직임
기본으로 쓰는 움직임 (용어는 아래 21개 용어표 기준):
- **이징 (Easing)** — 모든 움직임에 적용 (4번 규칙)
- **예비동작 (Anticipation)** — 큰 등장·퇴장 앞에 살짝 반대로
- **스태거 (Stagger)** — 글자·요소를 순서대로 등장
- **키네틱 타이포 (Kinetic Typography)** — 글자 자체가 움직이는 장면
- **마스크 리빌 (Mask Reveal)** — 가려졌다 나타나는 등장
- **오버랩 (Overlapping Action)** / **팔로스루 (Follow Through)** — 한 덩어리가 동시에 멈추지 않게 시간차
- **홀드 (Hold)** — 읽을 시간을 주는 멈춤 (5번 규칙)
- **매치컷 (Match Cut)** / **푸시 인 (Push In)** — 장면 사이 연결

요청하면 쓰는 움직임: 스쿼시 앤 스트레치, 아크, 패럴랙스, 모션 블러, 세컨더리 액션, 줌 스루, 휩 팬, 아이리스, 비트 싱크, 루프.
- **카운트업 (Count Up)** 은 사용자가 준 숫자에만 쓴다 (8번 규칙).

<details><summary>21개 용어표</summary>

| # | 용어 | 뜻 | # | 용어 | 뜻 |
|---|---|---|---|---|---|
| 1 | 이징 (Easing) | 부드러운 가감속 | 12 | 홀드 (Hold) | 잠깐 멈춤 |
| 2 | 예비동작 (Anticipation) | 큰 동작 전 준비 | 13 | 세컨더리 액션 (Secondary Action) | 보조 움직임 |
| 3 | 스쿼시 앤 스트레치 (Squash and Stretch) | 눌리고 늘어나는 탄력 | 14 | 줌 스루 (Zoom Through) | 확대하며 장면 전환 |
| 4 | 아크 (Arc) | 포물선 이동 | 15 | 휩 팬 (Whip Pan) | 휙 넘기는 전환 |
| 5 | 팔로스루 (Follow Through) | 끝부분이 늦게 따라옴 | 16 | 아이리스 (Iris) | 원형 전환 |
| 6 | 오버랩 (Overlapping Action) | 부위별 시간차 | 17 | 키네틱 타이포 (Kinetic Typography) | 움직이는 글자 |
| 7 | 스태거 (Stagger) | 순차 등장 | 18 | 카운트업 (Count Up) | 숫자 증가 연출 |
| 8 | 매치컷 (Match Cut) | 형태 이어서 전환 | 19 | 푸시 인 (Push In) | 카메라가 천천히 접근 |
| 9 | 패럴랙스 (Parallax) | 거리별 속도차 | 20 | 비트 싱크 (Beat Sync) | 박자에 맞춰 움직임 |
| 10 | 마스크 리빌 (Mask Reveal) | 가려졌다 등장 | 21 | 루프 (Loop) | 끝과 처음 연결 |
| 11 | 모션 블러 (Motion Blur) | 빠른 움직임 잔상 | | | |

</details>

## 8. 금지
- 모든 장면을 같은 페이드로 넣고 빼기
- 의미 없는 모서리 라벨 (구석의 작은 장식 글자·번호·태그 등)
- 보라색 그라데이션
- 같은 효과음 반복
- 사용자가 주지 않은 숫자·통계·후기·인용문을 지어내기

## 9. 렌더
1. 렌더 전에 반드시 `npm run check`를 돌린다. 오류가 하나라도 있으면 렌더하지 않고 고친다. 경고는 읽고 사용자에게 알린다.
2. 문제가 없을 때만 렌더하고, 결과 mp4는 **`renders/` 폴더**에 저장한다. 예: `npx hyperframes render -o renders/이름.mp4`
3. HyperFrames는 `package.json`에 **고정된 버전(0.8.196)만** 쓴다. `@latest`나 다른 버전으로 실행하지 않고, 버전을 올리려면 먼저 사용자에게 묻는다.
4. 이 PC에는 Chrome이 없으므로 렌더할 때 `HYPERFRAMES_BROWSER_PATH`를 Edge(`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`)로 지정하고, Git Bash 대신 PowerShell에서 실행한다 (Git Bash에서는 브라우저가 멈춤).
