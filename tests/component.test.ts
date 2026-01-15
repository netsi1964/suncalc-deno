import { test, expect } from "npm:@playwright/test@^1.40.0";
import { 
  BASE_URL, 
  waitForComponentReady, 
  getShadowText, 
  clickShadowElement,
  TEST_LOCATIONS 
} from "./setup.ts";

test.describe('Sun-Moon-Info Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
  });

  test('should render the main component', async ({ page }) => {
    const component = await page.locator('sun-moon-info');
    await expect(component).toBeVisible();
  });

  test('should display location header with emoji', async ({ page }) => {
    const headerText = await getShadowText(page, '.header h2');
    expect(headerText).toMatch(/📍/);
    expect(headerText.length).toBeGreaterThan(2);
  });

  test('should display sun information card', async ({ page }) => {
    const sunInfoExists = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      return Array.from(cards || []).some(card => 
        card.getAttribute('feature-id') === 'sunInfo'
      );
    });
    expect(sunInfoExists).toBe(true);
  });

  test('should display moon information card', async ({ page }) => {
    const moonInfoExists = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      return Array.from(cards || []).some(card => 
        card.getAttribute('feature-id') === 'moonInfo'
      );
    });
    expect(moonInfoExists).toBe(true);
  });

  test('should display timeline card', async ({ page }) => {
    const timelineExists = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      return Array.from(cards || []).some(card => 
        card.getAttribute('feature-id') === 'timeline'
      );
    });
    expect(timelineExists).toBe(true);
  });

  test('should display UV index card', async ({ page }) => {
    const uvExists = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      return Array.from(cards || []).some(card => 
        card.getAttribute('feature-id') === 'uvIndex'
      );
    });
    expect(uvExists).toBe(true);
  });

  test('should display map container', async ({ page }) => {
    const hasMap = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const map = component?.shadowRoot?.querySelector('.map-container');
      return map !== null;
    });
    expect(hasMap).toBe(true);
  });

  test('should show sunrise and sunset times', async ({ page }) => {
    const sunData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      
      if (!sunCard) return null;
      
      const text = sunCard.textContent || '';
      // Look for time patterns (HH:MM)
      const timePattern = /\d{1,2}:\d{2}/g;
      const times = text.match(timePattern);
      
      return {
        hasTimes: times && times.length >= 2,
        text: text.substring(0, 500) // First 500 chars for debugging
      };
    });
    
    expect(sunData?.hasTimes).toBe(true);
  });

  test('should show daylight duration', async ({ page }) => {
    const hasDaylight = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      
      if (!sunCard) return false;
      
      const text = sunCard.textContent || '';
      // Look for duration pattern (Xh Ym or Xt Ym for Danish)
      return /\d+[ht]\s+\d+m/.test(text);
    });
    
    expect(hasDaylight).toBe(true);
  });

  test('should show daylight comparison (shortest/longest day)', async ({ page }) => {
    const hasComparison = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const sunCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'sunInfo');
      
      if (!sunCard) return false;
      
      const text = sunCard.textContent || '';
      // Check for presence of comparison indicators (more/less/plus/minus patterns)
      return text.includes('↑') || text.includes('↓') || 
             /[+\-]\s*\d+[ht]\s+\d+m/.test(text);
    });
    
    expect(hasComparison).toBe(true);
  });

  test('should display moonrise and moonset times', async ({ page }) => {
    const moonData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const moonCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'moonInfo');
      
      if (!moonCard) return null;
      
      const text = moonCard.textContent || '';
      return {
        hasRise: text.toLowerCase().includes('ris') || text.toLowerCase().includes('上升'),
        hasSet: text.toLowerCase().includes('set') || text.toLowerCase().includes('下落'),
        text: text.substring(0, 300)
      };
    });
    
    expect(moonData?.hasRise || moonData?.hasSet).toBe(true);
  });

  test('should respect location coordinates from attributes', async ({ page }) => {
    // Navigate with specific coordinates
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
});
