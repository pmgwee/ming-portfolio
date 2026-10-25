# Phone hero film: portrait v1

The 9:16 phone version of the studio-journey-v2 hero film. Phones (max-width 768px) get this film instead of the 16:9 `film-720.mp4`.

Source: hf_20261025_085603_be9768f9-167f-47b6-b1c3-5921dc8dd854.mp4, a 9:16 AI-generated remake of the v2 film (1080x1920, 30fps), selected by Ming on 2026-10-25. The character and setting are imagined, not documentary footage.

The generated film ran the room, TV and sky beats about 2.5s early, so it was retimed piecewise ("B Balanced") so each of the hero's four chapters lands on the same scene as on desktop. Speed changes per section (source → film time):

| Source | Film | Beat |
|---|---|---|
| 0–1.75s | 0–2.9s | bead curtain opens |
| 1.75–3.75s | 2.9–6.4s | room, push-in to the TV |
| 3.75–4.25s | 6.4–6.75s | through the screen |
| 4.25–7.75s | 6.75–9.6s | sky, distant saucer |
| 7.75–9.5s | 9.6–10.6s | saucer approaches |
| 9.5–11.75s | 10.6–12.3s | passenger, push-in to the portrait |
| 11.75–13.0s | 12.3–13.4s | portrait dissolves into "ming" |
| 13.0–15.0s | 13.4–15.0s | hold on "ming" |

Slowed sections use FFmpeg motion interpolation (minterpolate, mci); the rest drop or keep source frames. No crop, no visual edit.

`film-720x1280.mp4`: 450 frames, exactly 15.000s at 30fps, H.264 High, CRF24, keyframes every three frames, no B-frames, fast-start, no audio, so iPhone browsers (Safari, Chrome, the Instagram in-app browser) can seek it as you scroll. `opening.webp` is frame 0 (WebP quality 78), the poster before the film loads. `ending.webp` is frame 444 (14.8s, WebP quality 85).
