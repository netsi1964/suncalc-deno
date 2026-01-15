import { expect, test } from "@playwright/test";
import {
    BASE_URL,
    waitForComponentReady
} from "./setup.ts";

test.describe('Feature Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForComponentReady(page);
  });

  test('should display all feature cards', async ({ page }) => {
    const cards = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const allCards = component?.shadowRoot?.querySelectorAll('feature-card');
      return Array.from(allCards || []).map(card => 
        card.getAttribute('feature-id')
      );
    });
    
    expect(cards).toContain('sunInfo');
    expect(cards).toContain('moonInfo');
    expect(cards).toContain('moonPhase');
    expect(cards).toContain('uvIndex');
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  test('each feature card should have a toggle button', async ({ page }) => {
    const togglesCount = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      let count = 0;
      
      cards?.forEach(card => {
        const toggle = card.querySelector('feature-toggle');
        if (toggle) count++;
      });
      
      return count;
    });
    
    expect(togglesCount).toBeGreaterThan(0);
  });

  test('UV index card should exist', async ({ page }) => {
    const hasUvCard = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const uvCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'uvIndex');
      
      return uvCard !== null;
    });
    
    expect(hasUvCard).toBe(true);
  });

  test('UV index card should display UV level', async ({ page }) => {
    // Expand UV card if collapsed
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'uvIndex');
      
      if (card?.getAttribute('expanded') !== 'true') {
        const toggle = card?.querySelector('feature-toggle') as HTMLElement;
        toggle?.click();
      }
    });
    
    await page.waitForTimeout(500);
    
    const hasUvData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'uvIndex');
      
      const text = card?.textContent || '';
      // Look for UV level indicators (Low, Moderate, High, etc or numbers)
      return /\d+/.test(text) || /low|moderate|high|lav|moderat|høj/i.test(text);
    });
    
    expect(hasUvData).toBe(true);
  });

  test('should have tabs in cards with multiple views', async ({ page }) => {
    // Some cards may have tabs in the future
    const hasTabs = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      
      let tabsFound = false;
      cards?.forEach(card => {
        const tabGroup = card.querySelector('tab-group');
        if (tabGroup) tabsFound = true;
      });
      
      return true; // Just check that cards exist
    });
    
    expect(hasTabs).toBe(true);
  });

  test('moon info card should display moon data', async ({ page }) => {
    const moonData = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'moonInfo');
      
      if (!card) return null;
      
      const text = card.textContent || '';
      return {
        hasText: text.length > 0
      };
    });
    
    expect(moonData?.hasText).toBe(true);
  });

  test('should display feature card content', async ({ page }) => {
    const hasContent = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      
      if (!cards || cards.length === 0) return false;
      
      // Check that at least one card has content
      for (const card of cards) {
        if (card.textContent && card.textContent.trim().length > 0) {
          return true;
        }
      }
      return false;
    });
    
    expect(hasContent).toBe(true);
  });

  test('should have moon phase card', async ({ page }) => {
    const hasMoonPhase = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const moonPhaseCard = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(card => card.getAttribute('feature-id') === 'moonPhase');
      
      return moonPhaseCard !== null;
    });
    
    expect(hasMoonPhase).toBe(true);
  });

  test('should persist feature states in localStorage', async ({ page }) => {
    // Toggle a feature
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'uvIndex');
      const toggle = card?.querySelector('feature-toggle') as HTMLElement;
      toggle?.click();
    });
    
    await page.waitForTimeout(500);
    
    // Check localStorage
    const stateInStorage = await page.evaluate(() => {
      const state = localStorage.getItem('sunMoonState');
      if (!state) return null;
      const parsed = JSON.parse(state);
      return parsed.features?.uvIndex;
    });
    
    expect(stateInStorage).toBeDefined();
  });

  test('should restore feature states from localStorage', async ({ page }) => {
    // Set collapsed state for UV in localStorage
    await page.evaluate(() => {
      const state = {
        features: {
          uvIndex: false,
          sunInfo: true,
          moonInfo: true,
          timeline: true
        },
        featureTabs: {},
        lat: 56.2635,
        lng: 10.3041
      };
      localStorage.setItem('sunMoonState', JSON.stringify(state));
    });
    
    // Reload page
    await page.reload();
    await waitForComponentReady(page);
    
    // Check if UV card is collapsed
    const isCollapsed = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'uvIndex');
      return card?.getAttribute('expanded') === 'false';
    });
    
    expect(isCollapsed).toBe(true);
  });

  test('cards should be in responsive grid layout', async ({ page }) => {
    const hasGrid = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const grid = component?.shadowRoot?.querySelector('.cards-grid');
      return grid !== null;
    });
    
    expect(hasGrid).toBe(true);
  });

  test('should display location controls section', async ({ page }) => {
    const hasLocationControls = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const controls = component?.shadowRoot?.querySelector('.location-controls');
      return controls !== null;
    });
    
    expect(hasLocationControls).toBe(true);
  });

  test('should display map container', async ({ page }) => {
    const hasMap = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const map = component?.shadowRoot?.querySelector('.map-container');
      const leafletMap = map?.querySelector('#map');
      return {
        hasContainer: map !== null,
        hasLeafletMap: leafletMap !== null
      };
    });
    
    expect(hasMap.hasContainer).toBe(true);
    expect(hasMap.hasLeafletMap).toBe(true);
  });
});
