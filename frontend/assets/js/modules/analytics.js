// Analytics Tracking Module
class Analytics {
  constructor() {
    this.sessionId = this.getSessionId();
    this.pageViewTracked = false;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = 's_' + Math.random().toString(36).substr(2, 9) + Date.now();
      sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
  }

  async track(eventType, data = {}) {
    try {
      const payload = {
        eventType,
        page: window.location.pathname,
        ...data,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      };

      // Fire and forget - don't block UI
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {}); // Silently fail
    } catch (e) {
      // Ignore errors
    }
  }

  trackPageView() {
    if (this.pageViewTracked) return;
    this.pageViewTracked = true;
    this.track('page_view');
  }

  trackProjectView(projectId) {
    this.track('project_view', { projectId });
  }

  trackResumeDownload() {
    this.track('download_resume');
  }

  trackContactClick() {
    this.track('contact_click');
  }

  trackExternalLink(url) {
    this.track('external_link', { url });
  }

  init() {
    // Track page view on load
    this.trackPageView();

    // Track external link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[target="_blank"]');
      if (link && link.href) {
        this.trackExternalLink(link.href);
      }
    });

    // Track resume download
    const resumeLinks = document.querySelectorAll('a[href*="resume"]');
    resumeLinks.forEach(link => {
      link.addEventListener('click', () => this.trackResumeDownload());
    });

    // Track contact button clicks
    const contactButtons = document.querySelectorAll('[data-contact-trigger]');
    contactButtons.forEach(btn => {
      btn.addEventListener('click', () => this.trackContactClick());
    });
  }
}

// Initialize global analytics
window.analytics = new Analytics();

document.addEventListener('DOMContentLoaded', () => {
  window.analytics.init();
});
