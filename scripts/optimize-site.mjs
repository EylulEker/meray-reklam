import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteOrigin = 'https://www.merayreklam.com';
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
const servicePages = new Set([
  'aydin-arac-giydirme.html', 'aydin-cephe-giydirme.html', 'aydin-cnc-kesim.html',
  'aydin-dijital-baski.html', 'aydin-lazer-kesim.html', 'aydin-tabela.html',
  'aydin-totem-tabela.html', 'magaza-vitrin-giydirme.html'
]);

const business = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': '#meray-reklam',
  name: 'Meray Reklam',
  legalName: 'Meray Reklam',
  foundingDate: '2001',
  telephone: '+905067273465',
  email: 'merayreklam@hotmail.com',
  hasMap: 'https://maps.app.goo.gl/nVN23uZ2cdJMD6un9',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ata Mahallesi, 773. Sokak, Astis Kooperatifi 4K',
    postalCode: '09010',
    addressLocality: 'Efeler',
    addressRegion: 'Aydın',
    addressCountry: 'TR'
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00'
  }],
  areaServed: ['Efeler', 'Kuşadası', 'Söke', 'Nazilli', 'Didim', 'İncirliova', 'Germencik', 'Muğla', 'Türkiye'],
  sameAs: ['https://www.instagram.com/merayreklam/', 'https://www.facebook.com/merayreklam']
};

function textContent(value = '') {
  return value.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function pageType(file) {
  if (servicePages.has(file)) return 'Service';
  if (file === 'hakkimizda.html') return 'AboutPage';
  if (file === 'iletisim.html') return 'ContactPage';
  if (file === 'projeler.html') return 'CollectionPage';
  return 'WebPage';
}

for (const file of pages) {
  const fullPath = path.join(root, file);
  let html = fs.readFileSync(fullPath, 'utf8');

  if (file === '404.html') {
    if (!html.includes('name="robots"')) {
      html = html.replace('<meta name="viewport" content="width=device-width,initial-scale=1">', '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow">');
    }
    html = html.replace(/<script\s+src="js\/main\.js"/g, '<script defer src="js/main.js"');
    fs.writeFileSync(fullPath, html);
    continue;
  }

  const title = textContent(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || '';
  const h1 = textContent(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]) || title;
  const route = file === 'index.html' ? '' : `/${file.replace(/\.html$/, '')}`;
  const canonical = file === 'index.html' ? `${siteOrigin}/` : `${siteOrigin}${route}`;

  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, `<link rel="canonical" href="${canonical}">`);
  if (!html.includes('rel="canonical"')) {
    html = html.replace(/(<meta\s+name="description"[^>]*>)/i, `$1<link rel="canonical" href="${canonical}">`);
  }
  html = html.replace(/href="(?!https?:\/\/|\/\/)([^"#?]+)\.html(#[^"]*)?"/gi, (_, routePath, fragment = '') => `href="/${routePath.replace(/^\/+/, '')}${fragment}"`);
  html = html.replace(/<meta\s+property="og:url"\s+content="https:\/\/\[SITE_URL\][^"]*">/gi, '');
  html = html.replace(/https:\/\/\[SITE_URL\]\/(assets\/images\/[^"<]+?)\.png/gi, '$1.webp');
  html = html.replace(/https:\/\/\[SITE_URL\]\/(assets\/[^"]+)/gi, '$1');

  const globalMeta = '<meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#111111"><meta property="og:type" content="website"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="Meray Reklam">';
  html = html.replace(/<meta\s+name="robots"[^>]*>/gi, '').replace(/<meta\s+name="theme-color"[^>]*>/gi, '').replace(/<meta\s+property="og:type"[^>]*>/gi, '').replace(/<meta\s+property="og:locale"[^>]*>/gi, '').replace(/<meta\s+property="og:site_name"[^>]*>/gi, '');
  html = html.replace('<meta name="viewport" content="width=device-width,initial-scale=1">', `<meta name="viewport" content="width=device-width,initial-scale=1">${globalMeta}`);

  const iconLinks = '<link rel="icon" href="favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png"><link rel="apple-touch-icon" href="apple-touch-icon.png">';
  if (!html.includes('apple-touch-icon')) html = html.replace(/<link\s+rel="stylesheet"/i, `${iconLinks}<link rel="stylesheet"`);

  const fontLinks = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap" rel="stylesheet">';
  if (!html.includes('fonts.gstatic.com')) html = html.replace(/<link\s+rel="stylesheet"\s+href="css\/style\.css">/i, `${fontLinks}<link rel="stylesheet" href="css/style.css">`);

  html = html.replace(/<script\s+src="js\//g, '<script defer src="js/').replace(/<script\s+defer\s+defer/g, '<script defer').replace(/(<script\s+defer\s+src="[^"]+")\s+defer>/g, '$1>');
  html = html.replace(/<img\b[^>]*>/gi, tag => {
    if (!/\sdecoding=/.test(tag)) tag = tag.replace(/>$/, ' decoding="async">');
    const keepEager = /meray-reklam-logo-orange|assets\/logos\/references/.test(tag);
    if (/assets\/logos\/references/.test(tag) && !/\sfetchpriority=/.test(tag)) tag = tag.replace(/>$/, ' fetchpriority="low">');
    if (!keepEager) {
      tag = tag.replace(/\sloading="eager"/g, ' loading="lazy"');
      if (!/\sloading=/.test(tag)) tag = tag.replace(/>$/, ' loading="lazy">');
    }
    return tag;
  });

  html = html.replace(
    /<img src="assets\/images\/meray-reklam-tasarim-uretim-uygulama\.png"([^>]*)>/,
    '<img src="assets/images/meray-reklam-tasarim-uretim-uygulama.webp" srcset="assets/images/meray-reklam-tasarim-uretim-uygulama-960.webp 960w, assets/images/meray-reklam-tasarim-uretim-uygulama.webp 1983w" sizes="(max-width: 680px) 100vw, min(100vw - 56px, 1540px)"$1>'
  );
  html = html.replace(
    /<img class="reveal" src="assets\/images\/meray-reklam-cnc-uretim\.png"([^>]*)>/,
    '<img class="reveal" src="assets/images/meray-reklam-cnc-uretim.webp" srcset="assets/images/meray-reklam-cnc-uretim-768.webp 768w, assets/images/meray-reklam-cnc-uretim.webp 1536w" sizes="(max-width: 1100px) 100vw, 50vw"$1>'
  );

  const type = pageType(file);
  const pageNode = { '@type': type, name: h1, description, inLanguage: 'tr-TR', publisher: { '@id': '#meray-reklam' } };
  if (type === 'Service') {
    pageNode.provider = { '@id': '#meray-reklam' };
    pageNode.areaServed = ['Aydın', 'Ege Bölgesi', 'Türkiye'];
  }
  const schema = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [business, pageNode] })}</script>`;
  html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  html = html.replace('</head>', `${schema}</head>`);

  if (file === 'index.html' && !html.includes('meray-reklam-mimari-tabela-hero.webp" fetchpriority')) {
    html = html.replace('</head>', '<link rel="preload" as="image" href="assets/images/meray-reklam-mimari-tabela-hero.webp" fetchpriority="high"></head>');
  }
  fs.writeFileSync(fullPath, html, 'utf8');
}

console.log(`Optimized ${pages.length} HTML files.`);
