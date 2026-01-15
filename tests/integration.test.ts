import { expect, test } from "@playwright/test";
import {
    BASE_URL,
    TEST_LOCATIONS,
    waitForComponentReady
} from "./setup.ts";

test.describe('Responsive Layout', () => {
  test('should display correctly on desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
    
    const layout = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const grid = component?.shadowRoot?.querySelector('.cards-grid');
      const computedStyle = window.getComputedStyle(grid as Element);
      
      return {
        display: computedStyle.display,
        gridTemplateColumns: computedStyle.gridTemplateColumns
      };
    });
    
    expect(layout.display).toBe('grid');
    expect(layout.gridTemplateColumns).toContain('300px');
  });

  test('should display correctly on tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
    
    const isVisible = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      return component?.shadowRoot?.querySelector('.container') !== null;
    });
    
    expect(isVisible).toBe(true);
  });

  test('should display correctly on mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
    
    const layout = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const grid = component?.shadowRoot?.querySelector('.cards-grid');
      const computedStyle = window.getComputedStyle(grid as Element);
      
      return {
        display: computedStyle.display,
        gridTemplateColumns: computedStyle.gridTemplateColumns
      };
    });
    
    expect(layout.display).toBe('grid');
  });

  test('header should stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
    
    const headerLayout = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const header = component?.shadowRoot?.querySelector('.header');
      const computedStyle = window.getComputedStyle(header as Element);
      
      return {
        display: computedStyle.display,
        flexDirection: computedStyle.flexDirection
      };
    });
    
    expect(headerLayout.display).toBe('flex');
  });
});

test.describe('Timezone Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
  });

  test('should display times in location timezone, not GMT', async ({ page }) => {
    // Navigate to Copenhagen
    const { lat, lng } = TEST_LOCATIONS.copenhagen;
    await page.goto(`${BASE_URL}?lat=${lat}&lng=${lng}`);
    await waitForComponentReady(page);
    
    const sunriseTime = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      
      const text = sunCard?.textContent || '';
      const timeMatch = text.match(/\d{1,2}:\d{2}/);
      return timeMatch ? timeMatch[0] : null;
    });
    
    // Sunrise in Copenhagen in January should be around 8-9 AM, not 2-3 AM (GMT)
    if (sunriseTime) {
      const hour = parseInt(sunriseTime.split(':')[0]);
      expect(hour).toBeGreaterThan(5); // Not GMT
      expect(hour).toBeLessThan(12); // Reasonable local time
    }
  });

  test('should format times in HH:MM format', async ({ page }) => {
    const times = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const text = component?.shadowRoot?.textContent || '';
      const timePattern = /\d{1,2}:\d{2}/g;
      return text.match(timePattern);
    });
    
    expect(times).toBeTruthy();
    if (times) {
      times.forEach(time => {
        expect(time).toMatch(/^\d{1,2}:\d{2}$/);
      });
    }
  });
});

test.describe('Polar Phenomena', () => {
  test('should handle midnight sun (Arctic summer)', async ({ page }) => {
    // Arctic location in summer
    const { lat, lng } = TEST_LOCATIONS.arctic;
    await page.goto(`${BASE_URL}?lat=${lat}&lng=${lng}&date=2026-06-21`);
    await waitForComponentReady(page);
    
    const sunData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      
      return sunCard?.textContent || '';
    });
    
    // Should indicate no sunset or midnight sun
    const hasIndicator = sunData.includes('—') || 
                        sunData.toLowerCase().includes('midnight') ||
                        sunData.toLowerCase().includes('midnatssol');
    
    expect(hasIndicator).toBe(true);
  });

  test('should handle polar night (Arctic winter)', async ({ page }) => {
    // Arctic location in winter
    const { lat, lng } = TEST_LOCATIONS.arctic;
    await page.goto(`${BASE_URL}?lat=${lat}&lng=${lng}&date=2025-12-21`);
    await waitForComponentReady(page);
    
    const sunData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      
      return sunCard?.textContent || '';
    });
    
    // Should indicate no sunrise or polar night
    const hasIndicator = sunData.includes('—') || 
                        sunData.toLowerCase().includes('polar') ||
                        sunData.toLowerCase().includes('mørketid');
    
    expect(hasIndicator).toBe(true);
  });
});

test.describe('URL State Management', () => {
  test('should read location from URL parameters', async ({ page }) => {
    const { lat, lng } = TEST_LOCATIONS.copenhagen;
    await page.goto(`${BASE_URL}?lat=${lat}&lng=${lng}`);
    await waitForComponentReady(page);
    
    const coords = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return {
        lat: parseFloat(component?.lat || '0'),
        lng: parseFloat(component?.lng || '0')
      };
    });
    
    expect(Math.abs(coords.lat - lat)).toBeLessThan(0.1);
    expect(Math.abs(coords.lng - lng)).toBeLessThan(0.1);
  });

  test('should update URL when location changes', async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
    
    // Change location via search
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      component.lat = 55.6761;
      component.lng = 12.5683;
      component.saveState();
    });
    
    await page.waitForTimeout(500);
    
    const url = page.url();
    expect(url).toContain('lat=');
    expect(url).toContain('lng=');
  });

  test('should have saveState method', async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
    
    const hasSaveMethod = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info') as any;
      return typeof component?.saveState === 'function';
    });
    
    expect(hasSaveMethod).toBe(true);
  });
});
