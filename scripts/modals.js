export const modalListener = () => {
  const projectModal = document.getElementById('project-modal');
  const modalContent = projectModal.querySelector('.modal-content');

  document.querySelectorAll('.home-project').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.project;
      const template = document.getElementById(id);
      if (!template) return;

      modalContent.innerHTML = '';
      modalContent.appendChild(template.content.cloneNode(true));

      document.body.classList.add('modal-open');
      projectModal.showModal();
    });
  });

  function closeDialog(dialog) {
    dialog.close();
    document.body.classList.remove('modal-open');
  }

  projectModal.querySelector('.modal-close').addEventListener('click', () => closeDialog(projectModal));

  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeDialog(projectModal);
  });

  projectModal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });


//gallery
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImage.textContent = item.querySelector('.image-frame').textContent.trim();
    lightboxCaption.textContent = item.dataset.caption || '[ Caption ]';
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showImage(index);
      document.body.classList.add('modal-open');
      lightbox.showModal();
    });
  });

  lightbox.querySelector('.modal-close').addEventListener('click', () => closeDialog(lightbox));
  lightbox.querySelector('.prev').addEventListener('click', () => showImage(currentIndex - 1));
  lightbox.querySelector('.next').addEventListener('click', () => showImage(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeDialog(lightbox);
  });

  lightbox.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });

  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });
}