import { expect, test } from "@playwright/test";
import {
    BASE_URL,
    clickShadowElement,
    waitForComponentReady
} from "./setup.ts";

test.describe('UI Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
  });

  test('should have share button in header', async ({ page }) => {
    const shareBtn = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const btn = component?.shadowRoot?.querySelector('#share-btn');
      return {
        exists: btn !== null,
        text: btn?.textContent?.trim()
      };
    });
    
    expect(shareBtn.exists).toBe(true);
    expect(shareBtn.text).toMatch(/🔗|del|share/i);
  });

  test('share button should copy URL to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await clickShadowElement(page, '#share-btn');
    await page.waitForTimeout(500);
    
    // Verify button feedback
    const btnText = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const btn = component?.shadowRoot?.querySelector('#share-btn');
      return btn?.textContent?.trim();
    });
    
    expect(btnText).toMatch(/✓|kopieret|copied/i);
  });

  test('should have GPS button', async ({ page }) => {
    const gpsBtn = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const btn = component?.shadowRoot?.querySelector('#gps-btn');
      return {
        exists: btn !== null,
        text: btn?.textContent?.trim()
      };
    });
    
    expect(gpsBtn.exists).toBe(true);
    expect(gpsBtn.text).toMatch(/🌍/);
  });

  test('should have today button', async ({ page }) => {
    const todayBtn = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const btn = component?.shadowRoot?.querySelector('#today-btn');
      return {
        exists: btn !== null,
        text: btn?.textContent?.trim()
      };
    });
    
    expect(todayBtn.exists).toBe(true);
    expect(todayBtn.text).toMatch(/📅|i dag|today|heute|今天|hoy/i);
  });

  test('today button should reset to current date', async ({ page }) => {
    // First, change the date
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      if (datePicker) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        datePicker.setAttribute('selected-date', yesterday.toISOString());
      }
    });
    
    await page.waitForTimeout(500);
    
    // Click today button
    await clickShadowElement(page, '#today-btn');
    await page.waitForTimeout(500);
    
    // Verify date is reset to today
    const isToday = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      const current = component?.currentDate;
      const today = new Date();
      
      return current && 
        current.getDate() === today.getDate() &&
        current.getMonth() === today.getMonth() &&
        current.getFullYear() === today.getFullYear();
    });
    
    expect(isToday).toBe(true);
  });

  test('should have location search field', async ({ page }) => {
    const searchInput = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const input = component?.shadowRoot?.querySelector('#location-search');
      return {
        exists: input !== null,
        placeholder: (input as HTMLInputElement)?.placeholder
      };
    });
    
    expect(searchInput.exists).toBe(true);
    expect(searchInput.placeholder).toBeTruthy();
  });

  test('should have search button', async ({ page }) => {
    const searchBtn = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const btn = component?.shadowRoot?.querySelector('#search-btn');
      return {
        exists: btn !== null,
        text: btn?.textContent?.trim()
      };
    });
    
    expect(searchBtn.exists).toBe(true);
    expect(searchBtn.text).toMatch(/🔍|søg|search|suche|搜索|buscar/i);
  });

  test('should enable search button when input has text', async ({ page }) => {
    // Type in search field
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const input = component?.shadowRoot?.querySelector('#location-search') as HTMLInputElement;
      if (input) {
        input.value = 'Copenhagen';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    const isEnabled = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const btn = component?.shadowRoot?.querySelector('#search-btn') as HTMLButtonElement;
      return btn && !btn.disabled;
    });
    
    expect(isEnabled).toBe(true);
  });

  test('should have date picker component', async ({ page }) => {
    const datePicker = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const picker = component?.shadowRoot?.querySelector('date-picker');
      return picker !== null;
    });
    
    expect(datePicker).toBe(true);
  });

  test('should have feature toggle buttons', async ({ page }) => {
    const toggles = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      const togglesFound: string[] = [];
      
      cards?.forEach(card => {
        const toggle = card.querySelector('feature-toggle');
        if (toggle) {
          togglesFound.push(card.getAttribute('feature-id') || '');
        }
      });
      
      return togglesFound;
    });
    
    expect(toggles.length).toBeGreaterThan(0);
    expect(toggles).toContain('sunInfo');
    expect(toggles).toContain('moonInfo');
  });

  test('feature toggle should expand/collapse cards', async ({ page }) => {
    // Get initial state
    const initialState = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'sunInfo');
      return card?.getAttribute('expanded');
    });
    
    // Click toggle
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'sunInfo');
      const toggle = card?.querySelector('feature-toggle');
      if (toggle instanceof HTMLElement) {
        toggle.click();
      }
    });
    
    await page.waitForTimeout(500);
    
    // Get new state
    const newState = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'sunInfo');
      return card?.getAttribute('expanded');
    });
    
    expect(initialState).not.toBe(newState);
  });

  test('should have custom tooltips on buttons', async ({ page }) => {
    const tooltips = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const buttons = [
        component?.shadowRoot?.querySelector('#share-btn'),
        component?.shadowRoot?.querySelector('#gps-btn'),
        component?.shadowRoot?.querySelector('#today-btn'),
      ];
      
      return buttons.map(btn => {
        const tooltip = btn?.querySelector('custom-tooltip');
        return {
          hasTooltip: tooltip !== null,
          text: tooltip?.getAttribute('text')
        };
      });
    });
    
    tooltips.forEach(t => {
      expect(t.hasTooltip).toBe(true);
      expect(t.text).toBeTruthy();
    });
  });
});
