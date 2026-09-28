// node tools/peek.js <slug> <selector-or-scrollY> [out] [width] [height]  -> viewport screenshot after scrolling
const puppeteer = require('/Users/matusburda/inspiration-library/node_modules/puppeteer-core');
(async () => {
  const [slug, where, out = '/private/tmp/claude-501/-Users-matusburda/c33d0d62-8cec-4449-9f33-c6c817577d72/scratchpad/peek.jpg', w = 1440, h = 900] = process.argv.slice(2);
  const b = await puppeteer.launch({ headless: 'new', executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', userDataDir: '/private/tmp/claude-501/putra-shot-profile', args: ['--no-first-run'] });
  const p = await b.newPage(); await p.setViewport({ width: +w, height: +h, isMobile: +w < 800 });
  await p.goto('http://localhost:4410/' + slug + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(async (where) => {
    const steps = 12, target = isNaN(+where) ? document.querySelector(where).getBoundingClientRect().top + scrollY : +where;
    for (let i = 1; i <= steps; i++) { window.scrollTo(0, target * i / steps); await new Promise((r) => setTimeout(r, 60)); }
  }, where);
  await new Promise((r) => setTimeout(r, 1800));
  await p.screenshot({ path: out, type: 'jpeg', quality: 78 });
  await b.close();
})();
