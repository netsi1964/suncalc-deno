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
    expect(cards).toContain('timeline');
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

  test('should expand/collapse UV index card', async ({ page }) => {
    const initialState = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'uvIndex');
      return card?.getAttribute('expanded') === 'true';
    });
    
    // Click toggle
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'uvIndex');
      const toggle = card?.querySelector('feature-toggle') as HTMLElement;
      toggle?.click();
    });
    
    await page.waitForTimeout(500);
    
    const newState = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'uvIndex');
      return card?.getAttribute('expanded') === 'true';
    });
    
    expect(initialState).not.toBe(newState);
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
    const hasTabs = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const cards = component?.shadowRoot?.querySelectorAll('feature-card');
      
      let tabsFound = false;
      cards?.forEach(card => {
        const tabGroup = card.querySelector('tab-group');
        if (tabGroup) tabsFound = true;
      });
      
      return tabsFound;
    });
    
    expect(hasTabs).toBe(true);
  });

  test('moon info card should have info and graph tabs', async ({ page }) => {
    const tabs = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'moonInfo');
      
      const tabGroup = card?.querySelector('tab-group');
      const shadowRoot = tabGroup?.shadowRoot;
      const tabButtons = shadowRoot?.querySelectorAll('.tab-button');
      
      return Array.from(tabButtons || []).map(btn => 
        btn.getAttribute('data-tab')
      );
    });
    
    expect(tabs).toContain('info');
    expect(tabs).toContain('graph');
  });

  test('should switch tabs when clicking tab button', async ({ page }) => {
    // Click graph tab in moon card
    await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'moonInfo');
      
      const tabGroup = card?.querySelector('tab-group');
      const shadowRoot = tabGroup?.shadowRoot;
      const graphTab = Array.from(shadowRoot?.querySelectorAll('.tab-button') || [])
        .find(btn => btn.getAttribute('data-tab') === 'graph') as HTMLElement;
      
      graphTab?.click();
    });
    
    await page.waitForTimeout(500);
    
    const activeTab = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'moonInfo');
      
      const tabGroup = card?.querySelector('tab-group');
      const shadowRoot = tabGroup?.shadowRoot;
      const activeBtn = shadowRoot?.querySelector('.tab-button.active');
      
      return activeBtn?.getAttribute('data-tab');
    });
    
    expect(activeTab).toBe('graph');
  });

  test('should show moon phase information', async ({ page }) => {
    const hasMoonPhase = await page.evaluate(() => {
      const component = document.querySelector('sun-moon-info');
      const card = Array.from(component?.shadowRoot?.querySelectorAll('feature-card') || [])
        .find(c => c.getAttribute('feature-id') === 'moonInfo');
      
      const text = card?.textContent || '';
      // Look for moon phase indicators
      return /🌑|🌒|🌓|🌔|🌕|🌖|🌗|🌘/.test(text) || 
             /new|full|waxing|waning|ny|fuld/i.test(text);
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
