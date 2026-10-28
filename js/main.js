const header=document.querySelector('.site-header');
const menu=document.querySelector('.nav-links');
const toggle=document.querySelector('.menu-toggle');
const setHeader=()=>header?.classList.toggle('scrolled',scrollY>40);
addEventListener('scroll',setHeader,{passive:true});setHeader();
let menuScrollY=0;
const setMenuState=(open,{restoreScroll=true}={})=>{
  const wasOpen=menu?.classList.contains('open');
  if(open&&!wasOpen){
    menuScrollY=window.scrollY;
    document.body.style.top=`-${menuScrollY}px`;
  }
  menu?.classList.toggle('open',open);
  document.documentElement.classList.toggle('menu-open',open);
  document.body.classList.toggle('menu-open',open);
  toggle?.classList.toggle('is-open',open);
  toggle?.setAttribute('aria-expanded',String(open));
  toggle?.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç');
  if(!open&&wasOpen){
    document.body.style.removeProperty('top');
    if(restoreScroll)window.scrollTo(0,menuScrollY);
  }
};
toggle?.addEventListener('click',()=>setMenuState(!menu?.classList.contains('open')));
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenuState(false)));
addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.classList.contains('open'))setMenuState(false)});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters=document.querySelectorAll('[data-count]');
if(!reducedMotion&&counters.length){
  const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target;
    const target=Number(el.dataset.count)||0;
    const start=performance.now();
    const duration=1200;
    const tick=now=>{
      const progress=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      el.textContent=Math.round(target*eased);
      if(progress<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  }),{threshold:.7});
  counters.forEach(el=>counterObserver.observe(el));
}
document.querySelectorAll('form[data-whatsapp-form]').forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(form);
  const value=name=>String(data.get(name)||'').trim();

  const lines=[
    'Merhaba Meray Reklam, web siteniz üzerinden teklif talebi gönderiyorum.',
    '',
    `Ad Soyad: ${value('name')}`,
    `Telefon: ${value('phone')}`,
    `İlgilenilen Hizmet: ${value('service')}`,
    `Ölçü: ${value('measure')||'Belirtilmedi'}`,
    `Mesaj: ${value('message')}`
  ];

  const url=`https://wa.me/905067273465?text=${encodeURIComponent(lines.join('\n'))}`;
  const popup=window.open(url,'_blank');
  if(popup)popup.opener=null;else window.location.href=url;
}));
document.querySelectorAll('form[data-email-form]').forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const value=name=>String(data.get(name)||'').trim();
  const subject=`Kurumsal Proje Teklif Talebi - ${value('company')}`;
  const lines=[
    'Merhaba Meray Reklam, web siteniz üzerinden kurumsal proje teklif talebi gönderiyorum.',
    '',
    `Firma / Kurum: ${value('company')}`,
    `Yetkili Kişi: ${value('contactName')}`,
    `E-posta: ${value('corporateEmail')}`,
    `Telefon: ${value('corporatePhone')}`,
    `Proje Türü: ${value('projectType')}`,
    `Uygulama Konumu: ${value('projectLocation')}`,
    `Proje Ölçeği: ${value('projectScale')}`,
    '',
    'Proje Özeti:',
    value('projectDetails'),
    '',
    'İlgili proje dosyaları bu e-postaya eklenecektir.'
  ];
  const body=lines.join('\n');
  const recipient='merayreklam@hotmail.com';
  const options=form.querySelector('[data-email-options]');
  const gmail=form.querySelector('[data-email-gmail]');
  const outlook=form.querySelector('[data-email-outlook]');
  const fallback=form.querySelector('[data-email-default]');
  gmail.href=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  outlook.href=`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(recipient)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  fallback.href=`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  options.hidden=false;
  options.classList.remove('is-ready');
  requestAnimationFrame(()=>options.classList.add('is-ready'));
  gmail.focus({preventScroll:true});
}));
