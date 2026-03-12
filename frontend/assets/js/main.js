// Import modules
import './modules/toast.js';
import './modules/skeleton.js';
import './modules/modal.js';
import './modules/newsletter.js';
import './modules/analytics.js';
import './modules/floating-contact.js';

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");
const themeTrack = document.getElementById("themeTrack");
const themeThumb = document.getElementById("themeThumb");

// Navigation
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.contains("show");
    mainNav.classList.toggle("show", !isOpen);
    mainNav.classList.remove("hidden");
    navToggle.classList.toggle("active", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 921) {
        mainNav.classList.remove("show");
        navToggle.classList.remove("active");
      }
    });
  });
}

// Theme
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-checked", String(isDark));
  }

  if (themeTrack) {
    themeTrack.classList.toggle("on", isDark);
  }

  if (themeThumb) {
    themeThumb.classList.toggle("on", isDark);
  }
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.body.classList.add("theme-transition");
    applyTheme(next);
    localStorage.setItem("theme", next);
    window.setTimeout(() => document.body.classList.remove("theme-transition"), 350);
  });
}

// Featured Projects
function featuredCardTemplate(project) {
  const chips = project.stack.map((item) => `<span class="chip">${item}</span>`).join("");
  return `
    <article class="card glass-card">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-meta">${chips}</div>
      <div class="project-links">
        <a class="btn btn-secondary" href="${project.liveUrl}" target="_blank" rel="noopener">Live Demo</a>
        <a class="btn btn-secondary" href="${project.githubUrl}" target="_blank" rel="noopener">GitHub</a>
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

// Typing Animation
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
      window.setTimeout(typeLoop, 900);
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

// Parallax Hero
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

// Skills
const skillsGrid = document.getElementById("skillsGrid");
const skillsTabs = document.getElementById("skillsTabs");
const skillsData = globalThis.skillCategories;

function skillCardTemplate(skill) {
  return `
    <article class="card skill-card glass-card">
      <div class="skill-circle" data-skill-value="${skill.value}">
        <div class="skill-inner">${skill.value}%</div>
      </div>
      <div>
        <h3>${skill.name}</h3>
        <p>${skill.detail}</p>
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
      circle.style.setProperty("--degree", `${(current / 100) * 360}deg`);
      if (current < target) {
        window.requestAnimationFrame(run);
      }
    };
    run();
  });
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
    skillsTabs.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderSkills(button.dataset.tab);
  });
  renderSkills("frontend");
}

// Stats Counter
const statsRoot = document.getElementById("aboutStats");
const stats = globalThis.aboutStats;
if (statsRoot && Array.isArray(stats)) {
  statsRoot.innerHTML = stats
    .map(
      (item) => `
      <article class="stat-block">
        <strong data-stat="${item.value}" data-suffix="${item.suffix || ""}">0</strong>
        <span class="stat-label">${item.label}</span>
        <small class="stat-detail">${item.detail || ""}</small>
      </article>
    `
    )
    .join("");

  const counters = statsRoot.querySelectorAll("[data-stat]");
  counters.forEach((counter) => {
    const target = Number(counter.getAttribute("data-stat"));
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const tick = () => {
      current += step;
      if (current > target) {
        current = target;
      }
      const suffix = counter.getAttribute("data-suffix") || "";
      counter.textContent = `${current}${suffix}`;
      if (current < target) {
        window.requestAnimationFrame(tick);
      }
    };
    tick();
  });
}

// ============ ENHANCED FEATURES ============

// Scroll-triggered animations with Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up:not(.animated)').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.classList.add('animated');
    observer.observe(el);
  });
}

// Floating label for forms
function initFloatingLabels() {
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    const label = input.previousElementSibling;
    if (!label || !label.tagName === 'LABEL') return;

    input.addEventListener('focus', () => label.classList.add('focused'));
    input.addEventListener('blur', () => {
      if (!input.value) label.classList.remove('focused');
    });
    if (input.value) label.classList.add('focused');
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Add contact modal trigger to buttons
function initContactTriggers() {
  document.querySelectorAll('[data-contact-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.contactModal) {
        window.contactModal.open();
      }
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initFloatingLabels();
  initSmoothScroll();
  initContactTriggers();
  
  const mutationObserver = new MutationObserver(() => {
    initScrollAnimations();
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
});

initScrollAnimations();
