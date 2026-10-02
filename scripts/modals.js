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