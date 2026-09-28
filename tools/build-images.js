// Builds the shared responsive image set for every lab version.
// Source photos: assets/gmaps (Google Maps listing) + assets/ig (Instagram @putrabrno).
// Output: assets/img/<slug>-<w>.{avif,webp,jpg} + assets/img/manifest.json
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets/img');
fs.mkdirSync(OUT, { recursive: true });

// slug -> [source, alt (cs), widths]
const PHOTOS = {
  'okno-posezeni':      ['gmaps/gm-01.jpg', 'Posezení u velkého okna v Putře – dřevěná křesla, polštáře a ranní světlo z Táborské', [640, 1024, 1600, 2400]],
  'slunce-na-okne':     ['gmaps/gm-08.jpg', 'Slunce na parapetu, proutěný košík a lněné polštáře v kavárně Putra', [640, 1024, 1600, 2400]],
  'interier-pult':      ['gmaps/gm-05.jpg', 'Interiér cukrárny Putra – pult, vitrína a dřevěné obložení', [480, 960, 1600]],
  'interier-svetlo':    ['gmaps/gm-07.jpg', 'Světlý interiér Putry s pohledem do ulice', [480, 960, 1600]],
  'vitrina-zakusky':    ['gmaps/gm-04.jpg', 'Prosklená vitrína plná zákusků, dortů a řezů', [640, 1024, 1600]],
  'dort-cokoladovy':    ['gmaps/gm-02.jpg', 'Čokoládový dort na objednávku zdobený kousky čokolády', [480, 960, 1600]],
  'krabice-zakusku':    ['gmaps/gm-03.jpg', 'Krabice zákusků s sebou – tartaletky, řezy a choux', [480, 960, 1600]],
  'kava-a-dezert':      ['gmaps/gm-06.jpg', 'Flat white, cappuccino a dezerty na dřevěném stole', [480, 960, 1600]],
  'tulipany-dezerty':   ['gmaps/gm-09.jpg', 'Dva dezerty na talířích vedle kytice tulipánů', [480, 960, 1600]],
  'malinovy-dezert':    ['gmaps/gm-10.jpg', 'Malinový dezert s krémem na keramickém talíři', [480, 960, 1600]],
  'pusinky':            ['ig/ig-2026-07-20-kavarna-pecivo.jpg', 'Sněhové pusinky ve tvaru točené šlehačky na plechu', [480, 960, 1600]],
  'mini-pavlova':       ['ig/ig-2026-07-31-tarty-ovoce.jpg', 'Mini pavlova s borůvkami a jahodou na tmavém talíři', [480, 960, 1600, 2400]],
  'dort-zdobeni':       ['ig/ig-2026-08-01-dort-jahody.jpg', 'Zdobení dortu s lesním ovocem a krémem', [480, 960, 1400]],
  'pavlova-dort':       ['ig/reel-2026-06-02-pavlova.jpg', 'Pavlova dort s jahodami, fíky a mučenkou', [320, 640]],
  'tartaletka-jahoda':  ['ig/reel-2026-07-30-tartaletka.jpg', 'Tartaletka s krémem a jahodou', [320, 640]],
  'zmrzlina-pistacie':  ['ig/reel-2026-08-05-zmrzlina.jpg', 'Domácí pistáciová zmrzlina v kelímku', [320, 640]],
  'levandule':          ['ig/reel-2026-09-15-cukrovi.jpg', 'Levandule před provozovnou na Táborské', [320, 640]],
  'trava-pred-putrou':  ['ig/reel-2026-09-03-sen.jpg', 'Okrasná tráva před Putrou v odpoledním světle', [320, 640]],
};


// 07F „Den v Putře+“: the full Downloads/Putra set (Instagram full-res + all Maps originals).
// M = main timeline frame, C = horizontal-strip card.
const M = [640, 1024, 1600, 2400], C = [400, 800], L = [400, 800, 1200]; // L = landscape strip card
Object.assign(PHOTOS, {
  'p-okno-hero':        ['gmaps-original/putra-google-maps-01-okno-posezeni.jpg', 'Posezení u velkého okna v Putře – dřevěná křesla, polštáře a pohled do Táborské', M],
  'p-croissanty-plech': ['ig-full/ig-croissanty-plech.jpg', 'Plech čerstvě upečených croissantů s vrstvami listového těsta', M],
  'p-pusinky':          ['ig-full/ig-pusinky-tocene.jpg', 'Točené sněhové pusinky na děrovaném plechu', M],
  'p-croissanty':       ['ig-full/ig-croissanty.jpg', 'Croissanty na dřevěném prkénku zblízka', C],
  'p-dort-potirani':    ['ig-full/ig-dort-ovoce-potirani.jpg', 'Potírání lesního ovoce na krémovém dortu štětečkem', C],
  'p-vyrobna':          ['ig-full/ig-vyrobna-kvetiny.jpg', 'Váza s kvetoucí větví a pohled do výrobny s regály plechů', C],
  'p-cokoladovy-choux': ['ig-full/ig-cokoladovy-choux.jpg', 'Čokoládový choux s krémovou korunkou na dřevěném pultu ve slunci', C],
  'p-vitrina':          ['gmaps-original/putra-google-maps-04-vitrina-zakusky.jpg', 'Prosklená vitrína plná zákusků, řezů a choux s ručně psanými cedulkami', M],
  'p-vitrina-choux':    ['gmaps-original/putra-google-maps-23-vitrina-choux-a-rezy.jpg', 'Police vitríny s choux, řezy a čokoládovými zákusky', L],
  'p-vitrina-cedulky':  ['gmaps-original/putra-google-maps-14-vitrina-s-cedulkami.jpg', 'Vitrína se zákusky a papírovými cedulkami s názvy', C],
  'p-vetrnik':          ['ig-full/ig-vetrnik-talir.jpg', 'Větrník s karamelem na keramickém talířku v šikmém světle', C],
  'p-choux-malinovy':   ['ig-full/ig-choux-malinovy.jpg', 'Choux s růžovým krémem a sušenými malinami', L],
  'p-choux-vanilka':    ['ig-full/ig-choux-vanilka.jpg', 'Choux s křupavou krustou a vanilkovým krémem', C],
  'p-cheesecake':       ['ig-full/ig-cheesecake.jpg', 'Kousek cheesecaku s borůvkami na talířku', C],
  'p-brownie':          ['ig-full/ig-brownie-maliny.jpg', 'Brownie s karamelem a sušenými malinami', L],
  'p-makronky':         ['ig-full/ig-makronky.jpg', 'Tři světlé makronky na keramickém talířku', C],
  'p-u-dveri':          ['ig-full/ig-u-dveri-smich.jpg', 'Usměvavá cukrářka v oranžové zástěře ve dveřích Putry', M],
  'p-dvojice':          ['ig-full/ig-dvojice-u-dveri.webp', 'Dva lidé v zástěrách se smějí u zelených dveří Putry', C],
  'p-interier-svetlo':  ['gmaps-original/putra-google-maps-07-interier-svetlo.jpg', 'Světlý interiér Putry s pultem a pohledem do ulice', L],
  'p-interier-pult':    ['gmaps-original/putra-google-maps-05-interier-pult.jpg', 'Interiér s papírovou lampou, vitrínou a místem u okna', C],
  'p-interier-kvetiny': ['gmaps-original/putra-google-maps-24-interier-s-kvetinami.jpg', 'Vitrína, dřevěné lamely a kytice na pultu', C],
  'p-cappuccino':       ['ig-full/ig-cappuccino-a-dort.jpg', 'Cappuccino v oranžovém hrnku a čokoládový zákusek na kulatém stolku', M],
  'p-latte-shora':      ['ig-full/ig-latte-shora.jpg', 'Latte art v malém šálku na dřevěném stole v ostrém slunci', M],
  'p-zakusek-kava':     ['ig-full/ig-cokoladovy-zakusek-kava.jpg', 'Nakrojený čokoládový zákusek a káva v oranžovém hrnku', L],
  'p-oranzovy-hrnek':   ['ig-full/ig-oranzovy-hrnek.jpg', 'Oranžový keramický hrnek s vyraženým logem na stolku', C],
  'p-kava-dezert':      ['gmaps-original/putra-google-maps-06-kava-a-dezert.jpg', 'Dvě kávy s latte art a dva dezerty na dřevěném stole', C],
  'p-ledove':           ['ig-full/ig-ledove-piti.jpg', 'Ledový nápoj s citronem na kulatém stolku ve slunci', C],
  'p-pavlova-smich':    ['ig-full/ig-pavlova-smich.jpg', 'Smějící se host u okna s pavlovou na talíři', M],
  'p-pavlova-vysoka':   ['ig-full/ig-pavlova-vysoka.jpg', 'Vysoká pavlova s lesním ovocem u okna', M],
  'p-reel-pavlova':     ['ig-full/reel-pavlova-poster.jpg', 'Pavlova s ovocnou omáčkou na talíři, vidlička nad ní', C],
  'p-pavlova-vidlicka': ['ig-full/ig-pavlova-vidlicka.jpg', 'Mini pavlova s jahodou a ostružinou na talíři v ruce', C],
  'p-vetrnik-dvere':    ['ig-full/ig-vetrnik-u-dveri.jpg', 'Větrník na talíři před výlohou s nápisem Putra', L],
  'p-choux-vidlicka':   ['ig-full/ig-choux-ostruzina-vidlicka.jpg', 'Choux s ostružinovým krémem a vidličkou u okna', C],
  'p-malinovy':         ['gmaps-original/putra-google-maps-10-malinovy-dezert.jpg', 'Nakousnutý malinový dezert na talíři ve slunci', C],
  'p-slunce':           ['gmaps-original/putra-google-maps-08-slunce-na-okne.jpg', 'Slunce na parapetu, proutěný košík a lněné polštáře, za oknem jede tramvaj', M],
  'p-parapet-den':      ['gmaps-original/putra-google-maps-15-posezeni-u-okna-den.jpg', 'Lavice u okna s barevnými polštáři a kulatým stolkem', L],
  'p-stoly-u-okna':     ['gmaps-original/putra-google-maps-21-stoly-u-okna.jpg', 'Stolky a dřevěné židle u výlohy, venku Táborská', L],
  'p-okno-latky':       ['gmaps-original/putra-google-maps-26-interier-okno-a-latky.jpg', 'Místo u okna s polštáři za dřevěnými lamelami', C],
  'p-matcha':           ['ig-full/ig-matcha-limonady.jpg', 'Tři lahve matcha limonády na stolku', C],
  'p-limonady':         ['ig-full/ig-limonady-na-stole.jpg', 'Lahve limonád na dřevěném stole s pruhovanou látkou', C],
  'p-jednorozec':       ['ig-full/ig-dort-jednorozec.jpg', 'Dort jednorožec s růžovým krémem na otočném stojanu', M],
  'p-zdobeni':          ['ig-full/ig-zdobeni-bento.jpg', 'Cukrář v oranžové čepici zdobí malé dortíky v krabici', M],
  'p-bento':            ['ig-full/ig-bento-do-krabice.jpg', 'Nápis na růžových dortících v krabici s sebou', C],
  'p-dort-shora':       ['ig-full/ig-cokoladovy-dort-shora.jpg', 'Čokoládový dort shora, nakrájený na dílky se šlehačkou', C],
  'p-dort-cokoladovy':  ['gmaps-original/putra-google-maps-02-dort-cokoladovy.jpg', 'Čokoládový dort na objednávku zdobený kousky čokolády', C],
  'p-choux-ostruzina':  ['ig-full/ig-choux-ostruzina.jpg', 'Choux s ostružinovým krémem na šedém talíři s vidličkou', M],
  'p-choux-nakrojene':  ['ig-full/ig-choux-nakrojene.jpg', 'Nakrojený choux – poslední sousto na talíři', M],
  'p-croissant-choux':  ['gmaps-original/putra-google-maps-22-croissant-a-choux.jpg', 'Croissant a růžový choux na stole se sklenicemi vody', C],
  'p-brownie-pain':     ['gmaps-original/putra-google-maps-27-brownie-a-pain-au-chocolat.jpg', 'Pain au chocolat a kousek brownie na stole po odpoledni', C],
  'p-rez-kava':         ['gmaps-original/putra-google-maps-25-cokoladovy-rez-a-kava.jpg', 'Čokoládový řez s pekanem a káva v oranžovém hrnku', C],
  'p-zidle-svetlo':     ['gmaps-original/putra-google-maps-28-zidle-ve-svetle.jpg', 'Prázdné dřevěné židle v nízkém odpoledním světle', M],
  'p-zastera':          ['ig-full/ig-zastera-u-dveri.jpg', 'Oranžová zástěra ve dveřích s věncem a cedulkou Putra', M],
  'p-cukrovi-krabice':  ['ig-full/ig-krabice-cukrovi.jpg', 'Krabice vánočního cukroví mezi větvičkami jedle', M],
  'p-linecke':          ['ig-full/ig-linecke-hvezdy.jpg', 'Ruce skládají linecké hvězdičky na plech', M],
  'p-vceli-uly':        ['ig-full/ig-vceli-uly.jpg', 'Řady čokoládových včelích úlků', M],
  'p-okno-polstare':    ['gmaps-original/putra-google-maps-16-okno-s-polstari.jpg', 'Okno s polštáři a košíkem, venku rozmazaná ulice', M],
});

(async () => {
  const manifest = {};
  for (const [slug, [src, alt, widths]] of Object.entries(PHOTOS)) {
    const input = path.join(ROOT, 'assets', src);
    const meta = await sharp(input).rotate().metadata();
    const w0 = meta.autoOrient ? meta.autoOrient.width : meta.width;
    const h0 = meta.autoOrient ? meta.autoOrient.height : meta.height;
    const ws = widths.filter((w) => w <= w0);
    if (!ws.length) ws.push(w0);
    // 07F set: keep the native width too when the source is notably bigger than the largest step (1440 px IG originals)
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
  await sharp(path.join(ROOT, 'assets/gmaps/gm-01.jpg')).resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, 'og-putra.jpg'));
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
})();
