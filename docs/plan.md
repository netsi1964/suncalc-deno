# Plan: Feature-Based Implementation with Git Commits

Build the Sun & Moon Info web app as a series of independently committable features, creating AGENTS.md to guide implementation and ensure each feature is properly versioned.

## Steps

1. **Create AGENTS.md and README.md** — Document agent-based implementation rules derived from PRD.md requirements (Shadow DOM, no frameworks, Deno runtime, SunCalc/IPInfo/Mapbox APIs) and setup instructions. Commit: "docs: Add AGENTS.md and README.md"

2. **Feature 1: Project scaffolding** — Create main.ts Deno HTTP server, index.html entry page, optional deno.json config. Verify server runs with `deno run --allow-net --allow-read main.ts`. Commit: "feat: Add Deno server and HTML scaffold"

3. **Feature 2: Custom Element foundation** — Implement sun-moon-info.js Web Component with Shadow DOM, component registration, and internal structure (`.header`, `.text-info`, `.map-container`, `.graph-container`). Commit: "feat: Add sun-moon-info custom element with Shadow DOM"

4. **Feature 3: Location detection** — Integrate IPInfo API for IP geolocation with fallback to Skodstrup (56.2635, 10.3041), extract city name, pass coordinates to component via `lat`/`lng` attributes. Commit: "feat: Add IP-based location detection with fallback"

5. **Feature 4: Sun & Moon data integration** — Load SunCalc from CDN, implement `getTimes()` and `getMoonTimes()`, format times as HH:MM local, calculate daylight duration (xh ym), handle moon day transitions. Commit: "feat: Integrate SunCalc for sun and moon calculations"

6. **Feature 5: Text display rendering** — Render location header ("📍 [City]"), sun times (sunrise/sunset/solar noon/daylight duration), moon times in `.text-info` section. Commit: "feat: Add text display for sun and moon data"

7. **Feature 6: Mapbox static map** — Generate Mapbox Static API URL with coordinates, embed image in `.map-container`, style container. Commit: "feat: Add Mapbox static map visualization"

8. **Feature 7: 24-hour bar graph** — Calculate time segments (night/twilight/daylight), render vertical bar with proportional segments using colors (#2c3e50, #e74c3c, #3498db), add hour labels 0-24 in `.graph-container`. Commit: "feat: Add 24-hour vertical bar graph"

9. **Feature 8: Responsive styling** — Implement Shadow DOM CSS with Segoe UI/Tahoma/Verdana font stack, 3-column CSS Grid for >768px, stacked layout for <768px, smooth transitions. Commit: "feat: Add responsive layout and styling"

10. **Feature 9: Testing and validation** — Test location detection, SunCalc accuracy, responsive breakpoints, cross-browser compatibility, verify acceptance criteria from PRD.md. Commit: "test: Validate all features and acceptance criteria"

## Further Considerations

1. **AGENTS.md structure** — Should it include specific code patterns (Shadow DOM templates, fetch error handling), or just high-level feature boundaries and rules? Option A: Detailed code guidelines / Option B: High-level feature gates only

2. **Mapbox access token** — How should the token be managed? Option A: Environment variable read by main.ts / Option B: Hardcoded in component (noted as dev-only in AGENTS.md) / Option C: Placeholder with setup instructions in README

3. **Commit granularity** — Should sub-features be broken down further? For example, Feature 4 could split into "feat: Load SunCalc from CDN" and "feat: Calculate and format sun/moon times" for smaller commits.

4. **Error handling strategy** — Should there be a dedicated feature/commit for error handling (API failures, missing Mapbox token, invalid coordinates), or should error handling be integrated into each feature as it's built?
