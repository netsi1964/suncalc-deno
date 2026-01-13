// Custom Tooltip Component
class CustomTooltip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isVisible = false;
    this.boundShowTooltip = this.showTooltip.bind(this);
    this.boundHideTooltip = this.hideTooltip.bind(this);
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  setupEventListeners() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const target = this.parentElement;
      if (!target) return;

      target.addEventListener('mouseenter', this.boundShowTooltip);
      target.addEventListener('mousemove', this.boundShowTooltip);
      target.addEventListener('mouseleave', this.boundHideTooltip);
      
      // Store reference for cleanup
      this.targetElement = target;
    }, 0);
  }

  removeEventListeners() {
    if (this.targetElement) {
      this.targetElement.removeEventListener('mouseenter', this.boundShowTooltip);
      this.targetElement.removeEventListener('mousemove', this.boundShowTooltip);
      this.targetElement.removeEventListener('mouseleave', this.boundHideTooltip);
    }
  }

  showTooltip(e) {
    const tooltip = this.shadowRoot.querySelector('.tooltip');
    if (!tooltip) return;

    tooltip.style.display = 'block';
    this.isVisible = true;

    // Position tooltip relative to mouse
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Try to position above the cursor
    let top = e.clientY - tooltipRect.height - 15;
    let left = e.clientX - tooltipRect.width / 2;

    // Adjust if tooltip goes off screen
    if (top < 10) {
      top = e.clientY + 15; // Position below instead
    }
    if (left < 10) {
      left = 10;
    }
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  hideTooltip() {
    const tooltip = this.shadowRoot.querySelector('.tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
      this.isVisible = false;
    }
  }

  render() {
    const text = this.getAttribute('text') || '';
    const theme = this.getAttribute('theme') || 'dark'; // dark, light, blue, red

    const themes = {
      dark: {
        bg: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        border: 'rgba(255, 255, 255, 0.2)'
      },
      light: {
        bg: 'rgba(255, 255, 255, 0.95)',
        color: '#2c3e50',
        border: 'rgba(0, 0, 0, 0.1)'
      },
      blue: {
        bg: 'rgba(52, 152, 219, 0.95)',
        color: 'white',
        border: 'rgba(255, 255, 255, 0.3)'
      },
      red: {
        bg: 'rgba(231, 76, 60, 0.95)',
        color: 'white',
        border: 'rgba(255, 255, 255, 0.3)'
      },
      night: {
        bg: 'rgba(44, 62, 80, 0.95)',
        color: 'white',
        border: 'rgba(255, 255, 255, 0.2)'
      }
    };

    const selectedTheme = themes[theme] || themes.dark;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
        }

        .tooltip {
          position: fixed;
          display: none;
          background: ${selectedTheme.bg};
          color: ${selectedTheme.color};
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          white-space: nowrap;
          z-index: 10000;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid ${selectedTheme.border};
          backdrop-filter: blur(10px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tooltip::before {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${selectedTheme.bg};
        }
      </style>

      <div class="tooltip">${text}</div>
    `;
  }

  static get observedAttributes() {
    return ['text', 'theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
}

customElements.define('custom-tooltip', CustomTooltip);
