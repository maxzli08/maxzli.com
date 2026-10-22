import { initCollapsibleLists } from './lists.js';

const TOC_MIN_HEADINGS = 3; 

const buildToc = (container, enabled) => {
  if (!enabled) return;
  const sections = [...container.querySelectorAll('section')].filter((s) => s.querySelector('h3'));
  if (sections.length < TOC_MIN_HEADINGS) return;

  const nav = document.createElement('nav');
  nav.className = 'modal-toc';
  nav.setAttribute('aria-label', 'Sections in this project');

  const label = document.createElement('span');
  label.className = 'modal-toc-label';
  label.textContent = 'Jump to';
  nav.appendChild(label);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const list = document.createElement('div'); 
  list.className = 'modal-toc-links';
  sections.forEach((section, i) => {
    const item = document.createElement('span'); 
    item.className = 'modal-toc-item';

    const link = document.createElement('a');
    link.href = '#';
    link.textContent = section.querySelector('h3').textContent;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
    item.appendChild(link);

    if (i < sections.length - 1) {
      const sep = document.createElement('span');
      sep.className = 'modal-toc-sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '/';
      item.appendChild(sep);
    }
    list.appendChild(item);
  });
  nav.appendChild(list);

  const anchor = container.querySelector('.project-links') || container.querySelector('.project-meta');
  if (anchor) anchor.after(nav); else container.prepend(nav);
};
export const modalListener = () => {
  const projectDrawer = document.getElementById('project-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerContent = projectDrawer.querySelector('.modal-content');
  const drawerCloseBtn = projectDrawer.querySelector('.modal-close');
  const cards = [...document.querySelectorAll('.home-project')]; 
  let lastFocusedTrigger = null;
  let openSlug = null;
  let openedByPush = false;
  drawerContent.querySelectorAll('iframe[src*="youtube"]').forEach((f) => f.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }), 'https://www.youtube-nocookie.com')); // new: pause YouTube embeds when the drawer closes

  const hashSlug = () => {
    try { return decodeURIComponent(location.hash.slice(1)).toLowerCase(); } catch { return ''; }
  };
  const isOpen = () => projectDrawer.classList.contains('open');
  const stripHash = () => history.replaceState(null, '', location.pathname + location.search);

  const openDrawer = () => {
    document.body.classList.add('modal-open');
    projectDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    projectDrawer.setAttribute('aria-hidden', 'false');
    drawerCloseBtn.focus();
  }

  const closeDrawer = () => {
    projectDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    projectDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    openSlug = null;
    openedByPush = false;
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  function showProject(card) {
    const template = document.getElementById(card.dataset.project);
    if (!template) return false;

    drawerContent.innerHTML = '';
    drawerContent.appendChild(template.content.cloneNode(true));
    drawerContent.scrollTop = 0;
    projectDrawer.scrollTop = 0;
    buildToc(drawerContent, template.dataset.toc !== 'false'); 
    initCollapsibleLists(drawerContent); 

    lastFocusedTrigger = card;
    openSlug = card.dataset.slug;
    openDrawer();
    return true;
  }

  function requestClose() {
    if (!isOpen()) return;
    if (openedByPush) { history.back(); return; }
    stripHash();
    closeDrawer();
  }

  function syncFromHash() {
    const card = cards.find((c) => c.dataset.slug === hashSlug());
    if (card) {
      if (!isOpen() || openSlug !== card.dataset.slug) showProject(card);
    } else if (isOpen()) {
      closeDrawer();
    }
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!showProject(card)) return;
      history.pushState(null, '', '#' + card.dataset.slug); 
      openedByPush = true;
    });
  });

  drawerCloseBtn.addEventListener('click', requestClose); 
  drawerBackdrop.addEventListener('click', requestClose); 

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen() && !document.getElementById('lightbox')?.open) {
      requestClose();
    }
  });

  window.addEventListener('popstate', syncFromHash); 
  window.addEventListener('hashchange', syncFromHash); 
  syncFromHash(); 
}
export const timelineListener = () => {
  document.querySelectorAll('.timeline-toggle').forEach((btn) => {
    const entry = btn.closest('.timeline-entry'); 
    const details = entry.querySelector('.timeline-details');

    // btn.addEventListener('click', () => {
    //   const isExpanding = !entry.classList.contains('expanded'); // changed: compute this before toggling, since we need it to decide which direction to animate

    //   if (isExpanding) {
    //     details.style.maxHeight = details.scrollHeight + 'px'; // new: measure the content's real height and animate to that exact value instead of a guessed cap
    //   } else {
    //     details.style.maxHeight = '0px'; // new: animate back down to 0 — the browser transitions smoothly since it's going from one explicit pixel value to another
    //   }

    //   entry.classList.toggle('expanded', isExpanding); // changed: pass the boolean explicitly instead of relying on toggle()'s return value, since we already computed isExpanding above
    //   btn.setAttribute('aria-expanded', isExpanding ? 'true' : 'false');
    // });
  });
}