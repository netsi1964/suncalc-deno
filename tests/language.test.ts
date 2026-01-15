import { test, expect } from "npm:@playwright/test@^1.40.0";
import { 
  BASE_URL, 
  waitForComponentReady,
  LANGUAGES
} from "./setup.ts";

test.describe('Language Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
  });

  test('should display language selector', async ({ page }) => {
    const langSelector = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      return selector !== null;
    });
    
    expect(langSelector).toBe(true);
  });

  test('should have all supported languages', async ({ page }) => {
    const languages = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      const shadowRoot = selector?.shadowRoot;
      const select = shadowRoot?.querySelector('select');
      const options = Array.from(select?.querySelectorAll('option') || []);
      
      return options.map(opt => ({
        value: opt.value,
        text: opt.textContent?.trim()
      }));
    });
    
    expect(languages.length).toBe(5);
    
    const codes = languages.map(l => l.value);
    expect(codes).toContain('da');
    expect(codes).toContain('en');
    expect(codes).toContain('de');
    expect(codes).toContain('zh');
    expect(codes).toContain('es');
  });

  test('should show flag emojis in options', async ({ page }) => {
    const hasFlags = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      const shadowRoot = selector?.shadowRoot;
      const select = shadowRoot?.querySelector('select');
      const options = Array.from(select?.querySelectorAll('option') || []);
      
      const flagPattern = /[\u{1F1E6}-\u{1F1FF}]{2}/u;
      return options.every(opt => flagPattern.test(opt.textContent || ''));
    });
    
    expect(hasFlags).toBe(true);
  });

  test('should change language when selecting different option', async ({ page }) => {
    // Change to English
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      const shadowRoot = selector?.shadowRoot;
      const select = shadowRoot?.querySelector('select') as HTMLSelectElement;
      if (select) {
        select.value = 'en';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Check if language changed by looking for English text
    const hasEnglishText = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const text = component?.shadowRoot?.textContent || '';
      return text.includes('Sunrise') || text.includes('Today') || text.includes('Share');
    });
    
    expect(hasEnglishText).toBe(true);
  });

  test('should update all UI text when language changes', async ({ page }) => {
    // Get current button text
    const danishText = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      return {
        today: component?.shadowRoot?.querySelector('#today-btn')?.textContent?.trim(),
        share: component?.shadowRoot?.querySelector('#share-btn')?.textContent?.trim(),
      };
    });
    
    // Change to German
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      const shadowRoot = selector?.shadowRoot;
      const select = shadowRoot?.querySelector('select') as HTMLSelectElement;
      if (select) {
        select.value = 'de';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get German text
    const germanText = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      return {
        today: component?.shadowRoot?.querySelector('#today-btn')?.textContent?.trim(),
        share: component?.shadowRoot?.querySelector('#share-btn')?.textContent?.trim(),
      };
    });
    
    // Texts should be different
    expect(danishText.today).not.toBe(germanText.today);
  });

  test('should update time abbreviations when language changes', async ({ page }) => {
    // Get Danish time abbreviations
    const danishAbbr = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      return sunCard?.textContent || '';
    });
    
    // Change to English
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      const shadowRoot = selector?.shadowRoot;
      const select = shadowRoot?.querySelector('select') as HTMLSelectElement;
      if (select) {
        select.value = 'en';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(1000);
    
    const englishAbbr = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      return sunCard?.textContent || '';
    });
    
    // Danish should have 't' for timer, English should have 'h' for hours
    const hasDanishT = /\d+t\s+\d+m/.test(danishAbbr);
    const hasEnglishH = /\d+h\s+\d+m/.test(englishAbbr);
    
    expect(hasDanishT).toBe(true);
    expect(hasEnglishH).toBe(true);
  });

  test('should persist language selection in localStorage', async ({ page }) => {
    // Change language
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      const shadowRoot = selector?.shadowRoot;
      const select = shadowRoot?.querySelector('select') as HTMLSelectElement;
      if (select) {
        select.value = 'es';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(500);
    
    // Check localStorage
    const storedLang = await page.evaluate(() => localStorage.getItem('language'));
    expect(storedLang).toBe('es');
  });

  test('should reload language from localStorage on page load', async ({ page }) => {
    // Set language in localStorage
    await page.evaluate(() => localStorage.setItem('language', 'zh'));
    
    // Reload page
    await page.reload();
    await waitForComponentReady(page);
    
    // Check if Chinese is selected
    const selectedLang = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      const shadowRoot = selector?.shadowRoot;
      const select = shadowRoot?.querySelector('select') as HTMLSelectElement;
      return select?.value;
    });
    
    expect(selectedLang).toBe('zh');
  });

  test('should re-calculate sun/moon data when language changes', async ({ page }) => {
    // Get initial sunrise time
    const initialData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      const text = sunCard?.textContent || '';
      const timeMatch = text.match(/\d{1,2}:\d{2}/);
      return timeMatch ? timeMatch[0] : null;
    });
    
    // Change language
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('language-selector');
      const shadowRoot = selector?.shadowRoot;
      const select = shadowRoot?.querySelector('select') as HTMLSelectElement;
      if (select) {
        select.value = 'en';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get new sunrise time - should be same time, just different labels
    const newData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      const text = sunCard?.textContent || '';
      const timeMatch = text.match(/\d{1,2}:\d{2}/);
      return timeMatch ? timeMatch[0] : null;
    });
    
    // Times should be the same (data didn't change, only language)
    expect(initialData).toBe(newData);
  });
});
