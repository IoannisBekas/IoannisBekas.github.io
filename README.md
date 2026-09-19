# Ioannis Bekas — portfolio

A static site: a felt-puppet version of me plays a short clip for each section, crossfading as you scroll.
No build step. Open `index.html` through any static server, e.g. `python -m http.server 5173`.

## What to deploy

Only these go online (≈4.5 MB):

```
index.html  404.html  styles.css  main.js  media/
```

`assets/` holds the Higgsfield source material (≈217 MB of masters, keyframes, raw clips). Keep it, but don't upload it.
GitHub Pages, Netlify and Vercel all serve `404.html` automatically.

## How the scenes work

- `media/video/sceneN.mp4` (1920×1080) and `sceneN_m.mp4` (720px, left-cropped for phones) are played once when
  section N crosses the middle of the viewport, then hold on their last frame (`main.js`).
- Every clip's background was graded to exactly `#f5f5f5`, the page colour, so the puppet appears to stand on the page.
  If you change `--bg` in `styles.css`, the videos will show as a visible rectangle.
- `prefers-reduced-motion` users get the final frame of each scene as a still.

| Section | Scene |
|---|---|
| Hero | walks in, waves |
| Work | opens laptop, types |
| Journey | leans in, hand on chin |
| About | sips coffee, thumbs-up |
| Contact | sunglasses on, points at the contact details |

## Regenerating assets (Higgsfield CLI)

Everything was made with `higgsfield` (Nano Banana Pro for stills, Kling 3.0 Pro for video). Prompts are saved next to the outputs:

1. `assets/gen/character/MASTER.png` — the puppet, from `assets/source/headshot.jpg`. `SHEET.png` is the turnaround.
2. `assets/gen/keyframes/prompts/*.txt` — start (`SNa`) and end (`SNb`) frames, each an edit of the previous frame so the camera never moves.
   `assets/gen/align.py` snaps an end frame back onto its start frame if the model reframed it.
3. `assets/gen/flatten.py` — clamps the background to `#f5f5f5` (the same curve is applied to the videos with ffmpeg `lutrgb`).
4. `assets/gen/video/prompts/V*.txt` — `higgsfield generate create kling3_0 --start-image … --end-image … --mode pro --sound off`.
   Kling kept the locked-off framing; Seedance 2.5 reframed every shot, so its takes were discarded.

To add a scene: make a start/end keyframe pair on the same background, generate with Kling, run the ffmpeg command below,
add a `.scene-layer` in `index.html` and a matching `data-scene` on the section.

```bash
L="if(lt(val\,175)\,val\,if(lt(val\,226)\,175+(val-175)*70/51\,245))"
ffmpeg -i raw.mp4 -vf "format=rgb24,lutrgb=r='$L':g='$L':b='$L',scale=1920:1080,format=yuv420p" -c:v libx264 -crf 23 -movflags +faststart -an media/video/sceneN.mp4
```
