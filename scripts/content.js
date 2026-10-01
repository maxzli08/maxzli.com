import { scrollReveal } from "./scroll.js";
import { modalListener } from "./modals.js";
let projectDiv = document.getElementById('home-projects');

fetch("./scripts/content.json").then((res) => {
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
              <h3 class="placeholder">[ Project title ]</h3>
              <p class="tags">[ tags — e.g. C++, ROS2, SolidWorks ]</p>
              <p class="placeholder">[ One or two sentence description. ]</p>
            </div>
          </button>
      `;
      projNum++;
      console.log("hi")
    });

    json.gallery.forEach((item) => {
    
    });
    scrollReveal();
    modalListener();
  });
})