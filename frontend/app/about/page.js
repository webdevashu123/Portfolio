'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatbot from '../components/AIChatbot';

export default function About() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    setNewsletterStatus('Subscribing...');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNewsletterStatus('Successfully subscribed!');
        setNewsletterEmail('');
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Thanks for subscribing!', 'success');
        }
      } else {
        setNewsletterStatus(result.message || 'Failed to subscribe');
      }
    } catch (error) {
      setNewsletterStatus('Something went wrong. Try again.');
    }
  };

  const handleResumeDownload = async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'download_resume', page: '/about' })
      });
      window.open('/api/resume/download', '_blank');
    } catch (error) {
      window.open('/api/resume/download', '_blank');
    }
  };

  const skills = [
    { name: 'React', level: 95 },
    { name: 'Next.js', level: 90 },
    { name: 'Node.js', level: 90 },
    { name: 'Express', level: 85 },
    { name: 'MongoDB', level: 88 },
    { name: 'PostgreSQL', level: 80 },
    { name: 'JavaScript', level: 95 },
    { name: 'TypeScript', level: 85 }
  ];

  const stats = [
    { number: '5+', label: 'Years', detail: 'Experience' },
    { number: '20+', label: 'Projects', detail: 'Completed' },
    { number: '15+', label: 'Happy', detail: 'Clients' },
    { number: '10+', label: 'Tech', detail: 'Stack' }
  ];

  return (
    <div className="page-container">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand">Ashutosh<span className="brand-dot">.</span>Ranjan</Link>
          <nav className={`nav ${mobileMenuOpen ? 'show' : ''}`} id="mainNav">
            <Link href="/">Home</Link>
            <Link href="/about" className="active">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/projects">Projects</Link>
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
        {/* Hero Banner */}
        <section className="about-hero fade-up">
          <div className="about-hero-content">
            <p className="eyebrow">About Me</p>
            <h1>Building practical products with <span className="gradient-text">clean architecture</span>.</h1>
            <p className="about-intro">
              Full stack developer who builds product-ready web applications from planning to deployment. 
              I specialize in creating scalable solutions that help businesses grow.
            </p>
          </div>
          <div className="about-hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-box">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-detail">{stat.label}<br/>{stat.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Availability Bar */}
        <section className="availability-bar fade-up">
          <div className="trust-row">
            <span>✅ Open for full-time roles</span>
            <span>✅ Available for freelance</span>
            <span>✅ Timezone-flexible</span>
            <span>✅ Weekly updates</span>
          </div>
          <span className="availability-pill">Available Now</span>
        </section>

        {/* Profile Section */}
        <section className="section fade-up">
          <div className="grid two">
            <article className="card glass-card profile-card">
              <div className="card-icon">👨‍💻</div>
              <h2>Profile</h2>
              <p>
                Full stack developer with a passion for building robust and scalable web applications. 
                I transform complex problems into elegant solutions.
              </p>
              <div className="profile-list">
                <div className="profile-item">
                  <span className="profile-icon">🎯</span>
                  <div>
                    <strong>What I Build</strong>
                    <p>SaaS dashboards, operations platforms, booking systems, and business tools.</p>
                  </div>
                </div>
                <div className="profile-item">
                  <span className="profile-icon">🚀</span>
                  <div>
                    <strong>Current Focus</strong>
                    <p>Open for full-time roles and freelance product development.</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="card glass-card">
              <div className="card-icon">🎓</div>
              <h2>Education</h2>
              <div className="education-list">
                <div className="education-item">
                  <div className="education-year">2025 - 2027</div>
                  <h3>MCA</h3>
                  <p>Master of Computer Applications</p>
                  <span className="education-status">Ongoing</span>
                </div>
                <div className="education-item">
                  <div className="education-year">2020 - 2023</div>
                  <h3>BCA</h3>
                  <p>Bachelor of Computer Applications</p>
                  <span className="education-status completed">Completed</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Skills Section */}
        <section className="section fade-up">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="eyebrow">Expertise</p>
            <h2>Technical Skills</h2>
          </div>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Approach */}
        <section className="section fade-up">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="eyebrow">Process</p>
            <h2>How I Work</h2>
          </div>
          <div className="grid three">
            <article className="card glass-card approach-card">
              <div className="approach-number">01</div>
              <h3>Discovery</h3>
              <p>Understand goals, users, and scope. Convert ideas into technical tasks with clear requirements.</p>
              <div className="approach-icon">🔍</div>
            </article>
            <article className="card glass-card approach-card">
              <div className="approach-number">02</div>
              <h3>Development</h3>
              <p>Build in milestones, keep code modular, maintain clean architecture, provide progress updates.</p>
              <div className="approach-icon">⚙️</div>
            </article>
            <article className="card glass-card approach-card">
              <div className="approach-number">03</div>
              <h3>Launch</h3>
              <p>Deploy with monitoring and documentation, then support improvements based on user feedback.</p>
              <div className="approach-icon">🚀</div>
            </article>
          </div>
        </section>

        {/* Principles */}
        <section className="section fade-up">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="eyebrow">Values</p>
            <h2>Collaboration Principles</h2>
          </div>
          <div className="grid three">
            <article className="card glass-card principle-card">
              <span className="principle-index">01</span>
              <h3>Clarity First</h3>
              <p>Features are scoped into measurable milestones before implementation starts.</p>
            </article>
            <article className="card glass-card principle-card">
              <span className="principle-index">02</span>
              <h3>Execution</h3>
              <p>Consistent sprint rhythm, clean PR-level changes, and early risk communication.</p>
            </article>
            <article className="card glass-card principle-card">
              <span className="principle-index">03</span>
              <h3>Business Context</h3>
              <p>Engineering decisions are tied to product outcomes and long-term maintainability.</p>
            </article>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section fade-up">
          <div className="cta-band">
            <div>
              <p className="eyebrow">Let&apos;s Work Together</p>
              <h2>Ready to bring your project to life?</h2>
              <p>I&apos;m available for full-time roles and freelance projects.</p>
            </div>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={handleResumeDownload}>Download Resume</button>
              <Link href="/contact" className="btn btn-secondary">Get In Touch</Link>
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

      <AIChatbot />
    </div>
  );
}




