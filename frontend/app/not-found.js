import Link from 'next/link';
import './globals.css';

export default function NotFound() {
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
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-message">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="error-actions">
            <Link href="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact Me
            </Link>
          </div>
        </div>

        <div className="quick-links">
          <p>Or explore:</p>
          <div className="quick-links-flex">
            <Link href="/about" className="chip">About</Link>
            <Link href="/services" className="chip">Services</Link>
            <Link href="/projects" className="chip">Projects</Link>
            <Link href="/contact" className="chip">Contact</Link>
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
