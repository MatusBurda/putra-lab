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
