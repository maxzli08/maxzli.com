// Collapsible lists: shows the first few bullets and tucks the rest behind a
// "Show N more" button. The markup is built in content.js (renderList); this
// file only wires up the buttons. Safe to call repeatedly on the same root.
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
        more.style.maxHeight = more.scrollHeight + 'px'; // animate to the real height
      } else {
        more.style.maxHeight = more.scrollHeight + 'px'; // leave "none" first so there is a pixel value to animate from
        void more.offsetHeight; // force a reflow so the browser registers that value
        more.style.maxHeight = '0px';
      }
      setState(expanding);
    });

    // once fully open, drop the fixed height so resizing the window can't clip the list
    more.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'max-height' && btn.getAttribute('aria-expanded') === 'true') {
        more.style.maxHeight = 'none';
      }
    });
  });
};
