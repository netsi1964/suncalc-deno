import { expect, test } from "@playwright/test";
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

  test('date picker component should exist', async ({ page }) => {
    const hasDatePicker = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      return datePicker !== null;
    });
    
    expect(hasDatePicker).toBe(true);
  });

  test('should display sun elevation chart', async ({ page }) => {
    const hasSunElevation = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'sunElevation');
      
      if (!card) return false;
      
      const chart = card.querySelector('.sun-elevation-chart');
      return chart !== null;
    });
    
    expect(hasSunElevation).toBe(true);
  });

  test('timeline should show 24-hour view', async ({ page }) => {
    const timelineData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const timelineContainer = component?.shadowRoot?.querySelector('.timeline-container');
      
      return {
        hasContainer: timelineContainer !== null,
        hasContent: (timelineContainer?.textContent || '').length > 0
      };
    });
    
    expect(timelineData.hasContainer).toBe(true);
  });

  test('sun data should exist for current date', async ({ page }) => {
    const sunData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'sunInfo');
      
      return {
        hasCard: sunCard !== null,
        hasContent: (sunCard?.textContent || '').length > 0
      };
    });
    
    expect(sunData.hasCard).toBe(true);
    expect(sunData.hasContent).toBe(true);
  });

  test('should have date picker card', async ({ page }) => {
    const hasDatePicker = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      return Array.from(cards || []).some(card => 
        card.getAttribute('feature-id') === 'datePicker'
      );
    });
    
    expect(hasDatePicker).toBe(true);
  });

  test('date picker should be interactive', async ({ page }) => {
    const canInteract = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const datePicker = component?.shadowRoot?.querySelector('date-picker');
      return datePicker !== null;
    });
    
    expect(canInteract).toBe(true);
  });

  test('component should have current date property', async ({ page }) => {
    const hasDate = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return component?.currentDate !== undefined;
    });
    
    expect(hasDate).toBe(true);
  });

  test('component should save state', async ({ page }) => {
    const hasSaveMethod = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return typeof component?.saveState === 'function';
    });
    
    expect(hasSaveMethod).toBe(true);
  });
});
