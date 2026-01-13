// Feature Toggle Custom Element
class FeatureToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['expanded', 'title'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const container = this.shadowRoot.querySelector('.toggle-container');
    if (container) {
      // Remove old listener if exists
      if (this._clickHandler) {
        container.removeEventListener('click', this._clickHandler);
      }
      
      // Create new handler
      this._clickHandler = () => {
        const isExpanded = this.getAttribute('expanded') === 'true';
        
        // Emit custom event (parent will handle state change)
        this.dispatchEvent(new CustomEvent('toggle', {
          bubbles: true,
          composed: true,
          detail: { expanded: !isExpanded }
        }));
      };
      
      container.addEventListener('click', this._clickHandler);
    }
  }

  render() {
    const expanded = this.getAttribute('expanded') === 'true';
    const title = this.getAttribute('title') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .toggle-container {
          cursor: pointer;
          padding: 4px;
        }

        .toggle-track {
          width: 44px;
          height: 24px;
          background: ${expanded ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'};
          border-radius: 12px;
          position: relative;
          transition: background 0.3s;
        }

        .toggle-thumb {
          width: 20px;
          height: 20px;
          background: ${expanded ? '#28a745' : '#667eea'};
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: ${expanded ? '22px' : '2px'};
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .toggle-container:hover .toggle-track {
          background: ${expanded ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.4)'};
        }
      </style>

      <div class="toggle-container" aria-label="Toggle ${title}">
        <div class="toggle-track">
          <div class="toggle-thumb"></div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }
}

// Register custom element
customElements.define('feature-toggle', FeatureToggle);
