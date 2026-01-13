// Tab Group Custom Elements

// Tab Button
class TabButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['active', 'label', 'value'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const button = this.shadowRoot.querySelector('.tab-btn');
    if (button) {
      button.addEventListener('click', () => {
        // Emit custom event
        this.dispatchEvent(new CustomEvent('tab-select', {
          bubbles: true,
          composed: true,
          detail: { value: this.getAttribute('value') }
        }));
      });
    }
  }

  render() {
    const active = this.getAttribute('active') === 'true';
    const label = this.getAttribute('label') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          flex: 1;
        }

        .tab-btn {
          width: 100%;
          padding: 12px;
          background: ${active ? 'white' : 'none'};
          border: none;
          color: ${active ? '#667eea' : '#666'};
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 3px solid ${active ? '#667eea' : 'transparent'};
        }

        .tab-btn:hover {
          background: ${active ? 'white' : 'rgba(102, 126, 234, 0.1)'};
        }

        .tab-btn:focus {
          outline: none;
        }
      </style>

      <button class="tab-btn" role="tab" aria-selected="${active}">
        ${label}
      </button>
    `;

    this.attachEventListeners();
  }
}

// Tab Group Container
class TabGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['active-tab'];
  }

  attributeChangedCallback() {
    this.updateTabStates();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Listen for tab-select events from child tab-button elements
    this.addEventListener('tab-select', (e) => {
      e.stopPropagation();
      
      const newTab = e.detail.value;
      this.setAttribute('active-tab', newTab);
      
      // Emit change event
      this.dispatchEvent(new CustomEvent('tab-change', {
        bubbles: true,
        composed: true,
        detail: { tab: newTab }
      }));
    });
  }

  updateTabStates() {
    const activeTab = this.getAttribute('active-tab');
    const tabs = this.querySelectorAll('tab-button');
    
    tabs.forEach(tab => {
      const isActive = tab.getAttribute('value') === activeTab;
      tab.setAttribute('active', isActive);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }
      </style>

      <slot></slot>
    `;
  }
}

// Register custom elements
customElements.define('tab-button', TabButton);
customElements.define('tab-group', TabGroup);
