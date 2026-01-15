import { test, expect } from "npm:@playwright/test@^1.40.0";
import { 
  BASE_URL, 
  waitForComponentReady
} from "./setup.ts";

test.describe('Date Picker and Timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
  });

  test('should display date picker component', async ({ page }) => {
    const hasDatePicker = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const picker = component?.shadowRoot?.querySelector('date-picker');
      return picker !== null;
    });
    
    expect(hasDatePicker).toBe(true);
  });

  test('should show current date by default', async ({ page }) => {
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

  test('should allow changing date via date picker', async ({ page }) => {
    // Trigger date picker change
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      
      if (datePicker) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        datePicker.setAttribute('selected-date', tomorrow.toISOString());
        datePicker.dispatchEvent(new CustomEvent('date-changed', {
          detail: { date: tomorrow },
          bubbles: true,
          composed: true
        }));
      }
    });
    
    await page.waitForTimeout(500);
    
    // Verify date changed
    const isTomorrow = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      const current = component?.currentDate;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return current && 
        current.getDate() === tomorrow.getDate() &&
        current.getMonth() === tomorrow.getMonth();
    });
    
    expect(isTomorrow).toBe(true);
  });

  test('should display timeline graph', async ({ page }) => {
    const hasTimeline = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'timeline');
      
      if (!card) return false;
      
      const graph = card.querySelector('timeline-graph');
      return graph !== null;
    });
    
    expect(hasTimeline).toBe(true);
  });

  test('timeline should show 24-hour view', async ({ page }) => {
    const timelineData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'timeline');
      
      const graph = card?.querySelector('timeline-graph');
      const shadowRoot = graph?.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      return {
        hasSvg: svg !== null,
        svgContent: svg?.outerHTML?.substring(0, 500)
      };
    });
    
    expect(timelineData.hasSvg).toBe(true);
  });

  test('timeline should update when date changes', async ({ page }) => {
    // Get initial timeline data
    const initialSvg = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'timeline');
      const graph = card?.querySelector('timeline-graph');
      const shadowRoot = graph?.shadowRoot;
      return shadowRoot?.querySelector('svg')?.innerHTML;
    });
    
    // Change date to 6 months from now (different daylight)
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      
      if (datePicker) {
        const future = new Date();
        future.setMonth(future.getMonth() + 6);
        datePicker.setAttribute('selected-date', future.toISOString());
        datePicker.dispatchEvent(new CustomEvent('date-changed', {
          detail: { date: future },
          bubbles: true,
          composed: true
        }));
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get new timeline data
    const newSvg = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'timeline');
      const graph = card?.querySelector('timeline-graph');
      const shadowRoot = graph?.shadowRoot;
      return shadowRoot?.querySelector('svg')?.innerHTML;
    });
    
    // SVG should be different (different sun position)
    expect(initialSvg).not.toBe(newSvg);
  });

  test('should have date navigation controls', async ({ page }) => {
    const hasControls = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      const shadowRoot = datePicker?.shadowRoot;
      
      return {
        hasPrev: shadowRoot?.querySelector('.prev-date') !== null,
        hasNext: shadowRoot?.querySelector('.next-date') !== null,
        hasDateDisplay: shadowRoot?.querySelector('.date-display') !== null
      };
    });
    
    expect(hasControls.hasPrev).toBe(true);
    expect(hasControls.hasNext).toBe(true);
    expect(hasControls.hasDateDisplay).toBe(true);
  });

  test('should navigate to previous day', async ({ page }) => {
    const initialDate = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return component?.currentDate?.toISOString();
    });
    
    // Click previous day button
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      const shadowRoot = datePicker?.shadowRoot;
      const prevBtn = shadowRoot?.querySelector('.prev-date') as HTMLElement;
      prevBtn?.click();
    });
    
    await page.waitForTimeout(500);
    
    const newDate = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return component?.currentDate?.toISOString();
    });
    
    expect(newDate).not.toBe(initialDate);
  });

  test('should navigate to next day', async ({ page }) => {
    const initialDate = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return component?.currentDate?.toISOString();
    });
    
    // Click next day button
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      const shadowRoot = datePicker?.shadowRoot;
      const nextBtn = shadowRoot?.querySelector('.next-date') as HTMLElement;
      nextBtn?.click();
    });
    
    await page.waitForTimeout(500);
    
    const newDate = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return component?.currentDate?.toISOString();
    });
    
    expect(newDate).not.toBe(initialDate);
  });

  test('should persist selected date in URL', async ({ page }) => {
    // Change date
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      
      if (datePicker) {
        const future = new Date('2026-06-21'); // Summer solstice
        datePicker.setAttribute('selected-date', future.toISOString());
        datePicker.dispatchEvent(new CustomEvent('date-changed', {
          detail: { date: future },
          bubbles: true,
          composed: true
        }));
      }
    });
    
    await page.waitForTimeout(500);
    
    // Check URL contains date
    const url = page.url();
    expect(url).toContain('date=');
  });
});
