document.addEventListener('DOMContentLoaded', () => {
  // Mark the current page's nav link for styling + a11y.
  const here = document.body.dataset.page;
  document.querySelectorAll('.site-nav a').forEach((link) => {
    if (link.dataset.page === here) {
      link.setAttribute('aria-current', 'page');
    }
  });
});