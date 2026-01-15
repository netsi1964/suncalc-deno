import { expect, test } from "@playwright/test";
import {
    BASE_URL,
    waitForComponentReady
} from "./setup.ts";

test.describe('Language Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
  });

  test('should display language selector', async ({ page }) => {
    const langSelector = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const selector = component?.shadowRoot?.querySelector('.language-selector select');
      return selector !== null;
    });
    
    expect(langSelector).toBe(true);
  });

  test('should have all supported languages', async ({ page }) => {
    const languages = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const select = component?.shadowRoot?.querySelector('.language-selector select');
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
      const select = component?.shadowRoot?.querySelector('.language-selector select');
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
      const select = component?.shadowRoot?.querySelector('.language-selector select') as HTMLSelectElement;
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

  test('language selector should allow changing language', async ({ page }) => {
    const canChange = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const select = component?.shadowRoot?.querySelector('.language-selector select') as HTMLSelectElement;
      return select && select.options.length > 1;
    });
    
    expect(canChange).toBe(true);
  });

  test('should display time information', async ({ page }) => {
    const hasTime = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      const text = sunCard?.textContent || '';
      return /\d{1,2}:\d{2}/.test(text);
    });
    
    expect(hasTime).toBe(true);
  });

  test('component should have saveState method', async ({ page }) => {
    const hasSaveState = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return typeof component?.saveState === 'function';
    });
    
    expect(hasSaveState).toBe(true);
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
      const select = component?.shadowRoot?.querySelector('.language-selector select') as HTMLSelectElement;
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
