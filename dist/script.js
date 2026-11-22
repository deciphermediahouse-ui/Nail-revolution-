const menu=document.querySelector('.menu'),nav=document.querySelector('.navlinks');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));const box=document.querySelector('#lightbox');document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{box.querySelector('img').src=button.dataset.image;box.querySelector('img').alt=button.querySelector('img').alt;box.showModal()}));box?.querySelector('button').addEventListener('click',()=>box.close());box?.addEventListener('click',e=>{if(e.target===box)box.close()});document.querySelector('#copy')?.addEventListener('click',async()=>{const message=`Hi Nail Revolution, I’d like to enquire about ${document.querySelector('#interest').value.toLowerCase()}. Please share availability and current pricing.`;try{await navigator.clipboard.writeText(message);document.querySelector('#copy-status').textContent='Enquiry copied. Paste it into your Instagram message to the studio.'}catch{document.querySelector('#copy-status').textContent=message}});

const heroVideo = document.querySelector('#hero-video');
if (heroVideo) {
  const handVideo = document.querySelector('#hero-hand');
  const desktop = window.matchMedia('(min-width: 901px)');
  const desktopVideoSource = 'assets/hero-desktop-luxury.mp4';
  const mobileVideoSource = 'assets/hero-mobile-luxury.mp4';
  heroVideo.src = desktop.matches ? desktopVideoSource : mobileVideoSource;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = heroVideo.closest('.hero');
  const runway = hero.closest('.hero-runway');
  let frame = 0;

  function syncHeroVideo() {
    frame = 0;

    const distance = runway.offsetHeight - hero.offsetHeight;
    const pinTop = parseFloat(getComputedStyle(hero).top) || 0;
    const traveled = pinTop - runway.getBoundingClientRect().top;
    const progress = reducedMotion.matches ? 0 : Math.min(1, Math.max(0, traveled / Math.max(1, distance)));
    const video = heroVideo;
    if (!Number.isFinite(video.duration) || video.seeking) return;
    const time = progress * Math.max(0, video.duration - 0.04);

    if (Math.abs(video.currentTime - time) >= 0.02) {
      video.currentTime = time;
      return;
    }

  }

  function scheduleHeroSync() {
    if (!frame) frame = requestAnimationFrame(syncHeroVideo);
  }

  for (const video of [heroVideo, handVideo]) {
    for (const event of ['loadeddata', 'seeked']) video.addEventListener(event, scheduleHeroSync);
  }
  window.addEventListener('scroll', scheduleHeroSync, { passive: true });
  desktop.addEventListener('change', () => {
    hero.classList.remove('show-hand');
    heroVideo.src = desktop.matches ? desktopVideoSource : mobileVideoSource;
    prepareLocalVideo(heroVideo);
    scheduleHeroSync();
  });
  window.addEventListener('resize', scheduleHeroSync);
  reducedMotion.addEventListener('change', scheduleHeroSync);
  scheduleHeroSync();
}

function prepareLocalVideo(videoElement) {
  if (!['127.0.0.1', 'localhost'].includes(location.hostname)) return;
  const source = videoElement.src;
  fetch(source)
    .then(response => {
      if (!response.ok) throw new Error('Video unavailable');
      return response.blob();
    })
    .then(video => {
      if (videoElement.src === source) videoElement.src = URL.createObjectURL(video);
    })
    .catch(() => {});
}

if (heroVideo) {
  prepareLocalVideo(heroVideo);
  prepareLocalVideo(document.querySelector('#hero-hand'));
}
