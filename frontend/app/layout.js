import './globals.css';
import './extra-styles.css';
import Script from 'next/script';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';

export const metadata = {
  title: 'Ashutosh Ranjan | Full Stack Developer',
  description: 'Full stack developer and software engineer available for freelance and full-time opportunities. Building premium software products for startups and clients.',
  keywords: ['Full Stack Developer', 'Software Engineer', 'Freelancer', 'React', 'Node.js', 'MongoDB', 'Web Developer'],
  author: 'Ashutosh Ranjan',
  robots: 'index, follow',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ashutosh Ranjan | Full Stack Developer',
    description: 'Full stack developer building premium software products for startups and clients.',
    type: 'website',
    locale: 'en_US',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashutosh Ranjan | Full Stack Developer',
    description: 'Full stack developer building premium software products for startups and clients.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#0a8f6a" />
        
        {/* Security Meta Tags */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💻</text></svg>" />
      </head>
      <body suppressHydrationWarning>
        {SENTRY_DSN && (
          <>
            <Script
              src="https://browser.sentry-cdn.com/7.119.2/bundle.tracing.min.js"
              strategy="afterInteractive"
              crossOrigin="anonymous"
            />
            <Script
              id="sentry-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  if (window.Sentry) {
                    window.Sentry.init({
                      dsn: '${SENTRY_DSN}',
                      tracesSampleRate: 0.1,
                      environment: '${process.env.NODE_ENV || 'production'}'
                    });
                  }
                `,
              }}
            />
          </>
        )}

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', { send_page_view: true });
                `,
              }}
            />
          </>
        )}

        {children}
        
        {/* Toast notification container */}
        <div id="toast-container" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}></div>
        
        {/* Newsletter modal container */}
        <div id="newsletter-modal" style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9998,
          alignItems: 'center',
          justifyContent: 'center'
        }}></div>
        
        {/* Floating contact button container */}
        <div id="floating-contact"></div>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Toast notification system
              window.showToast = function(message, type) {
                type = type || 'info';
                const container = document.getElementById('toast-container');
                const toast = document.createElement('div');
                toast.style.cssText = 'padding: 12px 20px; background: ' + (type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6') + '; color: white; border-radius: 8px; font-size: 14px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease; cursor: pointer;';
                toast.textContent = message;
                toast.onclick = function() { toast.remove(); };
                container.appendChild(toast);
                setTimeout(function() {
                  toast.style.animation = 'slideOut 0.3s ease';
                  setTimeout(function() { toast.remove(); }, 300);
                }, 3000);
              };

              // Newsletter subscription
              window.subscribeNewsletter = function(email) {
                fetch('/api/newsletter/subscribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: email })
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                  if (data.success) {
                    window.showToast('Successfully subscribed!', 'success');
                  } else {
                    window.showToast(data.message || 'Subscription failed', 'error');
                  }
                })
                .catch(function() {
                  window.showToast('Something went wrong', 'error');
                });
              };

              // Track analytics
              window.trackEvent = function(eventType, data) {
                try {
                  if (window.gtag) {
                    window.gtag('event', eventType, data || {});
                  }
                } catch (e) {}
                fetch('/api/analytics/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    eventType: eventType,
                    page: window.location.pathname,
                    ...data
                  })
                }).catch(function() {});
              };

              // Initialize theme
              var savedTheme = localStorage.getItem('theme') || 'light';
              if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.setAttribute('data-theme', 'dark');
              } else {
                document.documentElement.setAttribute('data-theme', 'light');
              }

              // Add slide animations
              var style = document.createElement('style');
              style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
              document.head.appendChild(style);

              // Track page views
              window.trackEvent('page_view');
            `,
          }}
        />
      </body>
    </html>
  );
}
