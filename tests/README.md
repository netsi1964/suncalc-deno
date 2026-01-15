# Playwright End-to-End Tests

This directory contains comprehensive end-to-end tests for the SunCalc-Deno application using Playwright.

## Test Coverage

### Component Tests (`component.test.ts`)
- Main component rendering
- Location header display
- Feature cards (Sun, Moon, Timeline, UV Index)
- Map container
- Sun/moon time display
- Daylight duration and comparison
- Coordinate attribute handling

### UI Controls Tests (`controls.test.ts`)
- Share button functionality and clipboard integration
- GPS location button
- Today button (date reset)
- Location search field and button
- Date picker component
- Feature toggle buttons
- Custom tooltips

### Language Selector Tests (`language.test.ts`)
- All 5 supported languages (Danish, English, German, Chinese, Spanish)
- Flag emojis in options
- Language switching and UI updates
- Time abbreviation changes (t/m for Danish, h/m for English, etc.)
- LocalStorage persistence
- Data recalculation on language change

### Date & Timeline Tests (`date-timeline.test.ts`)
- Date picker display and functionality
- Current date default
- Date navigation (previous/next day)
- Timeline graph rendering (24-hour SVG)
- Timeline updates on date change
- URL state persistence

### Feature Cards Tests (`features.test.ts`)
- All feature cards rendering
- Toggle expand/collapse functionality
- UV index display and levels
- Tab switching in cards with multiple views
- Moon phase information
- LocalStorage state persistence
- State restoration from localStorage
- Responsive grid layout
- Map and location controls integration

### Integration Tests (`integration.test.ts`)
- Responsive layouts (desktop 1920x1080, tablet 768x1024, mobile 375x667)
- Timezone handling (local time vs GMT)
- Time format validation (HH:MM)
- Polar phenomena (midnight sun and polar night)
- URL parameter handling
- State persistence in localStorage and URL

## Running Tests

### Prerequisites
The Deno server must be running on http://localhost:8000 before running tests:

```bash
deno task start
# or
deno task dev
```

### Run all tests (headless)
```bash
deno task test
```

### Run tests with UI (headed mode)
```bash
deno task test:ui
```

### Run tests with debugger
```bash
deno task test:debug
```

### Run specific test file
```bash
deno test --allow-net --allow-read --allow-run --allow-env tests/component.test.ts
```

### Run specific test suite
```bash
deno test --allow-net --allow-read --allow-run --allow-env tests/language.test.ts
```

## Test Structure

```
tests/
├── setup.ts              # Shared utilities and constants
├── component.test.ts     # Component rendering tests
├── controls.test.ts      # UI controls interaction tests
├── language.test.ts      # i18n and translation tests
├── date-timeline.test.ts # Date picker and timeline tests
├── features.test.ts      # Feature cards and toggles tests
└── integration.test.ts   # Integration and responsive tests
```

## Test Utilities (`setup.ts`)

### Constants
- `BASE_URL`: http://localhost:8000
- `TEST_LOCATIONS`: Predefined coordinates for testing (Skodstrup, Copenhagen, Arctic, Equator)
- `LANGUAGES`: All supported languages with codes and flags

### Helper Functions
- `waitForComponentReady(page)`: Wait for custom element and shadow DOM
- `getShadowElement(page, selector)`: Get element from shadow DOM
- `getShadowText(page, selector)`: Get text content from shadow DOM element
- `clickShadowElement(page, selector)`: Click element in shadow DOM
- `getAllShadowElements(page, selector)`: Get all matching shadow DOM elements

## Shadow DOM Testing

All tests interact with Shadow DOM elements using custom utility functions. Example:

```typescript
// Get text from shadow DOM
const headerText = await getShadowText(page, '.header h2');

// Click button in shadow DOM
await clickShadowElement(page, '#share-btn');

// Evaluate in shadow DOM context
const data = await page.evaluate(() => {
  const component = document.querySelector('sun-moon-info');
  const element = component?.shadowRoot?.querySelector('.selector');
  return element?.textContent;
});
```

## Coverage

Tests cover:
- ✅ All UI components and custom elements
- ✅ All interactive controls (buttons, toggles, search, date picker)
- ✅ All 5 languages with proper translations
- ✅ Responsive layouts (desktop, tablet, mobile)
- ✅ Timezone handling and time formatting
- ✅ State persistence (URL and localStorage)
- ✅ Feature toggles and tabs
- ✅ Map integration
- ✅ Edge cases (polar phenomena, no sunrise/sunset)
- ✅ Accessibility (Shadow DOM structure)

## CI/CD Integration

These tests can be integrated into CI/CD pipelines. Playwright will run in headless mode by default.

Example GitHub Actions:
```yaml
- name: Start Deno server
  run: deno task dev &
  
- name: Wait for server
  run: sleep 5

- name: Run tests
  run: deno task test
```

## Notes

- All tests use Shadow DOM utilities for Web Components
- Tests respect component lifecycle and async rendering
- Timeouts are used strategically for DOM updates
- Tests validate both structure and functionality
- Edge cases are covered (polar regions, timezone differences)
