import { scrollReveal } from "./scroll.js";
import { modalListener } from "./modals.js";
let projectDiv = document.getElementById('home-projects');

fetch("./scripts/content.json").then(async (res) => {
  res.json().then((json) => {
    let projNum = 1;
    json.projects.forEach((project) => {
      projectDiv.innerHTML += `
          <button class="home-project" type="button" data-project="p${projNum}" data-reveal style="--i:${projNum + 1}">
            <div class="thumb">
              <div class="image-frame">[ Image ]</div>
              <span class="num">01</span>
            </div>
            <div class="home-project-text">
              <h3 class="placeholder">${project.title}</h3>
              <p class="tags">[ ${project.tags.join(", ")} ]</p>
              <p class="placeholder">${project.previewDesc}</p>
            </div>
          </button>
      `;
      projNum++;
      console.log("hi")
    });

    // json.gallery.forEach((item) => {
    
    // });
    scrollReveal();
    modalListener();
  });
})