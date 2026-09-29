// Builds the responsive image set for the site.
// Source photos: assets/ig-full (Instagram @putrabrno, full res) + assets/gmaps-original (Google Maps originals).
// Output: assets/img/<slug>-<w>.{avif,webp,jpg} + assets/img/manifest.json
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets/img');
fs.mkdirSync(OUT, { recursive: true });

// slug -> [source, alt (cs), widths]
// M = full-screen photo, C = portrait/half-screen, L = landscape
const M = [640, 1024, 1600, 2400], C = [400, 800, 1200, 1600], L = [400, 800, 1200, 1600, 2400];
const PHOTOS = {
  'p-bento': ['ig-full/ig-bento-do-krabice.jpg', 'Nápis na růžových dortících v krabici s sebou', C],
  'p-brownie': ['ig-full/ig-brownie-maliny.jpg', 'Brownie s karamelem a sušenými malinami', L],
  'p-cappuccino': ['ig-full/ig-cappuccino-a-dort.jpg', 'Cappuccino v oranžovém hrnku a čokoládový zákusek na kulatém stolku', M],
  'p-choux-malinovy': ['ig-full/ig-choux-malinovy.jpg', 'Choux s růžovým krémem a sušenými malinami', L],
  'p-choux-nakrojene': ['ig-full/ig-choux-nakrojene.jpg', 'Nakrojený choux – poslední sousto na talíři', M],
  'p-choux-ostruzina': ['ig-full/ig-choux-ostruzina.jpg', 'Choux s ostružinovým krémem na šedém talíři s vidličkou', M],
  'p-choux-vidlicka': ['ig-full/ig-choux-ostruzina-vidlicka.jpg', 'Choux s ostružinovým krémem a vidličkou u okna', C],
  'p-cokoladovy-choux': ['ig-full/ig-cokoladovy-choux.jpg', 'Čokoládový choux s krémovou korunkou na dřevěném pultu ve slunci', C],
  'p-croissant-choux': ['gmaps-original/putra-google-maps-22-croissant-a-choux.jpg', 'Croissant a růžový choux na stole se sklenicemi vody', C],
  'p-croissanty': ['ig-full/ig-croissanty.jpg', 'Croissanty na dřevěném prkénku zblízka', C],
  'p-croissanty-plech': ['ig-full/ig-croissanty-plech.jpg', 'Plech čerstvě upečených croissantů s vrstvami listového těsta', M],
  'p-cukrovi-krabice': ['ig-full/ig-krabice-cukrovi.jpg', 'Krabice vánočního cukroví mezi větvičkami jedle', M],
  'p-dort-cokoladovy': ['gmaps-original/putra-google-maps-02-dort-cokoladovy.jpg', 'Čokoládový dort na objednávku zdobený kousky čokolády', C],
  'p-dort-potirani': ['ig-full/ig-dort-ovoce-potirani.jpg', 'Potírání lesního ovoce na krémovém dortu štětečkem', C],
  'p-dort-shora': ['ig-full/ig-cokoladovy-dort-shora.jpg', 'Čokoládový dort shora, nakrájený na dílky se šlehačkou', C],
  'p-dvojice': ['ig-full/ig-dvojice-u-dveri.webp', 'Dva lidé v zástěrách se smějí u zelených dveří Putry', C],
  'p-interier-kvetiny': ['gmaps-original/putra-google-maps-24-interier-s-kvetinami.jpg', 'Vitrína, dřevěné lamely a kytice na pultu', C],
  'p-interier-pult': ['gmaps-original/putra-google-maps-05-interier-pult.jpg', 'Interiér s papírovou lampou, vitrínou a místem u okna', C],
  'p-jednorozec': ['ig-full/ig-dort-jednorozec.jpg', 'Dort jednorožec s růžovým krémem na otočném stojanu', M],
  'p-kuchyne-vajicko': ['ig-full/ig-kuchyne-vajicko.jpg', 'Cukrářka s vajíčkem v ruce ukazuje v ranní výrobně véčko', M],
  'p-latte-shora': ['ig-full/ig-latte-shora.jpg', 'Latte art v malém šálku na dřevěném stole v ostrém slunci', M],
  'p-ledove': ['ig-full/ig-ledove-piti.jpg', 'Ledový nápoj s citronem na kulatém stolku ve slunci', C],
  'p-limonady': ['ig-full/ig-limonady-na-stole.jpg', 'Lahve limonád na dřevěném stole s pruhovanou látkou', C],
  'p-linecke': ['ig-full/ig-linecke-hvezdy.jpg', 'Ruce skládají linecké hvězdičky na plech', M],
  'p-makronky': ['ig-full/ig-makronky.jpg', 'Tři světlé makronky na keramickém talířku', C],
  'p-malinovy': ['gmaps-original/putra-google-maps-10-malinovy-dezert.jpg', 'Nakousnutý malinový dezert na talíři ve slunci', C],
  'p-matcha': ['ig-full/ig-matcha-limonady.jpg', 'Tři lahve matcha limonády na stolku', C],
  'p-okno-hero': ['gmaps-original/putra-google-maps-01-okno-posezeni.jpg', 'Posezení u velkého okna v Putře – dřevěná křesla, polštáře a pohled do Táborské', M],
  'p-okno-polstare': ['gmaps-original/putra-google-maps-16-okno-s-polstari.jpg', 'Okno s polštáři a košíkem, venku rozmazaná ulice', M],
  'p-oranzovy-hrnek': ['ig-full/ig-oranzovy-hrnek.jpg', 'Oranžový keramický hrnek s vyraženým logem na stolku', C],
  'p-pavlova-smich': ['ig-full/ig-pavlova-smich.jpg', 'Smějící se host u okna s pavlovou na talíři', M],
  'p-pavlova-vidlicka': ['ig-full/ig-pavlova-vidlicka.jpg', 'Mini pavlova s jahodou a ostružinou na talíři v ruce', C],
  'p-pavlova-vysoka': ['ig-full/ig-pavlova-vysoka.jpg', 'Vysoká pavlova s lesním ovocem u okna', M],
  'p-pusinky': ['ig-full/ig-pusinky-tocene.jpg', 'Točené sněhové pusinky na děrovaném plechu', M],
  'p-reel-pavlova': ['ig-full/reel-pavlova-poster.jpg', 'Pavlova s ovocnou omáčkou na talíři, vidlička nad ní', C],
  'p-rez-kava': ['gmaps-original/putra-google-maps-25-cokoladovy-rez-a-kava.jpg', 'Čokoládový řez s pekanem a káva v oranžovém hrnku', C],
  'p-slunce': ['gmaps-original/putra-google-maps-08-slunce-na-okne.jpg', 'Slunce na parapetu, proutěný košík a lněné polštáře, za oknem jede tramvaj', M],
  'p-stoly-u-okna': ['gmaps-original/putra-google-maps-21-stoly-u-okna.jpg', 'Stolky a dřevěné židle u výlohy, venku Táborská', L],
  'p-u-dveri': ['ig-full/ig-u-dveri-smich.jpg', 'Usměvavá cukrářka v oranžové zástěře ve dveřích Putry', M],
  'p-vceli-uly': ['ig-full/ig-vceli-uly.jpg', 'Řady čokoládových včelích úlků', M],
  'p-vetrnik': ['ig-full/ig-vetrnik-talir.jpg', 'Větrník s karamelem na keramickém talířku v šikmém světle', C],
  'p-vetrnik-dvere': ['ig-full/ig-vetrnik-u-dveri.jpg', 'Větrník na talíři před výlohou s nápisem Putra', L],
  'p-vitrina-cedulky': ['gmaps-original/putra-google-maps-14-vitrina-s-cedulkami.jpg', 'Vitrína se zákusky a papírovými cedulkami s názvy', C],
  'p-vitrina-choux': ['gmaps-original/putra-google-maps-23-vitrina-choux-a-rezy.jpg', 'Police vitríny s choux, řezy a čokoládovými zákusky', L],
  'p-vyrobna': ['ig-full/ig-vyrobna-kvetiny.jpg', 'Váza s kvetoucí větví a pohled do výrobny s regály plechů', C],
  'p-zakusek-kava': ['ig-full/ig-cokoladovy-zakusek-kava.jpg', 'Nakrojený čokoládový zákusek a káva v oranžovém hrnku', L],
  'p-zastera': ['ig-full/ig-zastera-u-dveri.jpg', 'Oranžová zástěra ve dveřích s věncem a cedulkou Putra', M],
  'p-zdobeni': ['ig-full/ig-zdobeni-bento.jpg', 'Cukrář v oranžové čepici zdobí malé dortíky v krabici', M],
  'p-zidle-svetlo': ['gmaps-original/putra-google-maps-28-zidle-ve-svetle.jpg', 'Prázdné dřevěné židle v nízkém odpoledním světle', M],
};

(async () => {
  const manifest = {};
  for (const [slug, [src, alt, widths]] of Object.entries(PHOTOS)) {
    const input = path.join(ROOT, 'assets', src);
    const meta = await sharp(input).rotate().metadata();
    const w0 = meta.autoOrient ? meta.autoOrient.width : meta.width;
    const h0 = meta.autoOrient ? meta.autoOrient.height : meta.height;
    const ws = widths.filter((w) => w <= w0);
    if (!ws.length) ws.push(w0);
    // keep the native width too when the source is notably bigger than the largest step (1440 px IG originals)
    if (slug.startsWith('p-') && ws[ws.length - 1] < widths[widths.length - 1] && w0 <= 1600 && w0 > ws[ws.length - 1] * 1.15) ws.push(w0);
    for (const w of ws) {
      const f = (x) => path.join(OUT, `${slug}-${w}.${x}`);
      if (['avif', 'webp', 'jpg'].every((x) => fs.existsSync(f(x)))) continue; // already built
      const base = sharp(input).rotate().resize({ width: w });
      await base.clone().avif({ quality: w >= 1600 ? 44 : 52, effort: 5 }).toFile(path.join(OUT, `${slug}-${w}.avif`));
      await base.clone().webp({ quality: 74 }).toFile(path.join(OUT, `${slug}-${w}.webp`));
      await base.clone().jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${slug}-${w}.jpg`));
    }
    // tiny blurred placeholder colour
    const { dominant } = await sharp(input).stats();
    manifest[slug] = { alt, widths: ws, ratio: +(w0 / h0).toFixed(4), w: w0, h: h0,
      color: `rgb(${dominant.r},${dominant.g},${dominant.b})` };
    console.log(slug, ws.join(','), manifest[slug].ratio);
  }
  // Open Graph card 1200x630
  await sharp(path.join(ROOT, 'assets/gmaps-original/putra-google-maps-01-okno-posezeni.jpg')).resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, 'og-putra.jpg'));
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
})();
