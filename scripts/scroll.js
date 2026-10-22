export const scrollReveal = () => {
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));
  document.querySelectorAll('.sidebar [data-reveal]').forEach((el) => {
    requestAnimationFrame(() => el.classList.add('in-view'));
  });

  const navLinks = document.querySelectorAll('.side-nav a');
  const sections = document.querySelectorAll('.content-section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          if (link.dataset.target === entry.target.id) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach((section) => navObserver.observe(section));
}