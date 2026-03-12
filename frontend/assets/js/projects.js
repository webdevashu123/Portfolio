const allProjects = document.getElementById("allProjects");
const projectFilters = document.getElementById("projectFilters");
const projectCount = document.getElementById("projectCount");
const projectData = globalThis.projects;

function toLabel(value) {
  if (!value) {
    return "";
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function fullProjectCardTemplate(project) {
  const chips = project.stack.map((item) => `<span class="chip">${item}</span>`).join("");
  const features = project.features.map((item) => `<li>${item}</li>`).join("");
  const sliderDots = project.screenshots
    .map((_, index) => `<span class="slider-dot${index === 0 ? " active" : ""}" data-slide-dot="${index}"></span>`)
    .join("");
  const adminNotes = Array.isArray(project.adminPreview?.notes)
    ? `<ul class="feature-list admin-notes">${project.adminPreview.notes.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "";
  const adminPreview = project.adminPreview
    ? `
      <div class="card glass-card admin-preview-card">
        <div class="project-header-row">
          <h4>${project.adminPreview.title}</h4>
          <span class="project-type">Admin</span>
        </div>
        <div class="project-links">
          <a class="btn btn-secondary" href="${project.adminPreview.images[0]}" target="_blank" rel="noopener">Admin Shot</a>
          <a class="btn btn-secondary" href="${project.adminPreview.architectureDiagram}" target="_blank" rel="noopener">Architecture</a>
          <a class="btn btn-secondary" href="${project.adminPreview.videoUrl}" target="_blank" rel="noopener">Short Video</a>
        </div>
        ${adminNotes}
      </div>
    `
    : "";

  return `
    <article class="card project-card glass-card" data-category="${project.category}">
      <div class="project-slider">
        <img
          src="${project.screenshots[0]}"
          alt="${project.title} screenshot"
          width="1200"
          height="700"
          loading="lazy"
          decoding="async"
          data-slider-image
        />
        <div class="slider-controls">
          <button class="slider-btn" type="button" data-slide-dir="prev">‹</button>
          <button class="slider-btn" type="button" data-slide-dir="next">›</button>
        </div>
        <div class="slider-dots">${sliderDots}</div>
      </div>
      <div class="project-header-row">
        <h3>${project.title}</h3>
        <span class="project-type">${toLabel(project.category)}</span>
      </div>
      <p>${project.description}</p>
      <div class="project-meta">${chips}</div>
      <h4>Key Features</h4>
      <ul class="feature-list">${features}</ul>
      <div class="project-links">
        <a class="btn btn-secondary" href="${project.liveUrl}" target="_blank" rel="noopener">Live Demo</a>
        <a class="btn btn-secondary" href="${project.githubUrl}" target="_blank" rel="noopener">GitHub</a>
      </div>
      ${adminPreview}
    </article>
  `;
}

function bindSliders(data) {
  const cards = allProjects.querySelectorAll(".project-card");
  cards.forEach((card, index) => {
    const image = card.querySelector("[data-slider-image]");
    const dots = card.querySelectorAll("[data-slide-dot]");
    const project = data[index];
    if (!image || !project || !Array.isArray(project.screenshots)) {
      return;
    }

    const setSlide = (nextIndex) => {
      image.src = project.screenshots[nextIndex];
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === nextIndex);
      });
    };

    let current = 0;
    card.addEventListener("click", (event) => {
      const button = event.target.closest("[data-slide-dir]");
      const dot = event.target.closest("[data-slide-dot]");

      if (button) {
        const direction = button.getAttribute("data-slide-dir");
        current =
          direction === "next"
            ? (current + 1) % project.screenshots.length
            : (current - 1 + project.screenshots.length) % project.screenshots.length;
        setSlide(current);
        return;
      }

      if (dot) {
        const dotIndex = Number(dot.getAttribute("data-slide-dot"));
        if (!Number.isNaN(dotIndex)) {
          current = dotIndex;
          setSlide(current);
        }
      }
    });
  });
}

function renderProjects(filter = "all") {
  if (!allProjects || !Array.isArray(projectData)) {
    return;
  }

  const filtered = filter === "all" ? projectData : projectData.filter((project) => project.category === filter);
  allProjects.innerHTML = filtered.map((project) => fullProjectCardTemplate(project)).join("");
  if (projectCount) {
    projectCount.textContent = `Showing ${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
  }
  bindSliders(filtered);
}

if (projectFilters) {
  projectFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) {
      return;
    }

    projectFilters.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.getAttribute("data-filter"));
  });
}

renderProjects();
