import { scrollReveal } from "./scroll.js";
import { modalListener, timelineListener } from "./modals.js";
let projectDiv = document.getElementById('home-projects');
let workExperienceDiv = document.getElementById('work-experience-timeline');
let modalContent = document.getElementById('modal-content');

// new: turns one block from a project's "sections" array in content.json into HTML.
// block types: "text" | "image" | "images" (a row) | "list"
const renderBlock = (block) => {
  switch (block.type) {
    case "text":
      return `<p class="placeholder">${block.text}</p>`;
    case "list":
      return `<ul class="block-list">${block.items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    case "image":
      return `
        <figure class="block-figure ${block.size || 'full'}">
          <img class="image-frame" src="${block.src}" alt="${block.alt || block.caption || ''}" style="${block.ratio ? `aspect-ratio:${block.ratio}` : ''}">
          ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
        </figure>`;
    case "images":
      return `
        <div class="block-images" style="--cols:${block.columns || block.items.length}">
          ${block.items.map((img) => `
            <figure class="block-figure">
              <img class="image-frame" src="${img.src}" alt="${img.alt || img.caption || ''}" style="${block.ratio ? `aspect-ratio:${block.ratio}` : ''}">
              ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
            </figure>`).join('')}
        </div>`;
    default:
      return '';
  }
};

// new: one <section> per entry in the project's "sections" array
const renderSections = (sections = []) => sections.map((section) => `
  <section>
    ${section.heading ? `<h3>${section.heading}</h3>` : ''}
    ${(section.blocks || []).map(renderBlock).join('')}
  </section>`).join('');

fetch("./scripts/content.json").then(async (res) => {
  res.json().then((json) => {
    let projNum = 1;
    json.projects.forEach((project) => {
      projectDiv.innerHTML += `
          <button class="home-project" type="button" data-project="p${projNum}" data-reveal style="--i:${projNum + 1}">
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
      modalContent.innerHTML += `
        <template class="project-detail" id="p${projNum}">
          <p class="eyebrow placeholder">[ ${project.tags.join(", ")} ]</p>
          <h2 class="placeholder">${project.title}</h2>
          <div class="project-meta">
            ${project.metadata.map((data) => `<span data-label="${data[0]}" class="placeholder">[ ${data[1]} ]</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.links.map((link) => `<a href="${link[1]}" target="_blank" class="tech-link">[ ${link[0]} ]</a>`).join('')}
          </div>
          ${project.images.heroImg ? `
          <figure class="hero-figure">
            <img src="${project.images.heroImg}" alt="${project.title}" class="image-frame hero-image">
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
                ${job.images.map((src) => `<img class="image-frame" src="${src}" alt="${job.role}">`).join('')}
              </div>` : `
              <div class="timeline-images">
                <div class="image-frame">[ Image ]</div>
              </div>`}
            </div>
          </div>
        </article>
      `;
      jobNum++;
    });

    // json.gallery.forEach((item) => {
    
    // });
    scrollReveal();
    modalListener();
    timelineListener();
  });
})