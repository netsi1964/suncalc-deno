# AGENTS.MD - Implementation Rules

## ⚠️ CRITICAL: Task Tracking Rule

**MANDATORY**: Before implementing ANY feature, bug fix, or code change:
1. Update [tasks.md](tasks.md) to reflect current task status
2. Move the relevant task to "In Progress" section
3. After implementation, move task to "Completed" section
4. NEVER commit code without updating tasks.md first

**tasks.md is the single source of truth for project status.**

## Core Architectural Rules

### Component Architecture
- **MUST** use vanilla JavaScript Custom Elements (Web Components)
- **MUST** use Shadow DOM for style encapsulation
- **FORBIDDEN**: React, Vue, Angular, or any framework
- **FORBIDDEN**: Global CSS - all styles must be in Shadow DOM
- **Component Tag**: `<sun-moon-info lat="56.2635" lng="10.3041">`
- **Required Attributes**: `lat` and `lng` (coordinate values)

### Internal Component Structure
Every custom element must implement these internal sections:
```
.header         - Location title with emoji
.text-info      - Sun and moon textual data
.map-container  - Mapbox static image
.graph-container - 24-hour vertical bar graph
```

### Runtime & Dependencies
- **Runtime**: Deno only (no Node.js)
- **Run Command**: `deno run --allow-net --allow-read main.ts`
- **No Build Step**: Serve vanilla JS directly
- **External Dependencies**:
  - SunCalc.js (CDN): `https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.8.0/suncalc.min.js`
  - IPInfo API: `https://ipinfo.io/json`
  - Mapbox Static API: Requires access token

### API Integration Patterns

#### Location Detection
```javascript
// Auto-detect via IP geolocation
fetch('https://ipinfo.io/json')
  .then(res => res.json())
  .then(data => {
    const [lat, lng] = data.loc.split(',');
    const city = data.city;
    // Use coordinates and city name
  })
  .catch(err => {
    // FALLBACK: Skodstrup, Denmark
    const lat = 56.2635;
    const lng = 10.3041;
    const city = 'Skodstrup';
  });
```

#### SunCalc Integration
```javascript
// Sun times
const times = SunCalc.getTimes(new Date(), lat, lng);
// Available: sunrise, sunset, solarNoon, dawn, dusk, etc.

// Moon times
const moonTimes = SunCalc.getMoonTimes(new Date(), lat, lng);
// Available: rise, set (may be undefined if no rise/set that day)
```

### Data Formatting Rules

#### Time Display
- **Format**: HH:MM (local time)
- **Library**: Use native `toLocaleTimeString()` with options:
  ```javascript
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  ```

#### Daylight Duration
- **Format**: `xh ym` (e.g., "8h 24m")
- **Calculation**: 
  ```javascript
  const duration = sunset - sunrise; // milliseconds
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
  ```

#### Location Display
- **Format**: `📍 [City Name]`
- **Example**: "📍 Skodstrup"

#### Moon Day Transitions
- **Rule**: Handle cases where moonrise/moonset times span to the next day
- **Display**: Indicate next-day times appropriately

### Visual Specifications

#### Typography
- **Font Stack**: `Segoe UI, Tahoma, Verdana, sans-serif`
- **Headings**: Bold
- **Time Values**: Bold for emphasis

#### Color Palette
| Phase    | Hex Code  | Usage                |
|----------|-----------|----------------------|
| Night    | #2c3e50   | Dark gray - night    |
| Twilight | #e74c3c   | Red - dawn/dusk      |
| Daylight | #3498db   | Blue - daylight      |

#### 24-Hour Bar Graph Requirements
- **Type**: Vertical bar with proportional segments
- **Segments**: Night → Twilight → Daylight → Twilight → Night
- **Hour Labels**: 0-24 (fixed position, don't scale)
- **Segment Sizing**: Calculate based on actual sunrise/sunset/twilight times
- **Twilight Times**: Use `dawn` and `dusk` from SunCalc

### Responsive Layout Rules

#### Desktop (>768px)
```css
display: grid;
grid-template-columns: 1fr 1fr 1fr;
/* Layout: text-info | map-container | graph-container */
```

#### Mobile (<768px)
```css
display: flex;
flex-direction: column;
/* Stacked: header → text-info → map-container → graph-container */
```

#### Transitions
- **Required**: Smooth layout transitions on resize
- **Breakpoint**: 768px

### Security & Privacy Rules
- **FORBIDDEN**: Backend services
- **FORBIDDEN**: User tracking or analytics
- **FORBIDDEN**: Storing user data
- **Client-side only**: All API calls from browser
- **Public APIs**: Only use public, no-auth APIs (except Mapbox token)

### Mapbox Token Management
- **Development**: Hardcoded token with comment noting it's dev-only
- **Production**: Should be replaced with environment variable
- **Static API URL Pattern**:
  ```
  https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/
  pin-s+e74c3c(${lng},${lat})/${lng},${lat},12,0/400x300@2x
  ?access_token=YOUR_TOKEN
  ```

### Error Handling Strategy
- **Location Detection**: Always provide fallback to Skodstrup
- **API Failures**: Show graceful error messages in component
- **Missing Data**: Display "N/A" or "—" for unavailable times
- **Invalid Coordinates**: Validate `lat` and `lng` attributes

### Out of Scope (v1)
These features must NOT be implemented:
- ❌ Manual location search
- ❌ Real-time sun/moon position tracking
- ❌ Lunar phase graphics
- ❌ Voice assistant integration
- ❌ User accounts or persistence
- ❌ Backend server logic

### Testing Checklist
Before committing each feature, verify:
- [ ] Component renders without errors in Deno
- [ ] Shadow DOM isolates styles (no global leakage)
- [ ] Works with custom `lat`/`lng` attributes
- [ ] Responsive at 768px breakpoint
- [ ] Times are accurate for current location
- [ ] No framework dependencies imported
- [ ] Follows PRD specifications exactly

### Git Commit Convention
- **Docs**: `docs: Description`
- **Features**: `feat: Description`
- **Tests**: `test: Description`
- **Fixes**: `fix: Description`
- **Refactor**: `refactor: Description`

### Feature Gates
Each feature should be independently committable and functional:
1. ✅ Documentation (AGENTS.md, README.md)
2. ✅ Basic scaffolding (server runs, HTML loads)
3. ✅ Custom element (renders, Shadow DOM works)
4. ✅ Location detection (IP geolocation + fallback)
5. ✅ Sun/moon data (SunCalc integration)
6. ✅ Text display (formatted times visible)
7. ✅ Map visualization (Mapbox static image)
8. ✅ Bar graph (visual timeline)
9. ✅ Responsive layout (mobile + desktop)
10. ✅ Testing validation (all criteria met)

## Acceptance Criteria (from PRD)
1. App renders without errors in Deno
2. Component loads and shows correct location
3. Sun and moon info are accurate for the day
4. Vertical bar graph is readable and properly aligned
5. Fully responsive (mobile + desktop)
6. Only uses SunCalc, Mapbox, and IPInfo (no other dependencies)
