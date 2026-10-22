import { scrollReveal } from "./scroll.js";
import { modalListener, timelineListener } from "./modals.js";
import { initLightbox } from "./lightbox.js";
let projectDiv = document.getElementById('home-projects');
let workExperienceDiv = document.getElementById('work-experience-timeline');
let modalContent = document.getElementById('modal-content');

let listVisibleDefault = 3;

const ZOOM = 'tabindex="0" role="button"';

const renderList = (block) => {
  const items = block.items.map((item) => `<li>${item}</li>`);
  const visible = Math.max(1, block.visible ?? listVisibleDefault);
  const hiddenCount = items.length - visible;
  if (!block.collapsible || hiddenCount < 2) {
    return `<ul class="block-list">${items.join('')}</ul>`;
  }
  const moreId = `list-more-${Math.random().toString(36).slice(2, 9)}`;
  return `
    <div class="collapsible-list">
      <ul class="block-list">${items.slice(0, visible).join('')}</ul>
      <div class="list-more" id="${moreId}">
        <ul class="block-list">${items.slice(visible).join('')}</ul>
      </div>
      <button class="list-toggle" type="button" aria-expanded="false" aria-controls="${moreId}" data-count="${hiddenCount}">[ <span class="list-toggle-label">Show ${hiddenCount} more</span> ]</button>
    </div>`;
};
const parseYouTube = (src) => {
  let u;
  try { u = new URL(src, location.href); } catch { return null; }
  const host = u.hostname.replace(/^(www\.|m\.)/, '');
  const parts = u.pathname.split('/').filter(Boolean);
  let id = null, short = false;
  if (host === 'youtu.be') id = parts[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (u.pathname === '/watch') id = u.searchParams.get('v');
    else if (['embed', 'shorts', 'live', 'v'].includes(parts[0])) { id = parts[1]; short = parts[0] === 'shorts'; }
  }
  if (!id || !/^[\w-]{11}$/.test(id)) return null;
  const t = u.searchParams.get('start') || u.searchParams.get('t') || '';
  const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  const start = t && m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  return { id, start, short };
};
const renderMedia = (media, { cls = 'image-frame', ratio = '', alt = '' } = {}) => {
  const m = typeof media === 'string' ? { src: media } : media;
  const label = m.alt || m.caption || alt;
  const yt = parseYouTube(m.src);
  if (yt) {
    const params = new URLSearchParams({ rel: '0', playsinline: '1', enablejsapi: '1', origin: location.origin });
    if (yt.start) params.set('start', yt.start);
    const ytRatio = ratio || (yt.short ? '9/16' : ''); 
    return `<iframe class="${cls} is-embed" src="https://www.youtube-nocookie.com/embed/${yt.id}?${params}" title="${label || 'YouTube video'}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen${ytRatio ? ` style="aspect-ratio:${ytRatio}"` : ''}></iframe>`;
  }
  return `<img class="${cls}" src="${m.src}" alt="${label}"${ratio ? ` style="aspect-ratio:${ratio}"` : ''}>`;
};
const renderBlock = (block) => {
  switch (block.type) {
    case "text":
      return `<p class="placeholder">${block.text}</p>`;
    case "list":
      return renderList(block); 
    case "image":
      return `
        <figure class="block-figure ${block.size || 'full'}">
          ${renderMedia(block, { ratio: block.ratio })}
          ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
        </figure>`;
    case "images":
      return `
        <div class="block-images" style="--cols:${block.columns || block.items.length}">
          ${block.items.map((img) => `
            <figure class="block-figure">
              ${renderMedia(img, { ratio: block.ratio })}
              ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
            </figure>`).join('')}
        </div>`;
    default:
      return '';
  }
};
const renderSections = (sections = []) => sections.map((section) => `
  <section>
    ${section.heading ? `<h3>${section.heading}</h3>` : ''}
    ${(section.blocks || []).map(renderBlock).join('')}
  </section>`).join('');
const RESERVED_HASHES = ['projects', 'experience', 'gallery']; 
const slugify = (text) => String(text).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const usedSlugs = new Set();
const makeSlug = (project) => {
  const base = slugify(project.slug || project.title) || 'project';
  let slug = base, n = 2;
  while (usedSlugs.has(slug) || RESERVED_HASHES.includes(slug)) slug = `${base}-${n++}`; 
  usedSlugs.add(slug);
  return slug;
};

fetch("./scripts/content.json").then(async (res) => {
  res.json().then((json) => {
    initLightbox(); 
    listVisibleDefault = json.settings?.listVisible ?? listVisibleDefault; 
    let projNum = 1;
    json.projects.forEach((project) => {
      const slug = makeSlug(project); 
      projectDiv.innerHTML += `
          <button class="home-project" type="button" data-project="p${projNum}" data-slug="${slug}" data-reveal style="--i:${projNum + 1}">
            <div class="thumb">
              <img class="image-frame" src="${project.images.iconImg}" alt="${project.title}">
              <span class="num">0${projNum}</span>
            </div>
            <div class="home-project-text">
              <h3 class="placeholder">${project.title}</h3>
              <p class="tags">[ ${project.tags.join(", ")} ]</p>
              <p class="placeholder">${project.previewDesc}</p>
            </div>
          </button>
      `;
      const tocEnabled = project.toc ?? json.settings?.showToc ?? true; 
      modalContent.innerHTML += `
        <template class="project-detail" id="p${projNum}" data-slug="${slug}" data-toc="${tocEnabled}">
          <h2 class="placeholder">${project.title}</h2>
          <div class="project-meta">
            <span class="placeholder">${project.metadata.join('</span><span class="placeholder">')}</span>
          </div>
          <div class="project-links">
            ${project.links.map((link) => `<a href="${link[1]}" target="_blank" class="tech-link">[ ${link[0]} ]</a>`).join('')}
          </div>
          ${project.images.heroImg ? `
          <figure class="hero-figure">
            ${renderMedia(project.images.heroImg, { cls: 'image-frame hero-image', alt: project.title })}
            ${project.images.heroCaption ? `<figcaption class="placeholder">${project.images.heroCaption}</figcaption>` : ''}
          </figure>` : ''}
          ${renderSections(project.sections)}
        </template>
      `
      projNum++;
    });


    let jobNum = 1;
    json.workExperience.forEach((job) => {
      const detailsId = `job-details-${jobNum}`;
      workExperienceDiv.innerHTML += `
        <article class="timeline-entry" data-reveal style="--i:${jobNum + 1}">
          <div class="when placeholder">${job.timeframe}</div>
          <button class="body timeline-toggle" type="button" aria-expanded="false" aria-controls="${detailsId}">
            <h3 class="placeholder">${job.role}</h3>
            <p class="org placeholder">${job.organization}</p>
          </button>
          <div class="timeline-details" id="${detailsId}">
            <div class="timeline-details-inner">
              <p class="placeholder">${job.description}</p>
              ${job.images && job.images.length ? `
              <div class="timeline-images">
                ${job.images.map((src) => `<img class="image-frame zoomable" ${ZOOM} src="${src}" alt="${job.role}">`).join('')}
              </div>` : ''}
            </div>
          </div>
        </article>
      `;
      jobNum++;
    });
    scrollReveal();
    modalListener();
    timelineListener();
  });
})

/*


        {
          "heading": "Gallery",
          "blocks": [
            { "type": "text", "text": "I wanted to archive all of the different robots I've created over the years, so I thought I'd just share photos and videos from each season." },
            { "type": "images", "columns": 3, "ratio": "4/3", "items": [
              { "src": "../projects/vex1.jpg", "caption": "2025 robot, CAD render", "size": "half" },
              { "src": "../projects/vex1.jpg", "caption": "2025 robot, CAD render", "size": "half" },
              { "src": "../projects/vex1.jpg", "caption": "2025 robot, CAD render", "size": "half" }
            ]}
          ]
        }
          */