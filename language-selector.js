// Language Selector Custom Element
class LanguageSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const select = this.shadowRoot.querySelector('select');
    select.addEventListener('change', (e) => {
      window.setLanguage(e.target.value);
    });
  }

  render() {
    const currentLang = window.currentLanguage || 'en';
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1200px;
          margin: 0 auto 20px;
        }
        
        .language-selector {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
        }
        
        label {
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          font-size: 14px;
          color: #2c3e50;
          font-weight: 500;
        }
        
        select {
          padding: 8px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          font-family: Segoe UI, Tahoma, Verdana, sans-serif;
          font-size: 14px;
          color: #2c3e50;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }
        
        select:hover {
          border-color: #3498db;
        }
        
        select:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        
        option {
          padding: 8px;
        }
        
        @media (max-width: 768px) {
          .language-selector {
            justify-content: center;
          }
        }
      </style>
      
      <div class="language-selector">
        <label for="lang-select">🌐</label>
        <select id="lang-select">
          <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
          <option value="da" ${currentLang === 'da' ? 'selected' : ''}>Dansk</option>
          <option value="de" ${currentLang === 'de' ? 'selected' : ''}>Deutsch</option>
          <option value="zh" ${currentLang === 'zh' ? 'selected' : ''}>中文</option>
        </select>
      </div>
    `;
  }
}

customElements.define('language-selector', LanguageSelector);
