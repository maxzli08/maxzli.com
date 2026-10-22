export const initCollapsibleLists = (root = document) => {
  root.querySelectorAll('.collapsible-list').forEach((wrap) => {
    if (wrap.dataset.ready) return;
    wrap.dataset.ready = 'true';

    const btn = wrap.querySelector('.list-toggle');
    const more = wrap.querySelector('.list-more');
    const label = btn.querySelector('.list-toggle-label');
    const count = btn.dataset.count;

    const setState = (expanded) => {
      wrap.classList.toggle('expanded', expanded);
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      label.textContent = expanded ? 'Show less' : `Show ${count} more`;
    };

    btn.addEventListener('click', () => {
      const expanding = btn.getAttribute('aria-expanded') !== 'true';
      if (expanding) {
        more.style.maxHeight = more.scrollHeight + 'px'; 
      } else {
        more.style.maxHeight = more.scrollHeight + 'px'; 
        void more.offsetHeight; 
        more.style.maxHeight = '0px';
      }
      setState(expanding);
    });

    more.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'max-height' && btn.getAttribute('aria-expanded') === 'true') {
        more.style.maxHeight = 'none';
      }
    });
  });
};
