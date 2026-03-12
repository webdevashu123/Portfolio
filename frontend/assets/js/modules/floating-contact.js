// Floating Contact Button
class FloatingContact {
  constructor() {
    this.button = null;
    this.isVisible = false;
  }

  init() {
    // Don't show on contact page
    if (window.location.pathname.includes('contact')) return;

    this.createButton();
    this.initScrollListener();
  }

  createButton() {
    this.button = document.createElement('div');
    this.button.className = 'floating-contact';
    this.button.innerHTML = `
      <style>
        .floating-contact {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }
        
        .floating-contact-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 8px 24px rgba(10, 143, 106, 0.4);
          transition: transform 0.3s, box-shadow 0.3s;
          color: white;
        }
        
        .floating-contact-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(10, 143, 106, 0.5);
        }
        
        .floating-contact-btn svg {
          width: 28px;
          height: 28px;
          fill: white;
        }
        
        .floating-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px) scale(0.9);
          transition: all 0.3s ease;
        }
        
        .floating-menu.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        
        .floating-menu-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: var(--surface);
          border: 1px solid var(--stroke);
          border-radius: 30px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        
        .floating-menu-btn:hover {
          transform: translateX(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .floating-menu-btn svg {
          width: 20px;
          height: 20px;
          fill: var(--primary);
        }
        
        @media (max-width: 480px) {
          .floating-contact {
            bottom: 16px;
            right: 16px;
          }
        }
      </style>
      
      <div class="floating-menu" id="floatingMenu">
        <button class="floating-menu-btn" data-action="contact">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          Send Message
        </button>
        <button class="floating-menu-btn" data-action="email">
          <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          hello@ashudev.com
        </button>
        <button class="floating-menu-btn" data-action="whatsapp">
          <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </button>
      </div>
      
      <button class="floating-contact-btn" id="floatingContactBtn" aria-label="Contact Options">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      </button>
    `;
    
    document.body.appendChild(this.button);
    
    const btn = this.button.querySelector('#floatingContactBtn');
    const menu = this.button.querySelector('#floatingMenu');
    
    btn.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
    
    menu.querySelectorAll('.floating-menu-btn').forEach(menuBtn => {
      menuBtn.addEventListener('click', () => {
        const action = menuBtn.dataset.action;
        
        if (action === 'contact') {
          if (window.contactModal) {
            window.contactModal.open();
          } else {
            window.location.href = 'contact.html';
          }
        } else if (action === 'email') {
          window.location.href = 'mailto:hello@ashudev.com';
        } else if (action === 'whatsapp') {
          window.open('https://wa.me/91XXXXXXXXXX', '_blank');
        }
        
        menu.classList.remove('active');
      });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!this.button.contains(e.target)) {
        menu.classList.remove('active');
      }
    });
  }

  initScrollListener() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 300 && !this.isVisible) {
        this.isVisible = true;
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
      } else if (currentScroll <= 300 && this.isVisible) {
        this.isVisible = false;
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
      }
      
      lastScroll = currentScroll;
    });
    
    // Initial state
    this.button.style.opacity = '0';
    this.button.style.visibility = 'hidden';
  }
}

window.floatingContact = new FloatingContact();
document.addEventListener('DOMContentLoaded', () => window.floatingContact.init());
