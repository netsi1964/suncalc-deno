# Tasks & Status

> **⚠️ CRITICAL**: This file MUST be updated whenever ANY code is implemented, modified, or removed. Always update task status before committing changes.

## 🚀 In Progress
- [ ] None

## 📋 To Do
- [ ] Set up environment variable for Mapbox token
- [ ] Add error boundary for API failures
- [ ] Add loading states for async operations
- [ ] Consider caching location detection result

## ✅ Completed
- [x] Create AGENTS.md and README.md
- [x] Add Deno server and HTML scaffold (main.ts, index.html, deno.json)
- [x] Add sun-moon-info custom element with Shadow DOM
- [x] Integrate SunCalc for sun and moon calculations
- [x] Add Mapbox static map visualization
- [x] Add 24-hour vertical bar graph
- [x] Add responsive layout and styling
- [x] Add text display for sun and moon data
- [x] Implement location detection with IPInfo API
- [x] Add fallback to Skodstrup (56.2635, 10.3041)
- [x] Implement time formatting (HH:MM local)
- [x] Calculate daylight duration (xh ym format)
- [x] Add mobile responsive layout (<768px)
- [x] Add desktop 3-column grid layout (>768px)
- [x] Fix linting errors in main.ts and add documentation
- [x] Organize documentation into docs/ folder
- [x] Remove sky gradient feature (static gradient only)
- [x] Implement UV-index feature with levels and recommendations
- [x] Make app more compact to fit 100% in HD screen (reduced padding/margins/heights)
- [x] Move app title and language selector into header (3-column flexbox layout)
- [x] Add reverse geocoding with Nominatim API for marker location names
- [x] Simplify timeline to 24-hour view (0:00-24:00) for marker location
- [x] Fix timeline to use same timezone conversion as formatTime (longitude-based offset)
- [x] Handle polar night and midnight sun (locations where sun doesn't rise/set)
- [x] Add share button with copy-to-clipboard functionality
- [x] Add Chinese (🇨🇳) and Spanish (🇪🇸) language support
- [x] Add country flag emojis to language selector
- [x] Add GPS location button to fetch user's current position
- [x] Add location search field with Nominatim geocoding (search for cities/places)
- [x] Fix map and controls re-initialization when changing language
- [x] Swap location-controls and map-container positions
- [x] Fix search working multiple times by re-attaching event listeners after render
- [x] Increase location-controls height to better utilize available space
- [x] Add Playwright end-to-end testing framework
- [x] Create comprehensive test suite covering all UI components
- [x] Add test utilities for Shadow DOM interaction
- [x] Write tests for language switching and i18n
- [x] Add responsive layout tests (desktop, tablet, mobile)
- [x] Test timezone handling and polar phenomena
- [x] Add test commands to deno.json (test, test:ui, test:debug)

## 💡 Future Ideas
See [FEATURE_IDEAS.md](FEATURE_IDEAS.md) for long-term enhancements.

## 🔴 Blocked
- [ ] None

## 📝 Notes
- All core features from [plan.md](plan.md) are complete
- See [TESTING.md](TESTING.md) for detailed acceptance criteria validation
- Mapbox token is currently placeholder - users must configure their own
