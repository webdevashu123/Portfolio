function featuredCardTemplate(project) {
  const chips = project.stack
    .map(
      (item) =>
        `<span class="inline-flex rounded-full bg-slate-100 dark:bg-slate-700/80 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">${item}</span>`
    )
    .join("");
  return `
    <article class="rounded-2xl border border-slate-200/70 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/60 backdrop-blur p-6 shadow-sm hover:shadow-emerald-500/10 transition">
      <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">${project.title}</h3>
      <p class="mt-2 text-slate-600 dark:text-slate-300">${project.description}</p>
      <div class="mt-4 flex flex-wrap gap-2">${chips}</div>
      <div class="mt-5 flex flex-wrap gap-3">
        <a class="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition" href="${project.liveUrl}" target="_blank" rel="noopener">Live Demo</a>
        <a class="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition" href="${project.githubUrl}" target="_blank" rel="noopener">GitHub</a>
      </div>
    </article>
  `;
}

const projectData = globalThis.projects;
const featured = document.getElementById("featuredProjects");
if (featured && Array.isArray(projectData)) {
  featured.innerHTML = projectData
    .slice(0, 2)
    .map((project) => featuredCardTemplate(project))
    .join("");
}

const typedRole = document.getElementById("typedRole");
if (typedRole) {
  const roles = ["Full Stack Developer", "Software Builder", "Freelance Web Engineer"];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const current = roles[roleIndex];
    typedRole.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);

    if (!deleting && charIndex > current.length) {
      deleting = true;
      window.setTimeout(typeLoop, 1000);
      return;
    }

    if (deleting && charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = 0;
    }

    window.setTimeout(typeLoop, deleting ? 45 : 85);
  };

  typeLoop();
}

const heroSection = document.getElementById("heroSection");
const heroParallax = document.getElementById("heroParallax");
if (heroSection && heroParallax) {
  heroSection.addEventListener("mousemove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroParallax.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0)`;
  });

  heroSection.addEventListener("mouseleave", () => {
    heroParallax.style.transform = "translate3d(0, 0, 0)";
  });
}

const skillsGrid = document.getElementById("skillsGrid");
const skillsTabs = document.getElementById("skillsTabs");
const skillsData = globalThis.skillCategories;

function skillCardTemplate(skill) {
  return `
    <article class="group rounded-2xl border border-slate-200/70 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/60 p-5 shadow-sm hover:-translate-y-1 transition">
      <div class="flex items-center gap-4">
      <div class="skill-circle relative grid h-20 w-20 place-items-center rounded-full" data-skill-value="${skill.value}">
        <div class="skill-inner grid h-16 w-16 place-items-center rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-slate-100">${skill.value}%</div>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">${skill.name}</h3>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">${skill.detail}</p>
      </div>
      </div>
    </article>
  `;
}

function animateSkillRings() {
  const circles = document.querySelectorAll(".skill-circle");
  circles.forEach((circle) => {
    const target = Number(circle.dataset.skillValue || 0);
    let current = 0;
    const run = () => {
      current += 2;
      if (current > target) {
        current = target;
      }
      circle.style.background = `conic-gradient(rgb(5 150 105) ${(current / 100) * 360}deg, rgb(203 213 225) 0deg)`;
      if (current < target) {
        window.requestAnimationFrame(run);
      }
    };
    run();
  });
}

function updateTabState(buttons, activeButton) {
  buttons.forEach((btn) => {
    btn.classList.remove("bg-emerald-600", "text-white");
    btn.classList.add("border", "border-slate-300", "dark:border-slate-700");
  });
  activeButton.classList.add("bg-emerald-600", "text-white");
  activeButton.classList.remove("border", "border-slate-300", "dark:border-slate-700");
}

function renderSkills(tab) {
  if (!skillsGrid || !skillsData || !skillsData[tab]) {
    return;
  }
  skillsGrid.innerHTML = skillsData[tab].map((skill) => skillCardTemplate(skill)).join("");
  animateSkillRings();
}

if (skillsTabs && skillsGrid && skillsData) {
  skillsTabs.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) {
      return;
    }
    updateTabState(skillsTabs.querySelectorAll(".tab-btn"), button);
    renderSkills(button.dataset.tab);
  });

  renderSkills("frontend");
}
