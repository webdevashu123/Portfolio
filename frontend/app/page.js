'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatbot from './components/AIChatbot';
import './globals.css';

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const roles = ['Full Stack Developer', 'Software Engineer', 'Freelancer'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout;

    if (!isDeleting) {
      if (charIndex < currentRole.length) {
        timeout = setTimeout(() => {
          setTypedText(currentRole.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 80);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setTypedText(currentRole.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((roleIndex + 1) % roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

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

  const handleResumeDownload = () => {
    window.open('/resume.pdf', '_blank');
  };

  return (
    <div className="page-container">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand">
            Ashutosh<span className="brand-dot">.</span>Ranjan
          </Link>
          <nav className={`nav ${mobileMenuOpen ? 'show' : ''}`} id="mainNav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
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

      <main className="home-page">
        {/* Hero Section */}
        <section className="hero container">
          <div className="hero-content">
            <p className="eyebrow">Hello, I&apos;m</p>
            <h1 className="hero-title">
              Ashutosh Ranjan
            </h1>
            <div className="hero-typed">
              <span className="gradient-text">
                {typedText}<span className="typing-cursor">|</span>
              </span>
            </div>
            <p className="hero-description">
              I build exceptional digital experiences that help businesses grow. 
              Specialized in full-stack development with a focus on scalable architectures 
              and user-centric design.
            </p>
            <div className="hero-actions">
              <Link href="/projects" className="btn btn-primary">View My Work</Link>
              <Link href="/contact" className="btn btn-outline">Get In Touch</Link>
              <button className="resume-btn" onClick={handleResumeDownload}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Download CV
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">20+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-code-window">
              <div className="window-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <pre className="code-content">
                <code>{`const developer = {
  name: "Ashutosh Ranjan",
  role: "Full Stack Developer",
  skills: [
  "React", "Node.js", 
  "MongoDB", "Next.js"
  ],
  available: true
};

function buildAmazingProduct() {
  return new Product({
    scalable: true,
    maintainable: true,
    userFocused: true
  });
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="trust-strip">
          <div className="container">
            <div className="trust-items">
              <span className="trust-item">🚀 Production-ready code</span>
              <span className="trust-item">📈 Scalable architecture</span>
              <span className="trust-item">🔒 Security best practices</span>
              <span className="trust-item">⚡ Fast performance</span>
              <span className="trust-item">💼 Clean code</span>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="container section fade-up">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="eyebrow">What I Do</p>
            <h2>Bringing Ideas to Life</h2>
          </div>
          <div className="grid three">
            <article className="card glass-card service-card">
              <div className="service-icon">💻</div>
              <h3>Web Development</h3>
              <p>Custom websites and web applications built with modern technologies.</p>
              <span className="service-tag">Frontend</span>
            </article>
            <article className="card glass-card service-card">
              <div className="service-icon">⚡</div>
              <h3>Full-Stack</h3>
              <p>End-to-end development from database to intuitive user interfaces.</p>
              <span className="service-tag">Backend</span>
            </article>
            <article className="card glass-card service-card">
              <div className="service-icon">🚀</div>
              <h3>Performance</h3>
              <p>Speed up your applications for better user experience.</p>
              <span className="service-tag">Optimization</span>
            </article>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/services" className="btn btn-secondary">View All Services</Link>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="container section fade-up">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="eyebrow">Portfolio</p>
            <h2>Recent Projects</h2>
          </div>
          <div className="grid two">
            <article className="card glass-card project-card">
              <span className="project-category">Full Stack</span>
              <h3>ServiGo</h3>
              <p>Multi-role appliance service platform with real-time tracking and admin dashboard.</p>
              <div className="project-tech">
                <span className="chip">React</span>
                <span className="chip">Node.js</span>
                <span className="chip">MongoDB</span>
              </div>
              <Link href="/projects" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>View Details</Link>
            </article>
            <article className="card glass-card project-card">
              <span className="project-category">E-Commerce</span>
              <h3>Marketplace</h3>
              <p>Full-featured marketplace with vendor dashboards and payment integration.</p>
              <div className="project-tech">
                <span className="chip">React</span>
                <span className="chip">Express</span>
                <span className="chip">PostgreSQL</span>
              </div>
              <Link href="/projects" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>View Details</Link>
            </article>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/projects" className="btn btn-outline">View All Projects</Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container section fade-up">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="eyebrow">Testimonials</p>
            <h2>What Clients Say</h2>
          </div>
          <div className="grid two">
            <div className="testimonial-card">
              <p>Ashutosh delivered our project on time and exceeded expectations. His technical skills made the entire process smooth.</p>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div className="author-info">
                  <strong>Startup Founder</strong>
                  <span>Tech Startup</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>Excellent developer! Understood our requirements perfectly and delivered a high-quality product. Highly recommended!</p>
              <div className="testimonial-author">
                <div className="author-avatar">R</div>
                <div className="author-info">
                  <strong>Operations Manager</strong>
                  <span>Service Company</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="container section fade-up">
          <div className="newsletter-section">
            <h2>Stay Updated</h2>
            <p>Subscribe to my newsletter for the latest updates.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            {newsletterStatus && (
              <p style={{ marginTop: '1rem', color: newsletterStatus.includes('Successfully') ? 'var(--success)' : 'var(--muted)' }}>
                {newsletterStatus}
              </p>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container section fade-up">
          <div className="cta-band">
            <div>
              <p className="eyebrow">Let&apos;s Build Together</p>
              <h2>Have a project in mind?</h2>
              <p>I&apos;d love to hear about it. Let&apos;s discuss how I can help.</p>
            </div>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">Start a Conversation</Link>
              <Link href="/projects" className="btn btn-secondary">View My Work</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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




