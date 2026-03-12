'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatbot from '../components/AIChatbot';

export default function Contact() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('Sending message...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus('Message sent successfully! I will get back to you soon.');
        setFormData({ name: '', email: '', projectType: '', budget: '', message: '' });
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Message sent successfully!', 'success');
        }
      } else {
        setFormStatus(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setFormStatus('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand">Ashutosh<span className="brand-dot">.</span>Ranjan</Link>
          <nav className={`nav ${mobileMenuOpen ? 'show' : ''}`} id="mainNav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/contact" className="active">Contact</Link>
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
          <p className="eyebrow">Let&apos;s Build Together</p>
          <h1>Open for full-time roles and freelance projects.</h1>
        </div>

        <section className="section fade-up">
          <div className="grid two" style={{ gap: '40px' }}>
            <div>
              <h2>Get In Touch</h2>
              <p style={{ marginTop: '1rem' }}>
                Have a project in mind? Let&apos;s discuss how I can help bring your ideas to life.
              </p>

              <div style={{ marginTop: '2rem' }}>
                <h3>Contact Info</h3>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.25rem' }}>📧</span>
                    <a href="mailto:hello@ashutoshranjan.com">hello@ashutoshranjan.com</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.25rem' }}>💼</span>
                    <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.25rem' }}>🐙</span>
                    <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3>How It Works</h3>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>1</span>
                    <div>
                      <strong>Discovery Call</strong>
                      <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>15-30 min call to discuss your project</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>2</span>
                    <div>
                      <strong>Proposal</strong>
                      <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Receive a detailed project plan</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>3</span>
                    <div>
                      <strong>Let&apos;s Build</strong>
                      <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Start development with regular updates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="card glass-card" onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Project Inquiry</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="projectType">Project Type</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option>Full-time Opportunity</option>
                    <option>Freelance Project</option>
                    <option>Contract Development</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>$500 - $2,000</option>
                    <option>$2,000 - $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Project Details</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%' }}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {formStatus && (
                  <p style={{ 
                    marginTop: '1rem', 
                    color: formStatus.includes('success') ? 'var(--success)' : 'var(--muted)',
                    textAlign: 'center'
                  }}>
                    {formStatus}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        <section className="section fade-up">
          <div className="cta-band">
            <div>
              <p className="eyebrow">Need Fast Execution?</p>
              <h2>Share your scope and I will send a practical execution plan.</h2>
              <p>Good fit for MVP builds, operations dashboards, and full stack product modules.</p>
            </div>
            <div className="hero-actions">
              <Link href="/projects" className="btn btn-primary">See Case Studies</Link>
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
              <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
              <a href="mailto:hello@ashutoshranjan.com">Email</a>
            </div>
          </div>
          <p className="copyright">
  © {new Date().getFullYear()} Ashutosh Ranjan · All rights reserved.
</p>
        </div>
      </footer>

      {/* AI Chatbot - Fixed position while scrolling */}
      <AIChatbot />
    </div>
  );
}
