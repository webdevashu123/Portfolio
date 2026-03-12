// Loading Skeleton Component
class Skeleton {
  static createCard(width = '100%', height = '200px') {
    return `
      <div class="skeleton-card" style="width: ${width}; height: ${height};">
        <div class="skeleton-shimmer"></div>
      </div>
    `;
  }

  static createText(lines = 3) {
    let html = '';
    for (let i = 0; i < lines; i++) {
      const width = i === lines - 1 ? '70%' : '100%';
      html += `<div class="skeleton-line" style="width: ${width};"></div>`;
    }
    return `<div class="skeleton-text">${html}</div>`;
  }

  static createCircle(size = '60px') {
    return `<div class="skeleton-circle" style="width: ${size}; height: ${size};"></div>`;
  }

  static createButton(width = '120px', height = '44px') {
    return `<div class="skeleton-button" style="width: ${width}; height: ${height};"></div>`;
  }

  static show(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <style>
        .skeleton-card,
        .skeleton-line,
        .skeleton-circle,
        .skeleton-button {
          background: linear-gradient(90deg, 
            var(--bg-soft, #e8edf4) 25%, 
            var(--surface, #ffffff) 50%, 
            var(--bg-soft, #e8edf4) 75%
          );
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s ease-in-out infinite;
          border-radius: 8px;
        }
        
        .skeleton-card {
          position: relative;
          overflow: hidden;
        }
        
        .skeleton-text {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .skeleton-line {
          height: 16px;
          border-radius: 4px;
        }
        
        .skeleton-circle {
          border-radius: 50%;
        }
        
        .skeleton-button {
          border-radius: 10px;
        }
        
        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        [data-theme="dark"] .skeleton-card,
        [data-theme="dark"] .skeleton-line,
        [data-theme="dark"] .skeleton-circle,
        [data-theme="dark"] .skeleton-button {
          background: linear-gradient(90deg, 
            #1a2332 25%, 
            #243447 50%, 
            #1a2332 75%
          );
          background-size: 200% 100%;
        }
      </style>
      ${this.createCard()}
      ${this.createText(3)}
      <div style="display: flex; gap: 12px; margin-top: 16px;">
        ${this.createButton('100px')}
        ${this.createButton('100px')}
      </div>
    `;
  }

  static hide(containerId) {
    // This would be called after content is loaded
    // Container content would be replaced by actual content
  }
}

window.skeleton = Skeleton;
