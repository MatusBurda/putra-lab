# Putra Lab

> Since the macOS 27 update the x64 `/usr/local/bin/node` and `python3` no longer run. Use the bundled arm64 Node:
> `export PATH=$PWD/tools/.node/bin:$PATH` (checksum-verified nodejs.org v24.10.0), and `/usr/bin/python3` for the server/venv.

Design lab for Putra (bakery/café, Táborská 102, Brno-Židenice): research + 10 static site versions.

- `index.html` – lab hub (research, library directions, 10 versions with live Lighthouse scores, what is invented)
- `src/vNN-*.html` – page sources with macros → `node tools/build.js [vNN]` → `vNN-*/index.html`
- `tools/build-images.js` – source photos (`assets/gmaps`, `assets/ig`) → AVIF/WebP/JPEG in `assets/img`
- fonts: build downloads Google fonts into `assets/fonts`; then `tools/.venv/bin/python tools/subset-fonts.py` (Czech subset)
- `node tools/shoot.js [vNN]` – screenshots into `shots/` (needs server on :4410); `node tools/peek.js <slug> <selector|y> [out] [w] [h]` – single viewport after scrolling
- `v07f-den-v-putre-plus` (round 3): broader V07 – 54 photos from ~/Downloads/Putra (IG full-res copied to `assets/ig-full`, Maps from `assets/gmaps-original`, reel in `assets/video`), slugs `p-*` in build-images.js (re-runs skip already-built files); sticky rolling digital clock + horizontal scroll-snap strips
- V07 variations: `v07a-film`, `v07b-kontaktni-arch`, `v07c-horizontalni-den`, `v07d-okna`, `v07e-makro` (07A index thumbs are scene peeks, not the title card)
- Lighthouse: start native Chrome with `--remote-debugging-port=9555`, then `node tools/lh.mjs [vNN ...]` (merges into lh/scores.json)
- serve: `/usr/bin/python3 tools/serve.py 4410` (sends Cache-Control: no-store; the stdlib server lets browsers show a stale index.html)
- Google Maps originals (all 28 photos, fetched signed-in, full resolution via `=s0`): `assets/gmaps-original/` + `list.json` (owner flag), ZIPs `assets/putra-google-maps-fotky.zip` and `assets/putra-google-maps-od-majitelky.zip` (7 owner photos), previews `shots/gmaps/`, source URLs `assets/gmaps-all/list.tsv`; lab section `#fotky`
- `v07g-den-v-putre-sklo` (round 4): V07 art direction (every hour = one full-bleed screen, no gaps) + 07F content; liquid-glass right rail with rolling digital clock appears after the hero (mobile: glass navbar); full-bleed horizontal galleries: free sideways scroll that glides (160 ms after the last scroll event) to the nearest "screen" = position where the view starts and ends on photo edges; direction sign fades in only after 10 s idle, arms have chevron tips and y snap mandatory; photo picks/order chosen by the user (48 photos), no arrows: fixed bottom-centre direction glyph (↓ ⊢ ✚ ⊣, clickable) + "Více informací" in the rail (mobile: bottom-right); no photo caption tags; pills are hairline outlines (.ln), glass only on rail/navbar/cards; screens that fit (cukroví trio) don't scroll. Strip image widths (C/L presets) raised to 1600/2400 for this.
- Brand files: `assets/logo/` (white + contrast-black mark and wordmark SVGs from the owner). `{{markw[:classes]}}` inlines the light-on-dark mark (tools/logo-mark-white.txt). 07G: mark+wordmark lockup top-left/navbar; `.draw` = conic-gradient mask swept via @property --sw (left tails → bottom → right → top), hero on load, closing screen on view; skipped with reduced motion or no @property.
