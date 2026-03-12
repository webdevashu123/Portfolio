// Newsletter Form Component
class NewsletterForm {
  constructor() {
    this.forms = [];
  }

  init() {
    // Find all newsletter forms on the page
    const forms = document.querySelectorAll('.newsletter-form, [data-newsletter]');
    forms.forEach(form => this.setupForm(form));
    
    // Also create a floating newsletter widget if not present
    if (forms.length === 0) {
      this.createFloatingWidget();
    }
  }

  setupForm(form) {
    if (form.dataset.newsletterInitialized) return;
    form.dataset.newsletterInitialized = 'true';

    const status = form.querySelector('.newsletter-status') || document.createElement('p');
    status.className = 'newsletter-status';
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]')?.value?.trim();
      
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        this.showStatus(form, 'Please enter a valid email address.', 'error');
        return;
      }

      this.showStatus(form, 'Subscribing...', 'info');
      
      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (result.success) {
          this.showStatus(form, '🎉 Successfully subscribed! Check your email.', 'success');
          form.reset();
          if (window.toast) {
            window.toast.success('Welcome to the newsletter!', 'Subscribed');
          }
        } else {
          this.showStatus(form, result.message || 'Failed to subscribe.', 'error');
        }
      } catch (error) {
        this.showStatus(form, 'Network error. Please try again.', 'error');
      }
    });
  }

  showStatus(form, message, type) {
    let status = form.querySelector('.newsletter-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'newsletter-status';
      form.appendChild(status);
    }
    status.textContent = message;
    status.className = `newsletter-status ${type}`;
  }

  createFloatingWidget() {
    // Only create if not on contact page
    if (window.location.pathname.includes('contact')) return;

    const widget = document.createElement('div');
    widget.className = 'newsletter-widget';
    widget.innerHTML = `
      <style>
        .newsletter-widget {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 100;
        }
        
        .newsletter-toggle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 8px 24px rgba(10, 143, 106, 0.35);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .newsletter-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(10, 143, 106, 0.45);
        }
        
        .newsletter-popup {
          position: absolute;
          bottom: 72px;
          left: 0;
          width: 320px;
          background: var(--surface, #fff);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px) scale(0.95);
          transition: all 0.3s ease;
          border: 1px solid var(--stroke, #e0e0e0);
        }
        
        .newsletter-popup.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        
        .newsletter-popup h3 {
          font-family: "Space Grotesk", sans-serif;
          margin: 0 0 8px;
          font-size: 1.1rem;
          color: var(--text, #1a1a1a);
        }
        
        .newsletter-popup p {
          font-size: 0.85rem;
          color: var(--muted, #666);
          margin: 0 0 16px;
          line-height: 1.4;
        }
        
        .newsletter-popup form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .newsletter-popup input {
          padding: 10px 14px;
          border: 1px solid var(--stroke, #e0e0e0);
          border-radius: 8px;
          font-size: 0.9rem;
          background: var(--bg, #f9fafb);
          color: var(--text, #1a1a1a);
        }
        
        .newsletter-popup input:focus {
          outline: none;
          border-color: var(--primary, #0a8f6a);
        }
        
        .newsletter-popup button {
          padding: 10px;
          background: var(--primary, #0a8f6a);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .newsletter-popup button:hover {
          background: var(--primary-dark, #066149);
        }
        
        .newsletter-status {
          font-size: 0.8rem;
          text-align: center;
          margin: 0;
        }
        
        .newsletter-status.success { color: #059669; }
        .newsletter-status.error { color: #dc2626; }
        
        @media (max-width: 480px) {
          .newsletter-widget {
            bottom: 16px;
            left: 16px;
          }
          
          .newsletter-popup {
            width: 280px;
          }
        }
      </style>
      
      <div class="newsletter-popup" id="newsletterPopup">
        <h3>📬 Stay Updated!</h3>
        <p>Get notified about new projects, technical insights, and freelance opportunities.</p>
        <form class="newsletter-form" data-newsletter>
          <input type="email" placeholder="Your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
      
      <button class="newsletter-toggle" aria-label="Newsletter">✉️</button>
    `;
    
    document.body.appendChild(widget);
    
    const toggle = widget.querySelector('.newsletter-toggle');
    const popup = widget.querySelector('.newsletter-popup');
    
    toggle.addEventListener('click', () => {
      popup.classList.toggle('active');
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target)) {
        popup.classList.remove('active');
      }
    });
    
    // Initialize form
    this.setupForm(popup.querySelector('form'));
  }
}

window.newsletterForm = new NewsletterForm();
document.addEventListener('DOMContentLoaded', () => window.newsletterForm.init());
