# Sun & Moon Info Web App - Development Instructions

## ⚠️ CRITICAL: Task Tracking

**BEFORE implementing ANY code changes:**
1. Check [tasks.md](tasks.md) for current project status
2. Update task status to "In Progress" before starting work
3. Update task status to "Completed" after finishing implementation
4. ALWAYS keep tasks.md synchronized with actual code state

**tasks.md is the authoritative source for all project tasks and their status.**

## Project Overview
Deno-based web app displaying real-time sun and moon information using vanilla JavaScript Custom Elements (Web Components). No frameworks - pure Shadow DOM encapsulation.

## Architecture

### Core Component
- `<sun-moon-info>` custom element with attributes: `lat` and `lng`
- Shadow DOM for style isolation
- Self-contained: no global styles or framework dependencies

### Key Dependencies
- **SunCalc.js** (CDN): `SunCalc.getTimes()` and `SunCalc.getMoonTimes()` for calculations
- **IPInfo API**: `https://ipinfo.io/json` for location detection
- **Mapbox Static API**: Static map images (requires access token)

## Critical Patterns

### Location Handling
- Auto-detect via IP geolocation first
- Fallback to Skodstrup, Denmark (default) on failure
- Display format: "📍 [City Name]"

### Time Display Format
- Daylight duration: `xh ym` (e.g., "8h 24m")
- Times in local format (HH:MM)
- Moon times may span to next day - handle day transitions

### Layout Structure
Internal component structure:
- `.header` - Location title
- `.text-info` - Sun/moon times (textual)
- `.map-container` - Mapbox static image
- `.graph-container` - 24-hour vertical bar graph with hour labels

### Responsive Breakpoints
- **>768px**: CSS Grid 3-column (text | map | graph)
- **<768px**: Stacked vertical layout

### Visual Graph Requirements
24-hour vertical bar graph with proportional segments:
- **Night**: #2c3e50 (dark gray)
- **Twilight**: #e74c3c (red)
- **Daylight**: #3498db (blue)
- Hour labels 0-24 stay fixed on resize

## Development Commands
- **Run**: `deno run --allow-net --allow-read main.ts`
- **Test**: Use Deno's built-in test runner
- No build step required - vanilla JS served directly

## Code Style
- Use **Segoe UI, Tahoma, Verdana** font stack
- Semantic HTML within Shadow DOM
- CSS Grid/Flexbox for layouts
- No TypeScript compilation (unless explicitly added)

## What NOT to Do
- ❌ Don't add frameworks (React, Vue, etc.)
- ❌ Don't use global CSS - Shadow DOM only
- ❌ Don't implement manual location search (v1 out of scope)
- ❌ Don't add user tracking or backend persistence

## Reference
See [PRD.md](PRD.md) for complete feature specifications and acceptance criteria.
