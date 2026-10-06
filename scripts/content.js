import { scrollReveal } from "./scroll.js";
import { modalListener, timelineListener } from "./modals.js"; // changed: added timelineListener import
let projectDiv = document.getElementById('home-projects');
let workExperienceDiv = document.getElementById('work-experience-timeline');
let modalContent = document.getElementById('modal-content');

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
          <img src="${project.images.heroImg}" alt="${project.title}" class="image-frame hero-image">
          </div>
          <section>
            <h3>Overview</h3>
            <p class="placeholder">[ What the project is and why you built it. ]</p>
          </section>
          <section>
            <h3>How it works</h3>
            <p class="placeholder">[ Technical approach — architecture, control loop, mechanical design. ]</p>
            <div class="image-gallery">
              <div class="image-frame">[ Image ]</div>
              <div class="image-frame">[ Image ]</div>
            </div>
          </section>
          <section>
            <h3>Outcome</h3>
            <p class="placeholder">[ Results, and what you'd do differently next time. ]</p>
          </section>
        </template>
      `
      projNum++;
    });
    let jobNum = 1;
    json.workExperience.forEach((job) => {
      const detailsId = `job-details-${jobNum}`; // new: unique id links the toggle button to its panel
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
    timelineListener(); // new: activates the dropdown toggle after entries are rendered
  });
})