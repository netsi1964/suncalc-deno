// Feature Card Custom Element
class FeatureCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'icon', 'expanded', 'feature-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Only re-render if it's not the expanded attribute changing
    // For expanded, just update styles
    if (name === 'expanded' && oldValue !== null) {
      this.updateExpandedState();
    } else {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  updateExpandedState() {
    const expanded = this.getAttribute('expanded') === 'true';
    const cardBody = this.shadowRoot.querySelector('.card-body');
    const cardBodyCollapsed = this.shadowRoot.querySelector('.card-body-collapsed');
    
    if (cardBody) {
      cardBody.style.display = expanded ? 'block' : 'none';
    }
    if (cardBodyCollapsed) {
      cardBodyCollapsed.style.display = !expanded ? 'block' : 'none';
    }
  }

  render() {
    const title = this.getAttribute('title') || '';
    const icon = this.getAttribute('icon') || '';
    const expanded = this.getAttribute('expanded') === 'true';
    const featureId = this.getAttribute('feature-id') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: box-shadow 0.2s;
          box-sizing: border-box;
          flex: 1;
          min-width: 250px;
        }

        :host(:hover) {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-body {
          padding: var(--space-md, 16px);
          text-align: center;
          min-height: 85px;
        }

        .card-body-collapsed {
          padding: var(--space-md, 16px);
        }

        ::slotted([slot="header-actions"]) {
          display: flex;
          gap: 8px;
        }

        ::slotted([slot="collapsed-content"]) {
          font-size: 14px;
          color: #7f8c8d;
        }
      </style>

      <div class="card-header">
        <div class="card-title">
          ${icon ? `<span>${icon}</span>` : ''}
          <span>${title}</span>
        </div>
        <slot name="header-actions"></slot>
      </div>
      
      <div class="card-body-collapsed" style="display: ${!expanded ? 'block' : 'none'};">
        <slot name="collapsed-content"></slot>
      </div>

      <div class="card-body" style="display: ${expanded ? 'block' : 'none'};">
        <slot name="tabs"></slot>
        <slot name="content"></slot>
      </div>
    `;
    
    // Store expanded state for updateExpandedState method
    this._lastExpanded = expanded;
  }
}

// Register custom element
customElements.define('feature-card', FeatureCard);
