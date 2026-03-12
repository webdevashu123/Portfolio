// Toast Notification System
class Toast {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (this.container) return;
    
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.innerHTML = `
      <style>
        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
        }
        
        .toast {
          padding: 16px 20px;
          border-radius: 12px;
          background: var(--surface, #fff);
          border: 1px solid var(--stroke, #e0e0e0);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
        }
        
        .toast.success {
          border-left: 4px solid #10b981;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--surface, #fff));
        }
        
        .toast.error {
          border-left: 4px solid #ef4444;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), var(--surface, #fff));
        }
        
        .toast.warning {
          border-left: 4px solid #f59e0b;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), var(--surface, #fff));
        }
        
        .toast.info {
          border-left: 4px solid #3b82f6;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), var(--surface, #fff));
        }
        
        .toast-icon {
          font-size: 20px;
          flex-shrink: 0;
        }
        
        .toast-content {
          flex: 1;
        }
        
        .toast-title {
          font-weight: 700;
          margin-bottom: 4px;
          color: var(--text, #1a1a1a);
        }
        
        .toast-message {
          font-size: 14px;
          color: var(--muted, #666);
          line-height: 1.4;
        }
        
        .toast-close {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          opacity: 0.5;
          transition: opacity 0.2s;
          color: var(--muted, #666);
        }
        
        .toast-close:hover {
          opacity: 1;
        }
        
        .toast.removing {
          animation: toastSlideOut 0.3s ease forwards;
        }
        
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes toastSlideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100px);
          }
        }
        
        @media (max-width: 480px) {
          .toast-container {
            top: 16px;
            right: 16px;
            left: 16px;
            max-width: none;
          }
        }
      </style>
    `;
    document.body.appendChild(this.container);
  }

  show(options) {
    const { type = 'info', title = '', message = '', duration = 5000 } = options;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.remove(toast));

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }
  }

  remove(toast) {
    if (toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }

  success(message, title = 'Success') {
    this.show({ type: 'success', title, message });
  }

  error(message, title = 'Error') {
    this.show({ type: 'error', title, message });
  }

  warning(message, title = 'Warning') {
    this.show({ type: 'warning', title, message });
  }

  info(message, title = 'Info') {
    this.show({ type: 'info', title, message });
  }
}

// Initialize global toast instance
window.toast = new Toast();
