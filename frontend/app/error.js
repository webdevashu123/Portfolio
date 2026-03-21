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
          <h1 className="error-code">500</h1>
          <h2 className="error-title">Something Went Wrong</h2>
          <p className="error-message">
            The page hit an unexpected error. Please refresh or try again later.
          </p>
          <div className="error-actions">
            <button onClick={reset} className="btn btn-primary">
              Try Again
            </button>
            <Link href="/" className="btn btn-secondary">
              Go Home
            </Link>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <p className="error-message" style={{ fontSize: '0.95rem' }}>
              If this keeps happening, reach out at <a href="mailto:helloashutosh1@outlook.com">helloashutosh1@outlook.com</a>.
            </p>
            {error?.digest && (
              <details style={{ marginTop: '0.75rem' }}>
                <summary style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Technical details</summary>
                <code style={{ display: 'block', marginTop: '0.5rem' }}>{error.digest}</code>
              </details>
            )}
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
    </div>
  );
}




