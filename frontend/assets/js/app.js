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

// ============ ROUTER ============
class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash || '#/';
    const path = hash.slice(1) || '/';
    
    let route = this.routes.find(r => r.path === path);
    
    if (!route) {
      route = this.routes.find(r => r.path === '/') || this.routes[0];
    }
    
    if (route && route.component) {
      this.currentRoute = path;
      this.render(route.component);
      this.updateNav(path);
    }
  }

  updateNav(path) {
    const navLinks = document.querySelectorAll('#mainNav a');
    navLinks.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === 'home' && (path === '/' || path === '')) {
        link.classList.add('active');
      } else if (route === path.replace('/', '')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  async render(component) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<div class="container section"><div class="card"><p>Loading...</p></div></div>';
    
    try {
      app.innerHTML = component();
      this.initPage();
      window.scrollTo(0, 0);
      if (window.initScrollAnimations) {
        window.initScrollAnimations();
      }
    } catch (error) {
      console.error('Render error:', error);
      app.innerHTML = '<div class="container section"><div class="card"><p>Error loading page</p></div></div>';
    }
  }

  initPage() {
    if (this.currentRoute === '/' || this.currentRoute === '') {
      this.initTypingAnimation();
      this.initHeroAnimations();
    }

    if (this.currentRoute === '/contact') {
      this.initContactForm();
    }

    if (this.currentRoute === '/admin') {
      this.initAdmin();
    }
  }

  // ============ HERO ANIMATIONS ============
  initHeroAnimations() {
    // Animate hero elements on load
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDesc = document.querySelector('.hero-description');
    const heroActions = document.querySelector('.hero-actions');
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroTitle) heroTitle.classList.add('animate-in');
    if (heroSubtitle) setTimeout(() => heroSubtitle.classList.add('animate-in'), 200);
    if (heroDesc) setTimeout(() => heroDesc.classList.add('animate-in'), 400);
    if (heroActions) setTimeout(() => heroActions.classList.add('animate-in'), 600);
    if (heroStats) setTimeout(() => heroStats.classList.add('animate-in'), 800);
  }

  // ============ ADMIN FUNCTIONALITY ============
  async initAdmin() {
    const loginForm = document.getElementById('adminLoginForm');
    const dashboard = document.getElementById('adminDashboard');
    const loginDiv = document.getElementById('adminLogin');
    const logoutBtn = document.getElementById('adminLogoutBtn');
    const tabBtns = document.querySelectorAll('[data-admin-tab]');
    const adminLoginStatus = document.getElementById('adminLoginStatus');

    try {
      const checkRes = await fetch('/api/admin/check');
      const checkData = await checkRes.json();
      if (checkData.authenticated) {
        if (loginDiv) loginDiv.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        this.loadAdminData();
      }
    } catch (e) {
      console.error('Admin check failed:', e);
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        if (adminLoginStatus) {
          adminLoginStatus.textContent = 'Logging in...';
          adminLoginStatus.style.color = 'var(--muted)';
        }

        try {
          const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          const result = await response.json();

          if (result.success) {
            if (adminLoginStatus) {
              adminLoginStatus.textContent = 'Login successful!';
              adminLoginStatus.style.color = 'var(--success)';
            }
            if (loginDiv) loginDiv.style.display = 'none';
            if (dashboard) dashboard.style.display = 'block';
            this.loadAdminData();
          } else {
            if (adminLoginStatus) {
              adminLoginStatus.textContent = result.message || 'Login failed';
              adminLoginStatus.style.color = 'var(--error)';
            }
          }
        } catch (error) {
          if (adminLoginStatus) {
            adminLoginStatus.textContent = 'Login error. Please try again.';
            adminLoginStatus.style.color = 'var(--error)';
          }
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fetch('/api/admin/logout', { method: 'POST' });
        } catch (e) {}
        if (loginDiv) loginDiv.style.display = 'block';
        if (dashboard) dashboard.style.display = 'none';
      });
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.adminTab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.admin-tab-content').forEach(content => {
          content.style.display = 'none';
        });
        const tabContent = document.getElementById(`tab-${tab}`);
        if (tabContent) tabContent.style.display = 'block';
      });
    });
  }

  async loadAdminData() {
    try {
      const response = await fetch('/api/admin/submissions');
      const result = await response.json();

      if (result.success && result.data) {
        const contacts = result.data.contacts || [];
        const contactList = document.getElementById('contactList');
        const contactCount = document.getElementById('contactCount');
        if (contactCount) contactCount.textContent = `(${contacts.length})`;
        if (contactList) {
          contactList.innerHTML = contacts.length ? contacts.map(c => `
            <div class="admin-item" style="padding:0.75rem 0;border-bottom:1px solid var(--border);">
              <strong>${c.name}</strong> (${c.email})<br>
              <small>${c.projectType || 'N/A'} | ${c.budget || 'N/A'}</small><br>
              <p style="margin:0.5rem 0;">${c.message}</p>
              <small style="color:var(--muted);">${new Date(c.createdAt).toLocaleDateString()}</small>
            </div>
          `).join('') : '<p>No messages yet</p>';
        }

        const inquiries = result.data.serviceInquiries || [];
        const inquiryList = document.getElementById('inquiryList');
        const inquiryCount = document.getElementById('inquiryCount');
        if (inquiryCount) inquiryCount.textContent = `(${inquiries.length})`;
        if (inquiryList) {
          inquiryList.innerHTML = inquiries.length ? inquiries.map(i => `
            <div class="admin-item" style="padding:0.75rem 0;border-bottom:1px solid var(--border);">
              <strong>${i.name}</strong> (${i.email})<br>
              <small>${i.serviceType} | ${i.projectScope}</small><br>
              <p style="margin:0.5rem 0;">${i.requirements}</p>
              <small style="color:var(--muted);">${new Date(i.createdAt).toLocaleDateString()}</small>
            </div>
          `).join('') : '<p>No inquiries yet</p>';
        }

        const newsletters = result.data.newsletters || [];
        const subscriberList = document.getElementById('subscriberList');
        const subscriberCount = document.getElementById('subscriberCount');
        if (subscriberCount) subscriberCount.textContent = `(${newsletters.length})`;
        if (subscriberList) {
          subscriberList.innerHTML = newsletters.length ? newsletters.map(n => `
            <div class="admin-item" style="padding:0.5rem 0;border-bottom:1px solid var(--border);">
              ${n.email} <span style="color:var(--muted);">- ${n.status}</span>
              <br><small>${new Date(n.createdAt).toLocaleDateString()}</small>
            </div>
          `).join('') : '<p>No subscribers yet</p>';
        }
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  }

  initTypingAnimation() {
    const typedRole = document.getElementById("typedRole");
    if (typedRole) {
      const roles = ["Full Stack Developer", "Software Engineer", "Freelancer"];
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const typeLoop = () => {
        const current = roles[roleIndex];
        typedRole.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);

        if (!deleting && charIndex > current.length) {
          deleting = true;
          window.setTimeout(typeLoop, 1500);
          return;
        }

        if (deleting && charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }

        window.setTimeout(typeLoop, deleting ? 30 : 60);
      };

      typeLoop();
    }
  }

  initContactForm() {
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm && formStatus) {
      contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const payload = {
          name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          projectType: String(formData.get("projectType") || ""),
          budget: String(formData.get("budget") || ""),
          message: String(formData.get("message") || "").trim()
        };

        if (!payload.name || !payload.email || !payload.message) {
          formStatus.textContent = "Please fill in all required fields.";
          formStatus.style.color = "var(--error)";
          return;
        }

        formStatus.textContent = "Sending message...";
        formStatus.style.color = "var(--muted)";

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          const result = await response.json();
          if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to submit your message.");
          }

          formStatus.textContent = "Message sent successfully!";
          formStatus.style.color = "var(--success)";
          contactForm.reset();
          
          if (window.toast) {
            window.toast.success("Message sent successfully!");
          }
        } catch (error) {
          formStatus.textContent = error.message || "Unable to submit your message.";
          formStatus.style.color = "var(--error)";
        }
      });
    }
  }
}

// ============ PAGE COMPONENTS ============
const pages = {
  home: () => `
    <div class="home-page">
      <!-- Hero Section - Fresh New Look -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <p class="hero-greeting">Hello, I'm</p>
            <h1 class="hero-title">Ashutosh Ranjan</h1>
            <p class="hero-subtitle"><span id="typedRole" class="typed-role"></span></p>
            <p class="hero-description">
              I build exceptional digital experiences that help businesses grow. 
              Specialized in full-stack development with a focus on scalable architectures 
              and user-centric design.
            </p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#/projects">View My Work</a>
              <a class="btn btn-outline" href="#/contact">Get In Touch</a>
              <a class="btn btn-outline" href="/resume.pdf" target="_blank">Download CV</a>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">5+</span>
                <span class="stat-label">Years Experience</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">20+</span>
                <span class="stat-label">Projects Completed</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">15+</span>
                <span class="stat-label">Happy Clients</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card-3d">
              <div class="code-block">
                <div class="code-header">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <pre><code><span class="keyword">const</span> <span class="variable">developer</span> = {
  <span class="property">name</span>: <span class="string">"Ashutosh Ranjan"</span>,
  <span class="property">role</span>: <span class="string">"Full Stack Developer"</span>,
  <span class="property">skills</span>: [<span class="string">"React"</span>, <span class="string">"Node.js"</span>, <span class="string">"MongoDB"</span>],
  <span class="property">available</span>: <span class="boolean">true</span>
};</code></pre>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-scroll">
          <span>Scroll to explore</span>
          <div class="scroll-indicator"></div>
        </div>
      </section>

      <!-- Services Section -->
      <section class="section services-preview">
        <div class="container">
          <div class="section-header">
            <p class="eyebrow">What I Do</p>
            <h2>Bringing Ideas to Life</h2>
          </div>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">💻</div>
              <h3>Web Development</h3>
              <p>Custom websites and web applications built with modern technologies for optimal performance.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">⚡</div>
              <h3>Full-Stack Solutions</h3>
              <p>End-to-end development from database design to intuitive user interfaces.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🚀</div>
              <h3>Performance Optimization</h3>
              <p>Speed up your existing applications for better user experience and SEO.</p>
            </div>
          </div>
          <div class="section-cta">
            <a href="#/services" class="btn btn-primary">View All Services</a>
          </div>
        </div>
      </section>

      <!-- Featured Projects -->
      <section class="section featured-section">
        <div class="container">
          <div class="section-header">
            <p class="eyebrow">Portfolio</p>
            <h2>Recent Projects</h2>
          </div>
          <div class="featured-grid">
            <article class="featured-card">
              <div class="featured-content">
                <span class="project-category">Full Stack</span>
                <h3>ServiGo</h3>
                <p>Multi-role appliance service platform with real-time tracking, technician management, and admin dashboard.</p>
                <div class="project-tech">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>MongoDB</span>
                </div>
                <a href="#/projects" class="text-link">View Details →</a>
              </div>
            </article>
            <article class="featured-card">
              <div class="featured-content">
                <span class="project-category">E-Commerce</span>
                <h3>Multi-Vendor Marketplace</h3>
                <p>Full-featured marketplace with vendor management, order tracking, and payment integration.</p>
                <div class="project-tech">
                  <span>React</span>
                  <span>Express</span>
                  <span>PostgreSQL</span>
                </div>
                <a href="#/projects" class="text-link">View Details →</a>
              </div>
            </article>
          </div>
          <div class="section-cta">
            <a href="#/projects" class="btn btn-outline">View All Projects</a>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="section testimonials-section">
        <div class="container">
          <div class="section-header">
            <p class="eyebrow">Testimonials</p>
            <h2>What Clients Say</h2>
          </div>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <p class="quote">"Ashutosh delivered our project on time and exceeded expectations. His technical skills and communication made the entire process smooth."</p>
              <div class="testimonial-author">
                <div class="author-avatar">S</div>
                <div class="author-info">
                  <strong>Startup Founder</strong>
                  <span>Tech Startup</span>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <p class="quote">"Excellent developer! understood our requirements perfectly and delivered a high-quality product. Highly recommended!"</p>
              <div class="testimonial-author">
                <div class="author-avatar">R</div>
                <div class="author-info">
                  <strong>Operations Manager</strong>
                  <span>Service Company</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="section cta-section">
        <div class="container">
          <div class="cta-box">
            <h2>Let's Build Something Amazing Together</h2>
            <p>Have a project in mind? I'd love to hear about it. Let's discuss how I can help bring your vision to life.</p>
            <div class="cta-actions">
              <a href="#/contact" class="btn btn-primary btn-lg">Start a Conversation</a>
              <a href="#/projects" class="btn btn-outline btn-lg">View My Work</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,

  about: () => `
    <div class="container section fade-up">
      <div class="page-title">
        <p class="eyebrow">About Me</p>
        <h1>Building practical products with clean architecture.</h1>
      </div>

      <section class="about-intro">
        <div class="about-grid">
          <div class="about-image">
            <div class="image-placeholder">
              <span>Your Photo Here</span>
            </div>
          </div>
          <div class="about-content">
            <h2>Hi, I'm Ashutosh Ranjan</h2>
            <p class="lead">A passionate full-stack developer with 5+ years of experience building web applications.</p>
            <p>I specialize in creating efficient, scalable, and user-friendly web solutions. My journey started with curiosity about how things work on the internet, and it has evolved into a career dedicated to building great digital experiences.</p>
            <p>When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.</p>
            <div class="about-cta">
              <a href="/resume.pdf" class="btn btn-primary" target="_blank">Download Resume</a>
              <a href="#/contact" class="btn btn-outline">Get In Touch</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Skills & Expertise</h2>
        <div class="skills-categories">
          <div class="skill-category">
            <h3>Frontend</h3>
            <div class="skill-tags">
              <span class="skill-tag">React</span>
              <span class="skill-tag">JavaScript</span>
              <span class="skill-tag">HTML/CSS</span>
              <span class="skill-tag">Tailwind</span>
            </div>
          </div>
          <div class="skill-category">
            <h3>Backend</h3>
            <div class="skill-tags">
              <span class="skill-tag">Node.js</span>
              <span class="skill-tag">Express</span>
              <span class="skill-tag">MongoDB</span>
              <span class="skill-tag">PostgreSQL</span>
            </div>
          </div>
          <div class="skill-category">
            <h3>Tools</h3>
            <div class="skill-tags">
              <span class="skill-tag">Git</span>
              <span class="skill-tag">Docker</span>
              <span class="skill-tag">AWS</span>
              <span class="skill-tag">Figma</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section approach-section">
        <h2>How I Work</h2>
        <div class="approach-steps">
          <div class="approach-step">
            <span class="step-number">01</span>
            <h3>Discovery</h3>
            <p>Understanding your goals, requirements, and vision for the project.</p>
          </div>
          <div class="approach-step">
            <span class="step-number">02</span>
            <h3>Development</h3>
            <p>Building with clean code, regular updates, and iterative improvements.</p>
          </div>
          <div class="approach-step">
            <span class="step-number">03</span>
            <h3>Delivery</h3>
            <p>Testing, deployment, and ensuring everything works perfectly.</p>
          </div>
        </div>
      </section>
    </div>
  `,

  services: () => `
    <div class="container section fade-up services-page">
      <div class="page-title services-title">
        <p class="eyebrow">My Services</p>
        <h1>How I Can Help You</h1>
      </div>

      <section class="section services-detailed">
        <div class="service-detail-card">
          <div class="service-detail-icon">💻</div>
          <div class="service-detail-content">
            <h2>Web Development</h2>
            <p>Custom websites and web applications tailored to your business needs.</p>
            <ul>
              <li>Responsive website design</li>
              <li>Single Page Applications (SPA)</li>
              <li>CMS integration</li>
              <li>API development</li>
            </ul>
          </div>
        </div>

        <div class="service-detail-card">
          <div class="service-detail-icon">⚡</div>
          <div class="service-detail-content">
            <h2>Full-Stack Development</h2>
            <p>Complete end-to-end solutions for complex business requirements.</p>
            <ul>
              <li>Frontend & Backend development</li>
              <li>Database design & optimization</li>
              <li>Authentication & security</li>
              <li>Third-party integrations</li>
            </ul>
          </div>
        </div>

        <div class="service-detail-card">
          <div class="service-detail-icon">🔧</div>
          <div class="service-detail-content">
            <h2>Maintenance & Support</h2>
            <p>Ongoing support to keep your applications running smoothly.</p>
            <ul>
              <li>Bug fixes & troubleshooting</li>
              <li>Performance optimization</li>
              <li>Security updates</li>
              <li>Feature enhancements</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="pricing-section">
          <h2>Engagement Models</h2>
          <div class="pricing-grid">
            <div class="pricing-card">
              <h3>Project-Based</h3>
              <p class="price">Custom Quote</p>
              <p>For defined scope projects with clear requirements.</p>
              <ul>
                <li>Fixed timeline & budget</li>
                <li>Milestone payments</li>
                <li>Full source code</li>
              </ul>
            </div>
            <div class="pricing-card featured">
              <span class="popular-tag">Most Popular</span>
              <h3>Hourly</h3>
              <p class="price">$25-50/hr</p>
              <p>Flexible arrangement for ongoing work.</p>
              <ul>
                <li>Pay as you go</li>
                <li>Weekly updates</li>
                <li>Priority support</li>
              </ul>
            </div>
            <div class="pricing-card">
              <h3>Retainer</h3>
              <p class="price">Custom Quote</p>
              <p>For consistent, ongoing development needs.</p>
              <ul>
                <li>Monthly commitment</li>
                <li>Reserved hours</li>
                <li>Discounted rates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="section cta-section">
        <div class="cta-box">
          <h2>Ready to Start?</h2>
          <p>Let's discuss your project and find the best solution for your needs.</p>
          <a href="#/contact" class="btn btn-primary btn-lg">Get In Touch</a>
        </div>
      </section>
    </div>
  `,

  projects: () => `
    <div class="container section fade-up projects-page">
      <div class="page-title projects-title">
        <p class="eyebrow">Portfolio</p>
        <h1>My Projects</h1>
      </div>

      <section class="section">
        <div class="projects-filter">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="web">Web Apps</button>
          <button class="filter-btn" data-filter="fullstack">Full Stack</button>
          <button class="filter-btn" data-filter="mobile">Mobile</button>
        </div>
      </section>

      <section class="section">
        <div class="project-card-large">
          <div class="project-info">
            <span class="project-category">Full Stack</span>
            <h3>ServiGo - Appliance Service Platform</h3>
            <p>Multi-role platform for appliance service businesses with customer booking, technician management, and admin dashboard.</p>
            <div class="project-tech">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
              <span>JWT Auth</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn btn-primary">View Live</a>
              <a href="#" class="btn btn-outline">GitHub</a>
            </div>
          </div>
        </div>

        <div class="project-card-large">
          <div class="project-info">
            <span class="project-category">E-Commerce</span>
            <h3>Multi-Vendor Marketplace</h3>
            <p>Full-featured marketplace with vendor dashboards, product management, order tracking, and payment integration.</p>
            <div class="project-tech">
              <span>React</span>
              <span>Express</span>
              <span>PostgreSQL</span>
              <span>Stripe</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn btn-primary">View Live</a>
              <a href="#" class="btn btn-outline">GitHub</a>
            </div>
          </div>
        </div>

        <div class="project-card-large">
          <div class="project-info">
            <span class="project-category">Full Stack</span>
            <h3>IMC Billing System</h3>
            <p>Comprehensive billing and inventory management system with analytics dashboard and reporting.</p>
            <div class="project-tech">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
              <span>Chart.js</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn btn-primary">View Live</a>
              <a href="#" class="btn btn-outline">GitHub</a>
            </div>
          </div>
        </div>

        <div class="project-card-large">
          <div class="project-info">
            <span class="project-category">Web App</span>
            <h3>HR Operations Dashboard</h3>
            <p>Employee management system with attendance tracking, leave management, and payroll workflow automation.</p>
            <div class="project-tech">
              <span>React</span>
              <span>Express</span>
              <span>MongoDB</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn btn-primary">View Live</a>
              <a href="#" class="btn btn-outline">GitHub</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,

  contact: () => `
    <div class="container section fade-up">
      <div class="page-title">
        <p class="eyebrow">Get In Touch</p>
        <h1>Let's Work Together</h1>
      </div>

      <div class="contact-grid">
        <div class="contact-info">
          <h2>Let's Connect</h2>
          <p>I'm always interested in hearing about new projects and opportunities. Feel free to reach out if you'd like to collaborate or just say hello!</p>
          
          <div class="contact-methods">
            <div class="contact-method">
              <span class="method-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>hello@ashutoshranjan.com</p>
              </div>
            </div>
            <div class="contact-method">
              <span class="method-icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>India (Remote Available)</p>
              </div>
            </div>
            <div class="contact-method">
              <span class="method-icon">💼</span>
              <div>
                <strong>Availability</strong>
                <p>Open for projects</p>
              </div>
            </div>
          </div>

          <div class="social-links">
            <a href="https://github.com" target="_blank" class="social-link">GitHub</a>
            <a href="https://linkedin.com" target="_blank" class="social-link">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" class="social-link">Twitter</a>
          </div>
        </div>

        <form class="contact-form" id="contactForm">
          <h2>Send a Message</h2>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required placeholder="Your name" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="your@email.com" />
          </div>
          <div class="form-group">
            <label for="projectType">Project Type</label>
            <select id="projectType" name="projectType" required>
              <option value="">Select project type</option>
              <option>Web Development</option>
              <option>Full-Stack Project</option>
              <option>Mobile App</option>
              <option>Consultation</option>
              <option>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="budget">Budget Range</label>
            <select id="budget" name="budget">
              <option value="">Select budget</option>
              <option>$500 - $2,000</option>
              <option>$2,000 - $5,000</option>
              <option>$5,000 - $10,000</option>
              <option>$10,000+</option>
            </select>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required placeholder="Tell me about your project..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Send Message</button>
          <p class="form-status" id="formStatus"></p>
        </form>
      </div>
    </div>
  `,

  admin: () => `
    <div class="container section fade-up">
      <div id="adminLogin">
        <div class="page-title">
          <p class="eyebrow">Admin Access</p>
          <h1>Sign in to view submissions</h1>
        </div>
        <div class="grid two">
          <form class="card form glass-card" id="adminLoginForm">
            <label for="adminEmail">Email</label>
            <input id="adminEmail" name="email" type="email" required />
            <label for="adminPassword">Password</label>
            <input id="adminPassword" name="password" type="password" required />
            <button type="submit" class="btn btn-primary">Login</button>
            <p class="form-status" id="adminLoginStatus"></p>
          </form>
        </div>
      </div>
      <div id="adminDashboard" style="display:none;">
        <div class="page-title">
          <p class="eyebrow">Admin Dashboard</p>
          <h1>Manage Your Submissions</h1>
        </div>
        <div class="admin-tabs" style="margin-bottom:2rem;">
          <button class="tab-btn active" data-admin-tab="submissions">Submissions</button>
          <button class="tab-btn" data-admin-tab="newsletter">Newsletter</button>
        </div>
        <div id="tab-submissions" class="admin-tab-content">
          <div class="grid two" style="margin-bottom:2rem;">
            <article class="card glass-card">
              <h3>Contact Messages <span id="contactCount">(0)</span></h3>
              <div id="contactList"></div>
            </article>
            <article class="card glass-card">
              <h3>Service Inquiries <span id="inquiryCount">(0)</span></h3>
              <div id="inquiryList"></div>
            </article>
          </div>
        </div>
        <div id="tab-newsletter" class="admin-tab-content" style="display:none;">
          <article class="card glass-card">
            <h3>Subscribers <span id="subscriberCount">(0)</span></h3>
            <div id="subscriberList"></div>
          </article>
        </div>
        <div style="margin-top:2rem;">
          <button class="btn btn-secondary" id="adminLogoutBtn">Logout</button>
        </div>
      </div>
    </div>
  `
};

// ============ ROUTES ============
const routes = [
  { path: '/', component: pages.home },
  { path: '/home', component: pages.home },
  { path: '/about', component: pages.about },
  { path: '/services', component: pages.services },
  { path: '/projects', component: pages.projects },
  { path: '/contact', component: pages.contact },
  { path: '/admin', component: pages.admin }
];

// ============ INITIALIZE APP ============
const router = new Router(routes);

// ============ SHARED FUNCTIONALITY ============
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");
const themeTrack = document.getElementById("themeTrack");
const themeThumb = document.getElementById("themeThumb");

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

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  
  const mutationObserver = new MutationObserver(() => {
    initScrollAnimations();
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
});

window.initScrollAnimations = initScrollAnimations;
