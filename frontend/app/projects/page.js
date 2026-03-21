'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatbot from '../components/AIChatbot';

export default function Projects() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const projects = [
    {
      id: 'servigo',
      title: 'ServiGo',
      subtitle: 'Multi-Role Service Platform',
      description: 'Comprehensive appliance service management platform with caller booking, technician tracking, and admin operations.',
      features: [
        'Multi-role access (Caller, Technician, Admin)',
        'Caller booking with mobile number lookup',
        'Technician status lifecycle management',
        'Support desk operations',
        'JWT + RBAC authentication',
        'Firebase OTP integration'
      ],
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Firebase'],
      category: 'fullstack'
    },
    {
      id: 'imc',
      title: 'IMC Billing System',
      subtitle: 'Billing & Inventory Management',
      description: 'Complete billing solution with inventory tracking and analytics for service operations.',
      features: [
        'Multi-customer billing',
        'Inventory management',
        'Real-time analytics dashboard',
        'Payment tracking',
        'Report generation'
      ],
      stack: ['React', 'Express', 'MongoDB', 'Chart.js'],
      category: 'fullstack'
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce Platform',
      subtitle: 'Multi-Vendor Marketplace',
      description: 'Full-featured marketplace with vendor dashboards, product management, and order tracking.',
      features: [
        'Multi-vendor support',
        'Product management',
        'Order tracking',
        'Payment integration',
        'Vendor dashboards'
      ],
      stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      category: 'fullstack'
    },
    {
      id: 'hr-dashboard',
      title: 'HR Operations Dashboard',
      subtitle: 'Attendance & Payroll System',
      description: 'Comprehensive HR solution with attendance tracking, leave management, and payroll processing.',
      features: [
        'Employee management',
        'Attendance tracking',
        'Leave management',
        'Payroll processing',
        'Report generation'
      ],
      stack: ['React', 'Express', 'MongoDB', 'Chart.js'],
      category: 'fullstack'
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="page-container">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand">Ashutosh<span className="brand-dot">.</span>Ranjan</Link>
          <nav className={`nav ${mobileMenuOpen ? 'show' : ''}`} id="mainNav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/projects" className="active">Projects</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              <span id="themeTrack" className={isDark ? 'on' : ''}>
                <span className="toggle-icon sun">☀</span>
                <span className="toggle-icon moon">☾</span>
                <span id="themeThumb" className={isDark ? 'on' : ''}></span>
              </span>
            </button>
            <button 
              className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Toggle Menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <main className="container section">
        <div className="page-title fade-up">
          <p className="eyebrow">Portfolio</p>
          <h1>Projects I&apos;ve Built</h1>
        </div>

        <section className="section fade-up">
          <div className="project-toolbar" style={{ marginBottom: '2rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('all')}
            >
              All Projects
            </button>
            <button 
              className={`btn ${filter === 'fullstack' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('fullstack')}
            >
              Full Stack
            </button>
            <button 
              className={`btn ${filter === 'frontend' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('frontend')}
            >
              Frontend
            </button>
          </div>

          <div className="grid two">
            {filteredProjects.map((project) => (
              <article key={project.id} className="card glass-card project-card">
                <span className="project-category">{project.category}</span>
                <h3>{project.title}</h3>
                <p className="project-subtitle">{project.subtitle}</p>
                <p>{project.description}</p>
                <div className="project-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {project.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="project-stack">
                  {project.stack.map((tech, idx) => (
                    <span key={idx} className="chip">{tech}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section fade-up">
          <div className="cta-band">
            <div>
              <p className="eyebrow">Have a Project?</p>
              <h2>Let&apos;s build something amazing together.</h2>
              <p>Whether you need a new product or have an existing project to enhance.</p>
            </div>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">Start a Project</Link>
              <Link href="/services" className="btn btn-secondary">View Services</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <strong>Ashutosh Ranjan</strong>
              <p>Full Stack Developer</p>
            </div>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/services">Services</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-social">
  <a href="https://github.com/webdevashu123" target="_blank" rel="noopener" aria-label="GitHub">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.74.5 12.04c0 5.11 3.29 9.44 7.86 10.97.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.72.08-.71.08-.71 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.73-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.07 0 0 .96-.31 3.14 1.18a10.8 10.8 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.6.23 2.78.11 3.07.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.35.78 1.04.78 2.11v3.12c0 .31.21.67.8.56 4.57-1.53 7.86-5.86 7.86-10.97C23.5 5.74 18.27.5 12 .5z" />
    </svg>
    <span>GitHub</span>
  </a>
  <a href="https://www.linkedin.com/in/ashutosh-ranjan-dev/" target="_blank" rel="noopener" aria-label="LinkedIn">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C3.33 3.5 2 4.85 2 6.5s1.33 3 2.98 3h.02c1.66 0 3-1.35 3-3s-1.34-3-3.02-3zM2.4 21.5h5.17V9.74H2.4V21.5zM9.58 9.74v11.76h5.17v-6.56c0-3.47 4.52-3.75 4.52 0v6.56H24V13.1c0-6.2-6.64-5.97-8.78-2.92V9.74H9.58z" />
    </svg>
    <span>LinkedIn</span>
  </a>
  <a href="mailto:helloashutosh1@outlook.com" aria-label="Email">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.2-8 5-8-5V6l8 5 8-5v2.2z" />
    </svg>
    <span>Email</span>
  </a>
</div>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} Ashutosh Ranjan. All rights reserved.
          </p>
        </div>
      </footer>

      {/* AI Chatbot - Fixed position while scrolling */}
      <AIChatbot />
    </div>
  );
}




