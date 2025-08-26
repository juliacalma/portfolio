/* ========= ACTIVE NAV (current page highlight) ========= */
(function () {
  const links = document.querySelectorAll('.nav-links a');
  let file = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const hrefFile = a.getAttribute('href').split('/').pop();
    if (hrefFile === file) a.classList.add('active');
  });
})();

/* ========= SMOOTH SCROLL for same-page anchors ========= */
(function () {
  const header = document.querySelector('.navbar');
  const getHeaderHeight = () => (header ? header.offsetHeight : 0);
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return; // ignore if it isn't on this page
      e.preventDefault();

      const offset = target.getBoundingClientRect().top + window.pageYOffset;
      const top = offset - getHeaderHeight() - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ========= LIGHTBOX GALLERY ========= */
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const imgEl = lb.querySelector('.lightbox-img');
  const capEl = lb.querySelector('.lightbox-caption');
  const counterEl = lb.querySelector('.lightbox-counter');
  const btnClose = lb.querySelector('.lightbox-close');
  const btnPrev = lb.querySelector('.lightbox-arrow.prev');
  const btnNext = lb.querySelector('.lightbox-arrow.next');

  const galleries = Array.from(document.querySelectorAll('.gallery'));
  const galleryMap = new Map(galleries.map(g => [g, Array.from(g.querySelectorAll('img'))]));
  const totalImgs = [...galleryMap.values()].reduce((n, arr) => n + arr.length, 0);
  if (totalImgs === 0) return;

  let activeGallery = null;
  let activeIndex = 0;
  let lastFocused = null;

  function updateSlide() {
    const imgs = galleryMap.get(activeGallery);
    const el = imgs[activeIndex];
    if (!el) return;

    const src = el.getAttribute('src');
    const alt = el.getAttribute('alt') || '';
    imgEl.src = src;
    imgEl.alt = alt;
    capEl.textContent = alt;
    counterEl.textContent = `${activeIndex + 1} / ${imgs.length}`;

    // preload neighbors
    [ (activeIndex + 1) % imgs.length, (activeIndex - 1 + imgs.length) % imgs.length ].forEach(i => {
      const pre = new Image();
      pre.src = imgs[i].getAttribute('src');
    });
  }

  function openLightbox(gallery, index) {
    activeGallery = gallery;
    activeIndex = index;
    updateSlide();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;
    btnClose.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function prev() {
    const imgs = galleryMap.get(activeGallery);
    activeIndex = (activeIndex - 1 + imgs.length) % imgs.length;
    updateSlide();
  }
  function next() {
    const imgs = galleryMap.get(activeGallery);
    activeIndex = (activeIndex + 1) % imgs.length;
    updateSlide();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  // make gallery images interactive
  galleries.forEach(g => {
    const imgs = galleryMap.get(g);
    imgs.forEach((img, idx) => {
      img.style.cursor = 'zoom-in';
      img.setAttribute('tabindex', '0');
      img.addEventListener('click', () => openLightbox(g, idx));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(g, idx); }
      });
    });
  });

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
})();
