const menu=document.querySelector('.menu'),nav=document.querySelector('.navlinks');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));const box=document.querySelector('#lightbox');document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{box.querySelector('img').src=button.dataset.image;box.querySelector('img').alt=button.querySelector('img').alt;box.showModal()}));box?.querySelector('button').addEventListener('click',()=>box.close());box?.addEventListener('click',e=>{if(e.target===box)box.close()});document.querySelector('#copy')?.addEventListener('click',async()=>{const message=`Hi Nail Revolution, I’d like to enquire about ${document.querySelector('#interest').value.toLowerCase()}. Please share availability and current pricing.`;try{await navigator.clipboard.writeText(message);document.querySelector('#copy-status').textContent='Enquiry copied. Paste it into your Instagram message to the studio.'}catch{document.querySelector('#copy-status').textContent=message}});


const heroVideo = document.querySelector('#hero-video');
if (heroVideo) {
  const desktop = matchMedia('(min-width: 901px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = heroVideo.closest('.hero');
  const runway = hero.closest('.hero-runway');
  let frame = 0;
  let localUrl;

  function syncVideo() {
    frame = 0;
    if (reducedMotion.matches || !Number.isFinite(heroVideo.duration) || heroVideo.seeking) return;
    const distance = runway.offsetHeight - hero.offsetHeight;
    const top = parseFloat(getComputedStyle(hero).top) || 0;
    const progress = Math.min(1, Math.max(0, (top - runway.getBoundingClientRect().top) / Math.max(1, distance)));
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

  async function loadVideo() {
    const source = desktop.matches ? 'assets/hero-desktop-luxury.mp4' : 'assets/hero-mobile-optimized.mp4';
    heroVideo.poster = desktop.matches ? 'assets/hero-desktop-poster.webp' : 'assets/hero-mobile-poster.webp';
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.src = source + '#t=0.01';
    heroVideo.load();
    if (['127.0.0.1', 'localhost'].includes(location.hostname)) {
      try {
        const response = await fetch(source);
        if (!response.ok) return;
        const blob = await response.blob();
        if (heroVideo.getAttribute('src') !== source + '#t=0.01') return;
        if (localUrl) URL.revokeObjectURL(localUrl);
        localUrl = URL.createObjectURL(blob);
        heroVideo.src = localUrl;
      } catch {}
    }
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
  window.addEventListener('resize', scheduleSync);
  window.addEventListener('touchstart', () => {
    if (heroVideo.readyState < 2) primeVideo();
  }, { passive: true });
  desktop.addEventListener('change', loadVideo);
  loadVideo();
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});

const fontPreview = new URLSearchParams(location.search).get('font');
const headingFonts = {
  editorial: 'Baskervville',
  modern: 'DM Serif Text',
  classic: 'Cormorant Garamond'
};
if (headingFonts[fontPreview]) {
  document.documentElement.style.setProperty('--heading-font', "'" + headingFonts[fontPreview] + "', Georgia, serif");
}
