// Contact Modal Component
class ContactModal {
  constructor() {
    this.modal = null;
    this.isOpen = false;
  }

  init() {
    if (this.modal) return;
    
    this.modal = document.createElement('div');
    this.modal.className = 'contact-modal-overlay';
    this.modal.innerHTML = `
      <style>
        .contact-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .contact-modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        .contact-modal {
          background: var(--surface, #fff);
          border-radius: 20px;
          max-width: 520px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          transform: scale(0.9) translateY(20px);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .contact-modal-overlay.active .contact-modal {
          transform: scale(1) translateY(0);
        }
        
        .modal-header {
          padding: 24px 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .modal-title {
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text, #1a1a1a);
          margin: 0;
        }
        
        .modal-subtitle {
          color: var(--muted, #666);
          margin-top: 4px;
          font-size: 0.9rem;
        }
        
        .modal-close {
          background: var(--bg-soft, #f5f5f5);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.2s;
          color: var(--text, #1a1a1a);
        }
        
        .modal-close:hover {
          background: var(--stroke, #e0e0e0);
          transform: rotate(90deg);
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .modal-form {
          display: grid;
          gap: 16px;
        }
        
        .form-group {
          display: grid;
          gap: 6px;
        }
        
        .form-group label {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text, #1a1a1a);
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 14px;
          border: 1px solid var(--stroke, #e0e0e0);
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.95rem;
          background: var(--bg, #f9fafb);
          color: var(--text, #1a1a1a);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary, #0a8f6a);
          box-shadow: 0 0 0 3px rgba(10, 143, 106, 0.15);
        }
        
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .modal-form .btn {
          margin-top: 8px;
          width: 100%;
          padding: 14px;
          font-size: 1rem;
        }
        
        .form-status {
          text-align: center;
          font-weight: 600;
          min-height: 24px;
          padding: 8px;
          border-radius: 8px;
        }
        
        .form-status.success {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }
        
        .form-status.error {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
        
        @media (max-width: 480px) {
          .contact-modal {
            max-height: 95vh;
            border-radius: 16px 16px 0 0;
            position: absolute;
            bottom: 0;
          }
          
          .contact-modal-overlay {
            align-items: flex-end;
          }
          
          .contact-modal-overlay.active .contact-modal {
            transform: translateY(0);
          }
        }
      </style>
      
      <div class="contact-modal">
        <div class="modal-header">
          <div>
            <h2 class="modal-title">Let's Work Together</h2>
            <p class="modal-subtitle">Share your project details and I'll get back to you within 24 hours.</p>
          </div>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <form class="modal-form" id="modalContactForm">
            <div class="form-group">
              <label for="modalName">Name *</label>
              <input type="text" id="modalName" name="name" required placeholder="Your name" />
            </div>
            <div class="form-group">
              <label for="modalEmail">Email *</label>
              <input type="email" id="modalEmail" name="email" required placeholder="you@example.com" />
            </div>
            <div class="form-group">
              <label for="modalProjectType">Project Type *</label>
              <select id="modalProjectType" name="projectType" required>
                <option value="">Select a project type</option>
                <option>Full-time Opportunity</option>
                <option>Freelance Project</option>
                <option>Contract Development</option>
                <option>Consulting</option>
              </select>
            </div>
            <div class="form-group">
              <label for="modalMessage">Project Details *</label>
              <textarea id="modalMessage" name="message" required placeholder="Tell me about your project..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Message</button>
            <p class="form-status" id="modalFormStatus"></p>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.modal);
    
    // Event listeners
    const closeBtn = this.modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.close());
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    
    // Form submission
    const form = this.modal.querySelector('#modalContactForm');
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    if (!this.modal) this.init();
    this.isOpen = true;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modal) return;
    this.isOpen = false;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('modalFormStatus');
    
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      projectType: form.projectType.value,
      message: form.message.value.trim()
    };
    
    if (!formData.name || !formData.email || !formData.message) {
      status.textContent = 'Please fill in all required fields.';
      status.className = 'form-status error';
      return;
    }
    
    status.textContent = 'Sending...';
    status.className = 'form-status';
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        status.textContent = 'Message sent successfully! I\'ll be in touch soon.';
        status.className = 'form-status success';
        form.reset();
        setTimeout(() => this.close(), 2000);
      } else {
        status.textContent = result.message || 'Failed to send message. Please try again.';
        status.className = 'form-status error';
      }
    } catch (error) {
      status.textContent = 'Network error. Please try again.';
      status.className = 'form-status error';
    }
  }
}

// Initialize global contact modal
window.contactModal = new ContactModal();

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.contactModal.init();
});
