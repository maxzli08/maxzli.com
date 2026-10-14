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
  let lastFocusedTrigger = null;

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
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  document.querySelectorAll('.home-project').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.project;
      const template = document.getElementById(id);
      if (!template) return;

      drawerContent.innerHTML = '';
      drawerContent.appendChild(template.content.cloneNode(true));
      drawerContent.scrollTop = 0; // new: always open a project from the top, not wherever the last one was scrolled to
      projectDrawer.scrollTop = 0; // new
      buildToc(drawerContent, template.dataset.toc !== 'false'); // new: add the table of contents unless it's turned off
      lastFocusedTrigger = btn;
      openDrawer();
    });
  });

  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });


//gallery
//   const lightbox = document.getElementById('lightbox');
//   const lightboxImage = lightbox.querySelector('.lightbox-image');
//   const lightboxCaption = lightbox.querySelector('.lightbox-caption');
//   const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
//   let currentIndex = 0;

//   function showImage(index) {
//     currentIndex = (index + galleryItems.length) % galleryItems.length;
//     const item = galleryItems[currentIndex];
//     lightboxImage.textContent = item.querySelector('.image-frame').textContent.trim();
//     lightboxCaption.textContent = item.dataset.caption || '[ Caption ]';
//   }

//   galleryItems.forEach((item, index) => {
//     item.addEventListener('click', () => {
//       showImage(index);
//       document.body.classList.add('modal-open');
//       lightbox.showModal();
//     });
//   });

//   lightbox.querySelector('.modal-close').addEventListener('click', () => closeDialog(lightbox));
//   lightbox.querySelector('.prev').addEventListener('click', () => showImage(currentIndex - 1));
//   lightbox.querySelector('.next').addEventListener('click', () => showImage(currentIndex + 1));

//   lightbox.addEventListener('click', (e) => {
//     if (e.target === lightbox) closeDialog(lightbox);
//   });

//   lightbox.addEventListener('close', () => {
//     document.body.classList.remove('modal-open');
//   });

//   lightbox.addEventListener('keydown', (e) => {
//     if (e.key === 'ArrowRight') showImage(currentIndex + 1);
//     if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
//   });
}

// new: wires up click-to-expand behaviour for each work-experience entry.
// delete this whole exported function to revert.
export const timelineListener = () => {
  document.querySelectorAll('.timeline-toggle').forEach((btn) => {
    const entry = btn.closest('.timeline-entry'); // new: grab these once up front instead of re-querying on every click
    const details = entry.querySelector('.timeline-details'); // new

    btn.addEventListener('click', () => {
      const isExpanding = !entry.classList.contains('expanded'); // changed: compute this before toggling, since we need it to decide which direction to animate

      if (isExpanding) {
        details.style.maxHeight = details.scrollHeight + 'px'; // new: measure the content's real height and animate to that exact value instead of a guessed cap
      } else {
        details.style.maxHeight = '0px'; // new: animate back down to 0 — the browser transitions smoothly since it's going from one explicit pixel value to another
      }

      entry.classList.toggle('expanded', isExpanding); // changed: pass the boolean explicitly instead of relying on toggle()'s return value, since we already computed isExpanding above
      btn.setAttribute('aria-expanded', isExpanding ? 'true' : 'false');
    });
  });
}