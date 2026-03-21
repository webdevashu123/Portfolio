'use client';

export default function Loading() {
  return (
    <div className="page-container">
      <main className="container section loading-page">
        <div className="loading-shell">
          <div className="loader-orbit" aria-hidden="true">
            <span className="loader-ring"></span>
            <span className="loader-ring ring-2"></span>
            <span className="loader-ring ring-3"></span>
            <span className="loader-core"></span>
          </div>
          <div className="loading-text">
            <span>Loading</span>
            <span className="dot">.</span>
            <span className="dot dot-2">.</span>
            <span className="dot dot-3">.</span>
          </div>
          <p className="loading-sub">Preparing your experience</p>
        </div>
      </main>
    </div>
  );
}
