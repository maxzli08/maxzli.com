// Click-to-enlarge for images. Any <img class="zoomable"> opens in a full-screen
// viewer (the <dialog id="lightbox"> in index.html). Uses event delegation, so it
// also works for images inside the project drawer, which is rebuilt on every open.
// Prev/next arrows (and the arrow keys) step through the images in the same
// project drawer or the same job entry.
export const initLightbox = () => {
  const dlg = document.getElementById('lightbox');
  if (!dlg) return;
  const img = dlg.querySelector('.lightbox-img');
  const caption = dlg.querySelector('.lightbox-caption');
  const prevBtn = dlg.querySelector('.prev');
  const nextBtn = dlg.querySelector('.next');
  const closeBtn = dlg.querySelector('.lightbox-close');

  let group = [];
  let index = 0;

  const isLoaded = (el) => el.complete && el.naturalWidth > 0; // skips missing/broken images

  const show = (i) => {
    index = (i + group.length) % group.length;
    const source = group[index];
    img.src = source.currentSrc || source.src;
    img.alt = source.alt || '';
    const text = source.closest('figure')?.querySelector('figcaption')?.textContent.trim() || '';
    caption.textContent = text;
    caption.hidden = !text;
    prevBtn.hidden = nextBtn.hidden = group.length < 2;
  };

  const open = (el) => {
    const scope = el.closest('.modal-content, .timeline-details') || document;
    group = [...scope.querySelectorAll('img.zoomable')].filter(isLoaded);
    const i = group.indexOf(el);
    if (i < 0) return;
    show(i);
    document.body.classList.add('lightbox-open');
    dlg.showModal();
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest?.('img.zoomable');
    if (el && isLoaded(el)) open(el);
  });

  document.addEventListener('keydown', (e) => {
    if (dlg.open) {
      if (e.key === 'ArrowRight' && group.length > 1) show(index + 1);
      if (e.key === 'ArrowLeft' && group.length > 1) show(index - 1);
      return;
    }
    // keyboard users: Enter or Space on a focused image opens it
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('img.zoomable') && isLoaded(e.target)) {
      e.preventDefault();
      open(e.target);
    }
  });

  // an image that fails to load stops looking clickable
  document.addEventListener('error', (e) => {
    const el = e.target;
    if (el.matches?.('img.zoomable')) {
      el.classList.remove('zoomable');
      el.removeAttribute('tabindex');
      el.removeAttribute('role');
    }
  }, true);

  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  closeBtn.addEventListener('click', () => dlg.close());

  // clicking the dark area around the image closes it
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.classList.contains('lightbox-stage')) dlg.close();
  });

  dlg.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    img.removeAttribute('src');
  });
};
