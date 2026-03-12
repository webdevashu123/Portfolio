'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="page-container">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand">
            Ashutosh<span className="brand-dot">.</span>Ranjan
          </Link>
        </div>
      </header>

      <main className="container section error-page">
        <div className="error-content">
          <h1 className="error-code">Oops!</h1>
          <h2 className="error-title">Something Went Wrong</h2>
          <p className="error-message">
            We encountered an unexpected error. Please try again or return to the homepage.
          </p>
          <div className="error-actions">
            <button onClick={reset} className="btn btn-primary">
              Try Again
            </button>
            <Link href="/" className="btn btn-secondary">
              Go Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-wrap">
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
    </div>
  );
}
