import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteOrigin = 'https://www.merayreklam.com';
const files = fs.readdirSync(root).filter(file => file.endsWith('.html'));
const errors = [];
const warnings = [];
let indexedPages = 0;

for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const noindex = /name="robots"[^>]*content="[^"]*noindex/i.test(html);
  if (!noindex) indexedPages++;

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || '';
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (!title) errors.push(`${file}: title eksik`);
  if (!noindex && !description) errors.push(`${file}: meta description eksik`);
  if (!noindex && h1Count !== 1) errors.push(`${file}: H1 sayısı ${h1Count}`);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  const expectedCanonical = file === 'index.html' ? `${siteOrigin}/` : `${siteOrigin}/${file.replace(/\.html$/, '')}`;
  if (!noindex && !canonical) errors.push(`${file}: canonical eksik`);
  if (!noindex && canonical && canonical !== expectedCanonical) errors.push(`${file}: canonical hatalı ${canonical}`);
  if (!noindex && !/application\/ld\+json/.test(html)) errors.push(`${file}: yapılandırılmış veri eksik`);
  if (!noindex && !/max-image-preview:large/.test(html)) warnings.push(`${file}: büyük görsel önizleme yönergesi eksik`);
  if (!/name="viewport"/.test(html)) errors.push(`${file}: viewport eksik`);

  for (const match of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${file}: geçersiz JSON-LD`); }
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\salt="[^"]*"/.test(match[1])) errors.push(`${file}: alt metni olmayan görsel`);
    const src = match[1].match(/\ssrc="([^"]+)"/)?.[1];
    if (src && !/^(?:https?:|data:|\/\/)/.test(src) && !fs.existsSync(path.join(root, src))) errors.push(`${file}: görsel bulunamadı ${src}`);
  }

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/gi)) {
    const ref = match[1].split('#')[0].split('?')[0];
    if (!ref || /^(?:https?:|mailto:|tel:|data:|\/\/|#)/.test(ref) || ref === './') continue;
    const localRef = ref.replace(/^\/+/, '');
    if (!localRef) continue;
    const directPath = path.join(root, localRef);
    const cleanUrlPath = path.join(root, `${localRef}.html`);
    if (!fs.existsSync(directPath) && !fs.existsSync(cleanUrlPath)) errors.push(`${file}: yerel bağlantı bulunamadı ${ref}`);
  }

  if (/href="(?!https?:\/\/|\/\/)[^"]+\.html(?:#[^"]*)?"/i.test(html)) errors.push(`${file}: .html uzantılı dahili bağlantı bulundu`);
}

const placeholders = [];
for (const file of ['robots.txt', 'sitemap.xml', ...files]) {
  const fullPath = path.join(root, file);
  if (fs.existsSync(fullPath) && fs.readFileSync(fullPath, 'utf8').includes('[SITE_URL]')) placeholders.push(file);
}
if (placeholders.length) warnings.push(`Alan adı yer tutucusu: ${placeholders.join(', ')}`);

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
if (!robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`)) errors.push('robots.txt: sitemap adresi hatalı');
if (/eyluleker\.github\.io\/meray-reklam/.test(sitemap)) errors.push('sitemap.xml: eski GitHub Pages adresi bulundu');
if (/\.html<\/loc>/.test(sitemap)) errors.push('sitemap.xml: .html uzantılı URL bulundu');

const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
if (vercelConfig.cleanUrls !== true) errors.push('vercel.json: cleanUrls etkin değil');
const indexRedirect = vercelConfig.redirects?.find(item => item.source === '/index.html');
if (!indexRedirect || indexRedirect.destination !== '/' || indexRedirect.statusCode !== 301) errors.push('vercel.json: /index.html 301 yönlendirmesi hatalı');

console.log(JSON.stringify({ pages: files.length, indexedPages, errors, warnings }, null, 2));
process.exitCode = errors.length ? 1 : 0;
