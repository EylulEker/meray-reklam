import fs from 'node:fs';

const source = fs.readFileSync('hakkimizda.html', 'utf8');
const topbarStart = source.indexOf('<div class="site-topbar">');
const headerStart = source.indexOf('<header');
const headerEnd = source.indexOf('</header>', headerStart) + '</header>'.length;
const footerStart = source.indexOf('<footer');
let header = source.slice(headerStart, headerEnd)
  .replace(' class="active" href="hakkimizda.html"', ' href="hakkimizda.html"')
  .replace(' href="index.html#hizmetler">Hizmetler', ' class="active" href="index.html#hizmetler">Hizmetler');
const footer = source.slice(footerStart);
const topbar = topbarStart >= 0 ? source.slice(topbarStart, headerStart) : '';

const pages = [
  {
    file: 'aydin-tabela.html', title: 'Aydın Tabela Sistemleri', eyebrow: 'Tabela sistemleri',
    hero: 'Markanızın mekândaki<br><span class="orange">ilk cümlesi.</span>',
    introTitle: 'Tabela, markanın mekândaki ilk cümlesidir.',
    intro: 'Aydın’da tabela ihtiyacı yalnızca bir isim levhası üretmekten ibaret değildir. Cephe ölçeği, görüş mesafesi, çevredeki ışık, okunurluk, malzeme dayanımı ve marka dili aynı projede birlikte değerlendirilmelidir.',
    image: 'assets/images/service-tabela-v2.webp', alt: 'Aydın’da modern ışıklı kutu harf tabela uygulaması',
    scope: ['Işıklı tabela','Kutu harf','Krom harf','Neon tabela','Light box','Totem ve yönlendirme'],
    sections: [
      ['Doğru tabela nasıl planlanır?', 'Ölçü, görüş açısı ve montaj yüzeyi yerinde değerlendirilir. Harf yüksekliği ile aydınlatma gücü, tabelanın yakından ve uzaktan net okunacağı biçimde belirlenir.'],
      ['Malzeme ve ışık birlikte seçilir', 'Alüminyum, pleksi, paslanmaz, kompozit ve farklı levha malzemeleri; projenin konumuna, kullanım süresine ve marka karakterine göre seçilir. Işık sistemleri parlamayı azaltacak ve homojen aydınlatma sağlayacak şekilde kurgulanır.'],
      ['Üretimden montaja tek ekip', 'Tasarım, CNC ve lazer kesim, harf üretimi, elektrik altyapısı ve montaj kendi ekibimizce planlanır. Böylece proje çizimden sahadaki son kontrole kadar aynı standartla ilerler.']
    ], cta: 'Tabelanız mekânla birlikte çalışsın.', ctaText: 'Ölçü ve uygulama alanını paylaşın.'
  },
  {
    file: 'aydin-arac-giydirme.html', title: 'Aydın Araç Giydirme', eyebrow: 'Araç giydirme',
    hero: 'Markanız yolda da<br><span class="orange">net görünsün.</span>',
    introTitle: 'Hareket eden, akılda kalan bir marka yüzeyi.',
    intro: 'Araç giydirme; tasarımın araç formuna doğru uyarlanması, baskı kalitesi ve titiz uygulamanın birlikte yönetildiği bir süreçtir. Tek araçtan kurumsal filolara kadar her projeyi ölçüye göre hazırlıyoruz.',
    image: 'assets/images/service-arac-giydirme-v2.webp', alt: 'Turuncu detaylı profesyonel ticari araç giydirme uygulaması',
    scope: ['Tam kaplama','Kısmi kaplama','Filo uygulaması','Araç yazıları','Reflektif folyo','Söküm ve yenileme'],
    sections: [
      ['Tasarım araç formuna göre hazırlanır', 'Kapı birleşimleri, camlar, kıvrımlar ve görüş alanları tasarımın doğal parçalarıdır. Grafik yerleşimini aracın hareket halindeyken de hızlı okunacağı şekilde planlarız.'],
      ['Baskı ve uygulama kalitesi', 'Dış mekâna uygun folyo ve laminasyon seçenekleriyle renk dayanımını koruruz. Yüzey hazırlığı, kontrollü germe ve kenar bitişleri uygulamanın temiz ve uzun ömürlü olmasını sağlar.'],
      ['Filo genelinde tutarlı görünüm', 'Birden fazla araçta ölçü, renk ve yerleşim standardını koruyan üretim dosyaları hazırlarız. Böylece filonun her aracı aynı kurumsal kimliği taşır.']
    ], cta: 'Markanız yolda da net görünsün.', ctaText: 'Araç modeli ve uygulama kapsamını paylaşın.'
  },
  {
    file: 'aydin-cephe-giydirme.html', title: 'Aydın Cephe Giydirme', eyebrow: 'Cephe giydirme',
    hero: 'Mimarinizi güçlü bir<br><span class="orange">marka yüzüne dönüştürün.</span>',
    introTitle: 'Cephe, markanızın şehirle kurduğu ilk temas.',
    intro: 'Kompozit cephe kaplama, kutu harf ve aydınlatmayı tek bir bütün olarak ele alıyoruz. Mevcut mimariyi örtmek yerine, yapının oranlarını güçlendiren uygulanabilir çözümler geliştiriyoruz.',
    image: 'assets/images/service-cephe-giydirme-v2.webp', alt: 'Kompozit panelli çağdaş mağaza cephe giydirme uygulaması',
    scope: ['Kompozit kaplama','Alüminyum cephe','Kutu harf entegrasyonu','Cephe aydınlatma','Keşif ve ölçü','Montaj'],
    sections: [
      ['Keşifle başlayan doğru oran', 'Cephe ölçüsü, taşıyıcı yüzey, görüş aksları ve çevresel ışık yerinde incelenir. Tasarım; giriş, vitrin ve tabela alanlarını aynı ritimde buluşturur.'],
      ['Detay çözümü ve dayanıklılık', 'Alt konstrüksiyon, panel derzleri, köşe dönüşleri ve su tahliyesi uygulamadan önce çözülür. Dış mekân koşullarına uygun malzeme ve bağlantı elemanları seçilir.'],
      ['Tek merkezden uygulama', 'Tasarım, imalat, baskı, tabela ve montaj süreçlerini kendi ekibimizle koordine ederiz. Bu yaklaşım sahadaki uyumsuzlukları azaltır ve bitiş kalitesini yükseltir.']
    ], cta: 'Cepheniz markanızı doğru anlatsın.', ctaText: 'Bina fotoğrafını ve yaklaşık ölçüyü gönderin.'
  },
  {
    file: 'aydin-dijital-baski.html', title: 'Aydın Dijital Baskı ve UV Baskı', eyebrow: 'Dijital & UV baskı',
    hero: 'Rengi, detayı ve mesajı<br><span class="orange">yüzeye taşıyoruz.</span>',
    introTitle: 'Her yüzey için doğru baskı tekniği.',
    intro: 'Dijital baskı projelerinde yalnızca çözünürlüğe değil; malzemenin kullanım yerine, renk beklentisine, izleme mesafesine ve dayanım ihtiyacına odaklanıyoruz.',
    image: 'assets/images/service-dijital-baski-v2.webp', alt: 'Canlı turuncu grafikler üreten profesyonel geniş format dijital baskı makinesi',
    scope: ['UV baskı','Eco-solvent baskı','Folyo baskı','Branda ve afiş','Levha baskı','İç mekân grafikleri'],
    sections: [
      ['Dosyadan üretime renk kontrolü', 'Görseller baskı ölçüsüne ve izleme mesafesine göre hazırlanır. Renk, taşma payı ve kesim çizgileri üretim öncesinde kontrol edilerek sürprizler azaltılır.'],
      ['Doğru malzeme, doğru teknoloji', 'Folyo, vinil, branda, pleksi, dekota ve benzeri yüzeylerde kullanım amacına göre UV ya da eco-solvent baskı tercih edilir. Gerekli projelerde laminasyonla ek koruma sağlanır.'],
      ['Kesim ve uygulamayla tamamlanan süreç', 'Baskı sonrası plotter kesim, ebatlama ve yüzey uygulamasını aynı akışta yönetiriz. Böylece grafik, malzeme ve uygulama ölçüsü birbiriyle tam uyumlu olur.']
    ], cta: 'Görselinizi doğru yüzeyle buluşturalım.', ctaText: 'Ölçü, adet ve kullanım alanını paylaşın.'
  },
  {
    file: 'aydin-cnc-kesim.html', title: 'Aydın CNC Kesim', eyebrow: 'CNC router',
    hero: 'Fikrinizi hassas ve<br><span class="orange">tekrarlanabilir üretime dönüştürün.</span>',
    introTitle: 'Levha malzemelerde kontrollü, temiz ve hassas kesim.',
    intro: 'CNC router ile tabela parçaları, dekoratif paneller, harfler ve özel üretim elemanlarını dijital çizime bağlı yüksek hassasiyetle işliyoruz.',
    image: 'assets/images/service-cnc-kesim-v2.webp', alt: 'Siyah kompozit levha üzerinde hassas CNC router kesimi',
    scope: ['Kompozit kesim','Pleksi kesim','Ahşap ve MDF','Dekota işleme','Kanal açma','Özel formlar'],
    sections: [
      ['Üretime uygun çizim hazırlığı', 'Dosyalar takım çapı, malzeme kalınlığı ve montaj detayları gözetilerek kontrol edilir. Gerektiğinde çizimler üretilebilir geometriye uyarlanır.'],
      ['Malzemeye göre kesim parametresi', 'Devir, ilerleme, paso derinliği ve takım seçimi malzemenin yapısına göre belirlenir. Temiz kenar ve ölçü tutarlılığı için deneme ve sabitleme kontrolleri yapılır.'],
      ['Tek parçadan seri üretime', 'Prototip, özel ölçü ve tekrarlı parçalarda aynı dosya üzerinden tutarlı sonuç alınır. Kesilen parçalar gerekirse ebatlama, yüzey işlemi ve montaj hazırlığıyla teslim edilir.']
    ], cta: 'Çiziminizi üretilebilir hale getirelim.', ctaText: 'Dosya, malzeme ve ölçü bilgisini gönderin.'
  },
  {
    file: 'aydin-lazer-kesim.html', title: 'Aydın Lazer Kesim', eyebrow: 'Lazer kesim',
    hero: 'İnce detaylarda<br><span class="orange">keskin ve temiz sonuç.</span>',
    introTitle: 'Detay kaybı olmadan yüksek hassasiyetli kesim.',
    intro: 'Lazer kesim; küçük detaylar, hassas konturlar ve tekrarlanabilir parçalar için güçlü bir üretim yöntemidir. Projeyi malzeme, kalınlık ve son kullanım biçimine göre planlıyoruz.',
    image: 'assets/images/service-lazer-kesim-v2.webp', alt: 'Turuncu kıvılcımlarla metal üzerinde hassas lazer kesim işlemi',
    scope: ['Metal harf parçaları','İnce kontur kesim','Dekoratif paneller','Şablon üretimi','Seri parça','Özel tasarım'],
    sections: [
      ['Detaya göre optimize edilen dosya', 'Kesim yolları, köşeler, boşluklar ve minimum parça ölçüleri üretim öncesinde değerlendirilir. Böylece tasarımdaki karakter korunurken fire azaltılır.'],
      ['Temiz kenar ve tekrar hassasiyeti', 'Uygun güç ve hız ayarlarıyla malzemeye kontrollü enerji uygulanır. Aynı parçanın çoklu üretiminde ölçü ve form tutarlılığı korunur.'],
      ['Tabela ve özel üretime entegre', 'Lazer kesilen parçaları kutu harf, yönlendirme, dekoratif panel ve özel proje bileşenlerinde kullanır; gerekirse diğer üretim adımlarıyla birleştiririz.']
    ], cta: 'Detayları hassasiyetle üretelim.', ctaText: 'Çiziminizi ve malzeme tercihinizi paylaşın.'
  },
  {
    file: 'aydin-totem-tabela.html', title: 'Aydın Totem Tabela', eyebrow: 'Totem tabela',
    hero: 'Uzak mesafeden güçlü bir<br><span class="orange">karşılama noktası.</span>',
    introTitle: 'Yol üzerinde görünür, mekâna ait bir işaret.',
    intro: 'Totem tabelayı yalnızca büyük bir levha olarak değil; taşıyıcı sistem, marka hiyerarşisi, gece görünürlüğü ve çevre ölçeğiyle birlikte tasarlıyoruz.',
    image: 'assets/images/service-totem-v2.webp', alt: 'Gece aydınlatmalı modern yönlendirme totem tabela',
    scope: ['Işıklı totem','Yönlendirme totemi','Akaryakıt tipi totem','Fiyat panosu','Çoklu marka paneli','Temel ve montaj'],
    sections: [
      ['Konum ve görüş açısı', 'Araç ve yaya yaklaşım yönleri, hız, görüş mesafesi ve çevredeki görsel yoğunluk incelenir. Bilgi hiyerarşisi uzaktan hızlı algılanacak biçimde kurulur.'],
      ['Taşıyıcı sistem ve dış mekân dayanımı', 'Rüzgâr yükü, temel bağlantısı, gövde konstrüksiyonu ve bakım erişimi proje aşamasında çözülür. Malzemeler dış ortam ve uzun süreli kullanım koşullarına göre seçilir.'],
      ['Gündüz ve gece aynı marka etkisi', 'Aydınlatma, yüzey rengi ve harf kontrastı birlikte planlanır. Elektrik ve ışık bileşenleri homojen görünüm ve servis kolaylığı gözetilerek yerleştirilir.']
    ], cta: 'Markanız uzaktan da fark edilsin.', ctaText: 'Konum fotoğrafını ve hedef ölçüyü paylaşın.'
  },
  {
    file: 'magaza-vitrin-giydirme.html', title: 'Mağaza ve Vitrin Giydirme', eyebrow: 'Mağaza & vitrin',
    hero: 'Vitrininizi markanızın<br><span class="orange">aktif yüzüne dönüştürün.</span>',
    introTitle: 'Mekâna girilmeden başlayan marka deneyimi.',
    intro: 'Vitrin ve mağaza uygulamalarında grafik, mahremiyet, kampanya mesajı ve iç mekân ışığını birlikte değerlendiriyoruz. Tasarımı cam ve yüzey ölçülerine göre uygulamaya hazırlarız.',
    image: 'assets/images/service-vitrin-v2.webp', alt: 'Turuncu grafiklerle modern mağaza vitrin giydirme uygulaması',
    scope: ['Vitrin folyosu','Kumlama folyo','One way vision','İç mekân grafik','Kampanya uygulaması','Söküm ve yenileme'],
    sections: [
      ['Cam yüzeye göre tasarım', 'Kayıtlar, kapı bölümleri, görüş çizgisi ve içeriden dışarı görüş ihtiyacı ölçülür. Grafik yerleşimi vitrin ürünleriyle rekabet etmeyecek biçimde dengelenir.'],
      ['Doğru folyo ve baskı çözümü', 'Şeffaf, opak, kumlama, kesim folyo veya one way vision seçenekleri kullanım amacına göre belirlenir. Geçici kampanyalarda temiz sökülebilir çözümler tercih edilir.'],
      ['Temiz uygulama ve yenileme', 'Yüzey hazırlığı, birleşim çizgileri ve kenar bitişleri dikkatle uygulanır. Eski uygulamaların sökümü ve yeni kampanya geçişleri planlı biçimde yönetilir.']
    ], cta: 'Vitrininiz daha güçlü konuşsun.', ctaText: 'Cam ölçülerini ve uygulama görselini gönderin.'
  }
];

const styles = ['css/style.css','css/responsive.css','css/animations.css','css/footer.css','css/brand.css','css/ui-polish.css','css/layout-refinements.css']
  .map(href => `<link rel="stylesheet" href="${href}">`).join('');

for (const page of pages) {
  const scope = page.scope.map(item => `<span>${item}</span>`).join('');
  const sections = page.sections.map(([title, text]) => `<section class="service-copy-block"><h2>${title}</h2><p>${text}</p></section>`).join('');
  const description = `${page.title} hizmetinde keşif, tasarım, kendi bünyemizde üretim ve profesyonel montaj. Meray Reklam, Aydın ve tüm Türkiye.`;
  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${page.title} | Meray Reklam</title><meta name="description" content="${description}"><meta property="og:title" content="${page.title} | Meray Reklam"><meta property="og:description" content="${description}"><meta property="og:image" content="https://[SITE_URL]/${page.image}"><meta name="twitter:card" content="summary_large_image">${styles}</head><body><a class="skip" href="#main">İçeriğe geç</a>${topbar}${header}<main id="main"><section class="page-hero service-page-hero"><div class="shell"><span class="label">${page.eyebrow}</span><h1 class="display display-xl">${page.hero}</h1><p>Tasarım, üretim ve uygulama tek noktada; Aydın merkezli, Türkiye genelinde hizmet.</p></div></section><section class="section"><div class="shell content-grid service-content"><aside class="sidebar reveal"><span class="label">Kapsam</span><div class="service-scope">${scope}</div></aside><article class="prose"><header class="service-intro reveal"><h2>${page.introTitle}</h2><p class="lead">${page.intro}</p></header><figure class="service-visual reveal"><img src="${page.image}" alt="${page.alt}" width="1536" height="1024" loading="eager"><figcaption>Meray Reklam · Tasarım, üretim ve uygulama</figcaption></figure>${sections}</article></div></section><section class="section cta"><div class="shell cta-inner"><div><span class="label">Yeni proje</span><h2 class="display">${page.cta}</h2><p class="lead">${page.ctaText}</p></div><a class="btn btn-whatsapp" href="https://wa.me/905067273465?text=Merhaba%20Meray%20Reklam%2C%20${encodeURIComponent(page.title)}%20hakk%C4%B1nda%20teklif%20almak%20istiyorum." target="_blank" rel="noopener"><svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-2 1.5-.5.1-1.2.2-3.5-.7-2.9-1.2-4.8-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3.1 0-1.5.8-2.3 1.1-2.6.3-.3.7-.4 1-.4h.7c.2 0 .5-.1.8.6.3.7 1 2.4 1.1 2.6.1.2.2.4 0 .7-.1.2-.2.4-.4.6l-.6.6c-.2.2-.4.4-.2.8.2.4.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.7 1.6.3.2.6.1.8-.1.2-.3.9-1.1 1.1-1.5.2-.4.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.6.2.6.4 0 .2 0 .8-.2 1.3Z"/></svg>WhatsApp'tan Teklif Al <span class="btn-arrow" aria-hidden="true">↗</span></a></div></section></main>${footer}`;
  fs.writeFileSync(page.file, html, 'utf8');
}

console.log(`Rebuilt ${pages.length} service pages.`);
await import('./optimize-site.mjs');
