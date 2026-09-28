// Mobile Lighthouse for every version via the Node API, attached to the native Chrome on :9555.
import fs from 'fs';
import lighthouse from '/Users/matusburda/.npm/_npx/8003d8991b0d346b/node_modules/lighthouse/core/index.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/Users/matusburda/inspiration-library/node_modules/puppeteer-core');
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9555' });
const want = process.argv.slice(2);
const dirs = fs.readdirSync('.').filter((d) => /^v\d\d[a-z]?-/.test(d) && (!want.length || want.some((w) => d.startsWith(w))));
// merge into existing scores so a partial run keeps the others
const out = fs.existsSync('lh/scores.json') ? JSON.parse(fs.readFileSync('lh/scores.json', 'utf8')) : {};
for (const d of dirs) {
  const page = await browser.newPage();
  const r = await lighthouse(`http://localhost:4410/${d}/`, { output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, undefined, page);
  const c = r.lhr.categories, a = r.lhr.audits;
  out[d] = { p: Math.round(c.performance.score * 100), a: Math.round(c.accessibility.score * 100), b: Math.round(c['best-practices'].score * 100), s: Math.round(c.seo.score * 100),
    lcp: a['largest-contentful-paint'].displayValue, cls: a['cumulative-layout-shift'].displayValue, tbt: a['total-blocking-time'].displayValue, kb: Math.round(a['total-byte-weight'].numericValue / 1024),
    fails: Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode === 'binary').map((x) => x.id) };
  console.log(d.padEnd(22), out[d].p, out[d].a, out[d].b, out[d].s, 'LCP', out[d].lcp, 'CLS', out[d].cls, 'TBT', out[d].tbt, out[d].kb + 'KB', out[d].fails.join(','));
  await page.close();
}
fs.writeFileSync('lh/scores.json', JSON.stringify(out, null, 1));
browser.disconnect();
