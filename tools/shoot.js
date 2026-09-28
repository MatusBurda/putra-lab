// node tools/shoot.js v01 [v02 ...]  -> shots/<slug>-{desk,mob,full}.jpg
const puppeteer = require('/Users/matusburda/inspiration-library/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'http://localhost:4410/';

(async () => {
  const want = process.argv.slice(2);
  const dirs = fs.readdirSync(ROOT).filter((d) => /^v\d\d[a-z]?-/.test(d) && (!want.length || want.some((w) => d.startsWith(w))));
  fs.mkdirSync(path.join(ROOT, 'shots'), { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new', timeout: 120000, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', userDataDir: '/private/tmp/claude-501/putra-shot-profile', args: ['--no-first-run', '--no-default-browser-check', '--disable-extensions'] });
  for (const d of dirs) {
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + d + '/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(ROOT, 'shots', d + '-desk.jpg'), type: 'jpeg', quality: 80 });
    // walk the page so lazy images load, then full-page
    const eager = () => page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } window.scrollTo(0, 0); document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')); await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); });
    await eager();
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(ROOT, 'shots', d + '-full.jpg'), type: 'jpeg', quality: 60, fullPage: true });
    await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 });
    await page.goto(BASE + d + '/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ROOT, 'shots', d + '-mob.jpg'), type: 'jpeg', quality: 80 });
    await eager();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(ROOT, 'shots', d + '-mobfull.jpg'), type: 'jpeg', quality: 55, fullPage: true });
    console.log(d, 'overflowX:', overflow, errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no errors');
    await page.close();
  }
  await browser.close();
})();
