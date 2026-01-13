/**
 * Playwright Test Setup for SunCalc-Deno
 * 
 * This file contains utilities and configuration for end-to-end testing
 */

export const BASE_URL = 'http://localhost:8000';
export const TEST_TIMEOUT = 30000;

// Test location coordinates (Skodstrup, Denmark - default fallback)
export const TEST_LOCATIONS = {
  skodstrup: { lat: 56.2635, lng: 10.3041, name: 'Skodstrup' },
  copenhagen: { lat: 55.6761, lng: 12.5683, name: 'Copenhagen' },
  arctic: { lat: 78.2186, lng: 15.6333, name: 'Svalbard' }, // Polar phenomena
  equator: { lat: 0.0, lng: -78.4678, name: 'Quito' }, // Consistent daylight
};

// Supported languages
export const LANGUAGES = {
  danish: { code: 'da', flag: '🇩🇰', label: 'Dansk' },
  english: { code: 'en', flag: '🇬🇧', label: 'English' },
  german: { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  chinese: { code: 'zh', flag: '🇨🇳', label: '中文' },
  spanish: { code: 'es', flag: '🇪🇸', label: 'Español' },
};

/**
 * Wait for the custom element to be fully rendered
 */
export async function waitForComponentReady(page: any) {
  await page.waitForSelector('sun-moon-info', { state: 'attached', timeout: 10000 });
  
  // Wait for shadow root to be ready
  await page.waitForFunction(() => {
    const component = document.querySelector('sun-moon-info');
    return component && component.shadowRoot !== null;
  }, { timeout: 10000 });
  
  // Wait for header to be rendered (indicates component is ready)
  await page.waitForFunction(() => {
    const component = document.querySelector('sun-moon-info');
    const header = component?.shadowRoot?.querySelector('.header');
    return header !== null;
  }, { timeout: 10000 });
  
  // Wait for initial data to load
  await page.waitForTimeout(2000);
}

/**
 * Get element from shadow DOM
 */
export async function getShadowElement(page: any, selector: string) {
  return await page.evaluateHandle((sel: string) => {
    const component = document.querySelector('sun-moon-info');
    return component?.shadowRoot?.querySelector(sel);
  }, selector);
}

/**
 * Get text content from shadow DOM element
 */
export async function getShadowText(page: any, selector: string): Promise<string> {
  return await page.evaluate((sel: string) => {
    const component = document.querySelector('sun-moon-info');
    const element = component?.shadowRoot?.querySelector(sel);
    return element?.textContent?.trim() || '';
  }, selector);
}

/**
 * Click element in shadow DOM
 */
export async function clickShadowElement(page: any, selector: string) {
  await page.evaluate((sel: string) => {
    const component = document.querySelector('sun-moon-info');
    const element = component?.shadowRoot?.querySelector(sel);
    if (element instanceof HTMLElement) {
      element.click();
    }
  }, selector);
}

/**
 * Get all shadow elements matching selector
 */
export async function getAllShadowElements(page: any, selector: string) {
  return await page.evaluate((sel: string) => {
    const component = document.querySelector('sun-moon-info');
    const elements = component?.shadowRoot?.querySelectorAll(sel);
    return elements ? Array.from(elements).map(el => ({
      text: el.textContent?.trim(),
      visible: (el as HTMLElement).offsetParent !== null
    })) : [];
  }, selector);
}
