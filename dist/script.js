const menu=document.querySelector('.menu'),nav=document.querySelector('.navlinks');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));const box=document.querySelector('#lightbox');document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{box.querySelector('img').src=button.dataset.image;box.querySelector('img').alt=button.querySelector('img').alt;box.showModal()}));box?.querySelector('button').addEventListener('click',()=>box.close());box?.addEventListener('click',e=>{if(e.target===box)box.close()});document.querySelector('#copy')?.addEventListener('click',async()=>{const message=`Hi Nail Revolution, I’d like to enquire about ${document.querySelector('#interest').value.toLowerCase()}. Please share availability and current pricing.`;try{await navigator.clipboard.writeText(message);document.querySelector('#copy-status').textContent='Enquiry copied. Paste it into your Instagram message to the studio.'}catch{document.querySelector('#copy-status').textContent=message}});


const heroVideo = document.querySelector('#hero-video');
if (heroVideo) {
  const desktop = matchMedia('(min-width: 901px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  heroVideo.poster = desktop.matches ? 'assets/hero-desktop-poster.webp' : 'assets/hero-mobile-poster.webp';
  const hero = heroVideo.closest('.hero');
  const runway = hero.closest('.hero-runway');
  let frame = 0;
  let sourceLoaded = "";
  let geometry = {start:0, distance:1};
  function measureHero() {
    geometry.start = runway.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(hero).top) || 0);
    geometry.distance = Math.max(1, runway.offsetHeight - hero.offsetHeight);
  }

  function syncVideo() {
    frame = 0;
    if (reducedMotion.matches || !Number.isFinite(heroVideo.duration) || heroVideo.seeking) return;
    const progress = Math.min(1, Math.max(0, (scrollY - geometry.start) / geometry.distance));
    const time = Math.max(0.01, progress * Math.max(0, heroVideo.duration - 0.06));
    if (Math.abs(heroVideo.currentTime - time) > 0.06) heroVideo.currentTime = time;
  }

  function scheduleSync() {
    if (!frame) frame = requestAnimationFrame(syncVideo);
  }

  function primeVideo() {
    if (reducedMotion.matches) return;
    heroVideo.play().catch(() => {});
  }

  function loadVideo() {
    measureHero();
    heroVideo.poster = desktop.matches ? 'assets/hero-desktop-poster.webp' : 'assets/hero-mobile-poster.webp';
    if (reducedMotion.matches || navigator.connection?.saveData) return;
    const source = desktop.matches ? 'assets/hero-desktop-fast.mp4' : 'assets/hero-mobile-optimized.mp4';
    if (sourceLoaded === source) return;
    sourceLoaded = source;
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.preload = 'auto';
    heroVideo.src = source + '#t=0.01';
    heroVideo.load();
    primeVideo();
  }

  heroVideo.addEventListener('playing', () => {
    heroVideo.pause();
    scheduleSync();
  });
  for (const event of ['loadedmetadata', 'loadeddata', 'canplay', 'seeked']) {
    heroVideo.addEventListener(event, scheduleSync);
  }
  window.addEventListener('scroll', scheduleSync, { passive: true });
  window.addEventListener('resize', () => { measureHero(); scheduleSync(); });
  document.fonts.ready.then(() => { measureHero(); scheduleSync(); });
  window.addEventListener('touchstart', () => {
    if (heroVideo.readyState < 2) primeVideo();
  }, { passive: true });
  desktop.addEventListener('change', loadVideo);
  measureHero();
  const startVideo = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(loadVideo, {timeout: 800});
    else setTimeout(loadVideo, 100);
  };
  if (document.readyState === 'complete') startVideo();
  else window.addEventListener('load', startVideo, {once:true});
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});


const builder = document.querySelector('.nail-builder');
if (builder) {
  const style = {shape:'almond', colour:'burgundy', finish:'gloss'};
  const colours = {burgundy:'#7a233b',rose:'#ca8795',nude:'#bd927c',pearl:'#eee5df'};
  const label = value => value === 'square' ? 'Soft square' : value === 'french' ? 'French tip' : value[0].toUpperCase()+value.slice(1);
  builder.querySelectorAll('[data-choice] button').forEach(button => button.addEventListener('click', () => {
    const group = button.closest('[data-choice]'); style[group.dataset.choice] = button.dataset.value;
    group.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
    const preview = builder.querySelector('.builder-preview');
    preview.style.setProperty('--nail-colour', colours[style.colour]);
    preview.dataset.shape = style.shape; preview.dataset.finish = style.finish;
    builder.querySelector('#style-name').textContent = [style.colour,style.shape,style.finish].map(label).join(' · ');
    builder.querySelector('#style-description').textContent = `${label(style.colour)} ${label(style.shape).toLowerCase()} nails with ${label(style.finish).toLowerCase()} detailing. A starting point for your own signature set.`;
    builder.querySelector('#book-style').href = 'booking.html?style='+encodeURIComponent(`${label(style.colour)} ${label(style.shape).toLowerCase()} nails with ${label(style.finish).toLowerCase()} finish`);
  }));
}
// The chooser has its own booking action; keep the fixed bar out of its way.
if (builder && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    document.body.classList.toggle('builder-in-view', entries[0].isIntersecting);
  }, {rootMargin:'-80px 0px -20px 0px',threshold:0}).observe(builder);
}
