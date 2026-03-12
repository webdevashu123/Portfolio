'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatbot from '../components/AIChatbot';

export default function Services() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const services = [
    {
      icon: '💻',
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies. From landing pages to complex web apps.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Cross-browser Compatible', 'CMS Integration'],
      price: {
        india: '₹25,000',
        international: '$420',
        period: 'Starting'
      },
      popular: false
    },
    {
      icon: '⚡',
      title: 'Full-Stack Development',
      description: 'End-to-end development from database design to intuitive user interfaces. Complete product solutions.',
      features: ['RESTful APIs', 'Database Design', 'Authentication', 'Admin Dashboards', 'Payment Integration'],
      price: {
        india: '₹85,000',
        international: '$1,150',
        period: 'Starting'
      },
      popular: true
    },
    {
      icon: '🔧',
      title: 'API Development',
      description: 'Robust and scalable APIs for your applications. REST and GraphQL services built to enterprise standards.',
      features: ['REST & GraphQL', 'Documentation', 'Rate Limiting', 'Security Best Practices', 'Testing'],
      price: {
        india: '₹45,000',
        international: '$650',
        period: 'Starting'
      },
      popular: false
    },
    {
      icon: '🚀',
      title: 'Performance Optimization',
      description: 'Speed up your existing applications for better user experience and SEO rankings.',
      features: ['Code Optimization', 'Caching Strategies', 'Image Optimization', 'Core Web Vitals', 'CDN Setup'],
      price: {
        india: '₹35,000',
        international: '$500',
        period: 'Starting'
      },
      popular: false
    },
    {
      icon: '🔒',
      title: 'Security Audit',
      description: 'Comprehensive security review of your web applications to identify vulnerabilities.',
      features: ['Code Review', 'Penetration Testing', 'Security Report', 'Remediation Guide', 'Best Practices'],
      price: {
        india: '₹40,000',
        international: '$580',
        period: 'Starting'
      },
      popular: false
    },
    {
      icon: '📱',
      title: 'Maintenance & Support',
      description: 'Ongoing maintenance and support for your existing applications.',
      features: ['Bug Fixes', 'Feature Updates', 'Performance Monitoring', 'Technical Support', 'Security Updates'],
      price: {
        india: '₹10,000/mo',
        international: '$150/mo',
        period: 'Monthly'
      },
      popular: false
    },
  ];

  return (
    <div className="page-container">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand">Ashutosh<span className="brand-dot">.</span>Ranjan</Link>
          <nav className={`nav ${mobileMenuOpen ? 'show' : ''}`} id="mainNav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services" className="active">Services</Link>
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
        <div className="page-title fade-up">
          <p className="eyebrow">Services</p>
          <h1>Professional Services for <span className="gradient-text">Your Business</span></h1>
          <p className="page-subtitle">Transparent pricing for Indian & International clients</p>
        </div>

        {/* Pricing Toggle Info */}
        <section className="pricing-info fade-up">
          <div className="pricing-badges">
            <span className="pricing-badge">
              <span className="badge-icon">IN</span> India
            </span>
            <span className="pricing-badge">
              <span className="badge-icon">🌍</span> International
            </span>
          </div>
        </section>

        <section className="section fade-up">
          <div className="grid three">
            {services.map((service, index) => (
              <article key={index} className={`card glass-card service-card ${service.popular ? 'popular' : ''}`}>
                {service.popular && <span className="popular-tag">Most Popular</span>}
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-features">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="feature-check">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {/* Price Section - Polished */}
                <div className="price-section">
                  <span className="price-period">{service.price.period}</span>
                  <div className="price-amounts">
                    <div className="price-india">
                      <span className="currency"></span>
                      <span className="amount">{service.price.india}</span>
                    </div>
                    <div className="price-divider">or</div>
                    <div className="price-international">
                      <span className="currency"></span>
                      <span className="amount">{service.price.international}</span>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact" className="btn btn-secondary service-btn">
                  Get Started
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="section fade-up">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="eyebrow">Why Choose Me</p>
            <h2>Working With Me</h2>
          </div>
          <div className="grid three">
            <div className="card glass-card benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Clear Communication</h3>
              <p>Regular updates and transparent progress reporting on your project.</p>
            </div>
            <div className="card glass-card benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>On-time delivery with efficient project management.</p>
            </div>
            <div className="card glass-card benefit-card">
              <div className="benefit-icon">🔧</div>
              <h3>Post-Launch Support</h3>
              <p>Free support period after project delivery.</p>
            </div>
          </div>
        </section>

        <section className="section fade-up">
          <div className="cta-band">
            <div>
              <p className="eyebrow">Custom Project?</p>
              <h2>Need something unique?</h2>
              <p>Let&apos;s discuss your specific requirements and find the best solution.</p>
            </div>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">Get a Quote</Link>
              <Link href="/projects" className="btn btn-secondary">View Projects</Link>
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
            © {new Date().getFullYear()} Ashutosh Ranjan. All rights reserved.
          </p>
        </div>
      </footer>

      <AIChatbot />
    </div>
  );
}
