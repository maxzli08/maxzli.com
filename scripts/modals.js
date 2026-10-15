import { initCollapsibleLists } from './lists.js'; // new: collapsible lists inside project modals

// new: table of contents for project modals ---------------------------------
const TOC_MIN_HEADINGS = 3; // new: modals with fewer headed sections than this skip the TOC

// new: builds a small "Jump to" row from the modal's section headings and
// inserts it under the project links. Does nothing when the TOC is turned off.
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
  const list = document.createElement('div'); // changed: links now live in their own column so wrapped lines indent under the first link
  list.className = 'modal-toc-links';
  sections.forEach((section, i) => {
    const item = document.createElement('span'); // new: link + its trailing separator travel together
    item.className = 'modal-toc-item';

    const link = document.createElement('a');
    link.href = '#';
    link.textContent = section.querySelector('h3').textContent;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
    item.appendChild(link);

    if (i < sections.length - 1) { // new: no separator after the last entry
      const sep = document.createElement('span');
      sep.className = 'modal-toc-sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '/';
      item.appendChild(sep);
    }
    list.appendChild(item);
  });
  nav.appendChild(list); // changed: append the container instead of each link

  const anchor = container.querySelector('.project-links') || container.querySelector('.project-meta');
  if (anchor) anchor.after(nav); else container.prepend(nav);
};
export const modalListener = () => {
  const projectDrawer = document.getElementById('project-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerContent = projectDrawer.querySelector('.modal-content');
  const drawerCloseBtn = projectDrawer.querySelector('.modal-close');
  const cards = [...document.querySelectorAll('.home-project')]; // new
  let lastFocusedTrigger = null;
  let openSlug = null; // new: slug of the project currently showing in the drawer
  let openedByPush = false; // new: true when opening added a history entry, so closing can step back out of it

  // new: reads the project slug out of the URL, e.g. "#vex-robotics" -> "vex-robotics"
  const hashSlug = () => {
    try { return decodeURIComponent(location.hash.slice(1)).toLowerCase(); } catch { return ''; }
  };
  const isOpen = () => projectDrawer.classList.contains('open'); // new
  const stripHash = () => history.replaceState(null, '', location.pathname + location.search); // new: clears "#..." without scrolling or adding a history entry

  function openDrawer() {
    document.body.classList.add('modal-open');
    projectDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    projectDrawer.setAttribute('aria-hidden', 'false');
    drawerCloseBtn.focus();
  }

  function closeDrawer() {
    projectDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    projectDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    openSlug = null; // new
    openedByPush = false; // new
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  // new: fills the drawer with a project and opens it. Doesn't touch the URL.
  function showProject(card) {
    const template = document.getElementById(card.dataset.project);
    if (!template) return false;

    drawerContent.innerHTML = '';
    drawerContent.appendChild(template.content.cloneNode(true));
    drawerContent.scrollTop = 0; // always open a project from the top, not wherever the last one was scrolled to
    projectDrawer.scrollTop = 0;
    buildToc(drawerContent, template.dataset.toc !== 'false'); // add the table of contents unless it's turned off
    initCollapsibleLists(drawerContent); // new: wire up "Show more" buttons in the freshly cloned content

    lastFocusedTrigger = card;
    openSlug = card.dataset.slug;
    openDrawer();
    return true;
  }

  // new: closing from the UI (X, Escape, backdrop). If opening pushed a history
  // entry, step back out of it (popstate then closes the drawer); otherwise
  // just clear the hash and close.
  function requestClose() {
    if (!isOpen()) return;
    if (openedByPush) { history.back(); return; }
    stripHash();
    closeDrawer();
  }

  // new: keeps the drawer in sync with the URL — deep links on page load,
  // Back/Forward buttons, and manually edited hashes.
  function syncFromHash() {
    const card = cards.find((c) => c.dataset.slug === hashSlug());
    if (card) {
      if (!isOpen() || openSlug !== card.dataset.slug) showProject(card);
    } else if (isOpen()) {
      closeDrawer();
    }
  }

  cards.forEach((card) => { // changed: clicking a card now also puts #slug in the URL
    card.addEventListener('click', () => {
      if (!showProject(card)) return;
      history.pushState(null, '', '#' + card.dataset.slug); // new: so Back closes the drawer and the URL is copyable
      openedByPush = true; // new
    });
  });

  drawerCloseBtn.addEventListener('click', requestClose); // changed: was closeDrawer
  drawerBackdrop.addEventListener('click', requestClose); // changed: was closeDrawer

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen() && !document.getElementById('lightbox')?.open) { // changed: Escape inside the image viewer only closes the viewer, not the drawer behind it
      requestClose(); // changed: was closeDrawer
    }
  });

  window.addEventListener('popstate', syncFromHash); // new
  window.addEventListener('hashchange', syncFromHash); // new
  syncFromHash(); // new: if the page was opened with a #slug (e.g. from your resume), open that project now
}

// new: wires up click-to-expand behaviour for each work-experience entry.
// delete this whole exported function to revert.
export const timelineListener = () => {
  document.querySelectorAll('.timeline-toggle').forEach((btn) => {
    const entry = btn.closest('.timeline-entry'); // new: grab these once up front instead of re-querying on every click
    const details = entry.querySelector('.timeline-details'); // new

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