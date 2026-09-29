# Putra – Den v Putře

Website for Putra, a small bakery and café at Táborská 3238/102, Brno-Židenice (@putrabrno).
One page: a day in the bakery from 06:50 to 16:30. Each hour is a full-screen photo scene, some with a sideways gallery. A glass time panel with a rolling digital clock sits on the right, and the page ends with order and contact info.

> Menu, prices, cukroví dates and the order form are placeholders. Verify them with Petra before going live.
> Some photos come from other Instagram accounts (reposts or collaborations), so confirm the rights before publishing.

## Structure
- `index.html` – the built page (static, no runtime dependencies)
- `src/index.html` – page source with build macros
- `assets/img/` – responsive AVIF/WebP/JPEG set + `manifest.json`, generated
- `assets/ig-full/`, `assets/gmaps-original/` – source photos (Instagram full-res, Google Maps originals)
- `assets/video/pavlova-reel.mp4`, `assets/fonts/` (self-hosted Bricolage Grotesque, Czech subset), `assets/logo/` (owner's logo SVGs)
- `tools/` – build scripts

## Build
Since the macOS 27 update, the x64 `/usr/local/bin/node` no longer runs. Use the bundled arm64 Node (not in git; any Node ≥ 20 works):

```bash
cd tools && npm install          # sharp
node tools/build-images.js       # photos -> assets/img (skips files already built)
node tools/build.js              # src/index.html -> index.html
/usr/bin/python3 tools/serve.py 4410
```

Macros in `src/index.html`: `{{head:title|desc}}`, `{{pic:slug|sizes|class|eager}}`, `{{src:slug:width}}`, `{{preload:slug|sizes}}`, `{{logo}}` (wordmark), `{{markw[:classes]}}` (white logo mark), `{{status}}` (live open/closed), `{{fonts:google-url}}` (downloads + self-hosts).
To add a photo, put the file in `assets/ig-full` or `assets/gmaps-original`, add a slug to `PHOTOS` in `tools/build-images.js`, and use `{{pic:slug|…}}`.

## Behaviour notes
- Up/down scrolling is snapped: it always rests on a whole hour. Sideways, galleries move freely, then glide (160 ms after scrolling stops) to the nearest "screen", meaning a position that starts and ends on photo edges.
- The direction sign at the bottom centre fades in after 6 s without input (3 s on the first screen). It shows only the directions that screen allows.
- The logo curl draws itself: a conic-gradient mask swept via `@property --sw`. It's skipped with reduced motion or when `@property` isn't supported.

## History
The full design lab (versions v01–v10, the v07a–g variations, the research hub and screenshots) is preserved at git tag `lab-archive-2026-09-29`:

```bash
git checkout lab-archive-2026-09-29
```
