// Compiles src/index.html into /index.html with shared SEO head, JSON-LD and
// responsive <picture> markup. Keeps the shipped pages 100% static.
//
// Macros available in src pages:
//   {{head}}                              shared <meta>/OG/canonical/JSON-LD block
//   {{pic:slug|sizes|class|eager}}        <picture> with AVIF/WebP/JPEG srcsets
//   {{bg:slug:width}}                     CSS image-set() for backgrounds
//   {{src:slug:width}}                    plain JPEG url
//   {{preload:slug|sizes}}                <link rel=preload> for the LCP image
//   {{logo}} / {{mark}}                   inline SVG wordmark / butter-curl mark
//   {{status}}                            inline script: live open/closed status
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMG = 'assets/img/';
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/manifest.json'), 'utf8'));
const WORD = fs.readFileSync(path.join(__dirname, 'logo-word.txt'), 'utf8').trim();
// butter-curl mark, light-on-dark cut (thinner stripes) from the brand files: assets/logo/logo_l_white.svg
const MARKW = fs.readFileSync(path.join(__dirname, 'logo-mark-white.txt'), 'utf8').trim();
const MARK = fs.readFileSync(path.join(__dirname, 'logo-mark.txt'), 'utf8').trim().split('\n');

const SITE = 'https://www.putra.cz/';
const TITLE = 'Putra – cukrárna a dorty na objednávku | Brno-Židenice';
const DESC = 'Malá cukrárna a kavárna na Táborské v Brně. Poctivé zákusky z pravého másla, dorty na objednávku, vánoční cukroví a výborná káva. Út–Pá od 10:00.';

const schema = {
  '@context': 'https://schema.org',
  '@type': ['Bakery', 'CafeOrCoffeeShop'],
  '@id': SITE + '#putra',
  name: 'Putra',
  alternateName: 'Putra – výrobna a sladké pečení',
  description: DESC,
  url: SITE,
  telephone: '+420773558819',
  image: [SITE + 'img/og-putra.jpg'],
  logo: SITE + 'img/putra-logo.svg',
  priceRange: '45–1 550 Kč',
  currenciesAccepted: 'CZK',
  paymentAccepted: 'Hotovost, platební karta',
  servesCuisine: ['Cukrářské výrobky', 'Káva', 'Dorty'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Táborská 3238/102',
    addressLocality: 'Brno-Židenice',
    postalCode: '615 00',
    addressRegion: 'Jihomoravský kraj',
    addressCountry: 'CZ',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 49.1949326, longitude: 16.6433761 },
  hasMap: 'https://maps.google.com/?cid=6744509639000696065',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Friday'], opens: '10:00', closes: '16:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday'], opens: '10:00', closes: '18:00' },
  ],
  founder: { '@type': 'Person', name: 'Petra Kopalová' },
  sameAs: ['https://www.instagram.com/putrabrno/'],
  hasMenu: SITE + '#nabidka',
  acceptsReservations: false,
  areaServed: { '@type': 'City', name: 'Brno' },
  identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: '21717435' },
};

const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    ['Jak dlouho dopředu si mám objednat dort?', 'Dort na objednávku potřebujeme znát alespoň 3 dny předem. Na svatby a velké oslavy ideálně 2–3 týdny.'],
    ['Do kdy lze objednat vánoční cukroví?', 'Vánoční cukroví přijímáme do 10. prosince 2026 nebo do vyprodání kapacity. Výdej probíhá 18.–22. prosince na Táborské.'],
    ['Máte i posezení s kávou?', 'Ano. Putra je malá kavárna s několika místy u okna a lavičkou před provozovnou. Voda z kohoutku je zdarma.'],
    ['Kde Putru najdu?', 'Na Táborské 3238/102 v Brně-Židenicích, kousek od tramvajové zastávky Táborská.'],
  ].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

function head(extra = {}) {
  const t = extra.title || TITLE;
  const d = extra.desc || DESC;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${SITE}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:locale" content="cs_CZ">
<meta property="og:site_name" content="Putra">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${SITE}">
<meta property="og:image" content="${IMG}og-putra.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="CZ-64">
<meta name="geo.placename" content="Brno-Židenice">
<meta name="geo.position" content="49.1949326;16.6433761">
<meta name="ICBM" content="49.1949326, 16.6433761">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(markSvg('#8a5a2b'))}">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<script type="application/ld+json">${JSON.stringify(faq)}</script>`;
}

function markSvg(fill = 'currentColor') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.599 37.397"><g fill="${fill}" transform="translate(-129.614 -294.667) scale(.5401)">${MARK.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`;
}

function srcset(slug, fmt) {
  return manifest[slug].widths.map((w) => `${IMG}${slug}-${w}.${fmt} ${w}w`).join(', ');
}

function pic(slug, sizes = '100vw', cls = '', eager = '') {
  const m = manifest[slug];
  if (!m) throw new Error('unknown image ' + slug);
  const maxW = m.widths[m.widths.length - 1];
  const w = maxW, h = Math.round(maxW / m.ratio);
  const load = eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  return `<picture${cls ? ` class="${cls}"` : ''}><source type="image/avif" srcset="${srcset(slug, 'avif')}" sizes="${sizes}"><source type="image/webp" srcset="${srcset(slug, 'webp')}" sizes="${sizes}"><img src="${IMG}${slug}-${m.widths[Math.min(1, m.widths.length - 1)]}.jpg" srcset="${srcset(slug, 'jpg')}" sizes="${sizes}" width="${w}" height="${h}" alt="${m.alt}" ${load} decoding="async" style="background:${m.color}"></picture>`;
}

function pick(slug, width) {
  const ws = manifest[slug].widths;
  return ws.reduce((a, b) => (Math.abs(b - width) < Math.abs(a - width) ? b : a));
}

const STATUS = `<script>
(function(){var el=document.querySelectorAll('[data-status]');if(!el.length)return;
var H={2:[10,16],3:[10,18],4:[10,18],5:[10,16]};
var n=new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Prague'}));
var d=n.getDay(),m=n.getHours()*60+n.getMinutes(),h=H[d],t,open=false;
function nx(){for(var i=1;i<8;i++){var k=(d+i)%7;if(H[k])return ['neděli','pondělí','úterý','středu','čtvrtek','pátek','sobotu'][k];}}
if(h&&m>=h[0]*60&&m<h[1]*60){open=true;var l=h[1]*60-m;t='Otevřeno · zavíráme v '+h[1]+':00'+(l<=60?' (za '+l+' min)':'');}
else if(h&&m<h[0]*60){t='Dnes otevíráme v 10:00';}
else{t='Zavřeno · otevíráme v '+nx()+' v 10:00';}
el.forEach(function(e){e.textContent=t;e.setAttribute('data-open',open)});})();
</script>`;


// Self-hosts Google Fonts: keeps only latin + latin-ext faces (Czech needs both),
// downloads the woff2 files into assets/fonts and inlines the @font-face rules.
const crypto = require('crypto');
async function fonts(url) {
  const cacheDir = path.join(__dirname, 'fontcache');
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'assets/fonts'), { recursive: true });
  const key = path.join(cacheDir, crypto.createHash('md5').update(url).digest('hex') + '.css');
  let css;
  if (fs.existsSync(key)) css = fs.readFileSync(key, 'utf8');
  else {
    css = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' } })).text();
    fs.writeFileSync(key, css);
  }
  const blocks = [...css.matchAll(/\/\* ([\w-]+) \*\/\s*(@font-face\s*\{[^}]+\})/g)].filter((m) => m[1] === 'latin' || m[1] === 'latin-ext');
  const faces = [], preloads = [];
  for (const [, subset, face] of blocks) {
    const fam = face.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, '');
    const wt = face.match(/font-weight: ([\d ]+);/)[1].replace(/\s+/g, '_');
    const st = face.match(/font-style: (\w+)/)[1];
    const src = face.match(/url\((https:[^)]+\.woff2)\)/)[1];
    // variable fonts reuse one file for several weights: name by source so it downloads once
    const name = `${fam}-${st}-${subset}-${crypto.createHash('md5').update(src).digest('hex').slice(0, 6)}.woff2`;
    const out = path.join(ROOT, 'assets/fonts', name);
    if (!fs.existsSync(out)) fs.writeFileSync(out, Buffer.from(await (await fetch(src)).arrayBuffer()));
    faces.push(face.replace(src, `assets/fonts/${name}`).replace(/\s+/g, ' '));
  }
  return `${preloads.join('')}<style>${faces.join('')}</style>`;
}

async function build(file) {
  let html = fs.readFileSync(path.join(ROOT, 'src', file), 'utf8');
  const fm = html.match(/\{\{fonts:([^}]+)\}\}/);
  if (fm) html = html.replace(fm[0], await fonts(fm[1].replace(/&amp;/g, '&')));
  html = html
    .replace(/\{\{head(?::([^|}]*)\|([^}]*))?\}\}/g, (_, t, d) => head({ title: t, desc: d }))
    .replace(/\{\{pic:([^}]+)\}\}/g, (_, a) => pic(...a.split('|')))
    .replace(/\{\{bg:([\w-]+):(\d+)\}\}/g, (_, s, w) => {
      const x = pick(s, +w);
      return `image-set(url(${IMG}${s}-${x}.avif) type("image/avif"), url(${IMG}${s}-${x}.webp) type("image/webp"), url(${IMG}${s}-${x}.jpg) type("image/jpeg"))`;
    })
    .replace(/\{\{src:([\w-]+):(\d+)\}\}/g, (_, s, w) => `${IMG}${s}-${pick(s, +w)}.jpg`)
    .replace(/\{\{preload:([\w-]+)\|([^}]+)\}\}/g, (_, s, sizes) =>
      `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset(s, 'avif')}" imagesizes="${sizes}" fetchpriority="high">`)
    .replace(/\{\{logo\}\}/g, `<svg class="logo" viewBox="0 0 46.599 16.528" role="img" aria-label="Putra"><path fill="currentColor" transform="translate(-89.918 -154.96) scale(.98221)" d="${WORD}"/></svg>`)
    .replace(/\{\{logo-outline\}\}/g, `<svg class="logo" viewBox="0 0 46.599 16.528" role="img" aria-label="Putra"><path fill="none" stroke="currentColor" stroke-width=".09" vector-effect="non-scaling-stroke" transform="translate(-89.918 -154.96) scale(.98221)" d="${WORD}"/></svg>`)
    .replace(/\{\{markw(?::([\w -]+))?\}\}/g, (_, cls) => `<svg class="markw${cls ? ' ' + cls : ''}" viewBox="0 0 46.599 37.306" aria-hidden="true"><path fill="currentColor" transform="translate(-81.700472 -129.84707) matrix(.98221306 0 0 .98221306 -8.216881 6.2322907)" d="${MARKW}"/></svg>`)
    .replace(/\{\{mark\}\}/g, markSvg().replace('<svg ', '<svg class="mark" aria-hidden="true" '))
    .replace(/\{\{status\}\}/g, STATUS);
  const out = path.join(ROOT, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return [out, Buffer.byteLength(html)];
}

const only = process.argv[2];
(async () => {
  for (const f of fs.readdirSync(path.join(ROOT, 'src')).filter((f) => f.endsWith('.html'))) {
    if (only && !f.startsWith(only)) continue;
    const [o, b] = await build(f);
    console.log(path.relative(ROOT, o), (b / 1024).toFixed(1) + ' KB');
  }
})();
