# Sun & Moon Info Web App

A Deno-based web application that displays real-time sun and moon information using vanilla JavaScript Custom Elements.

## Features

- 🌍 **Auto Location Detection** - Detects your location via IP geolocation
- 🗺️ **Interactive Map** - Drag the marker to change location in real-time
- ☀️ **Sun Data** - Sunrise, sunset, solar noon, and daylight duration
- 🌙 **Moon Data** - Moonrise and moonset times
- 🌐 **Multi-language Support** - Danish, English, German, and Chinese
- 📊 **24-Hour Graph** - Visual timeline of day/night/twilight phases
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Runtime**: Deno
- **Frontend**: Vanilla JavaScript Web Components (Shadow DOM)
- **APIs**:
  - [SunCalc.js](https://github.com/mourner/suncalc) - Astronomical calculations
  - [IPInfo](https://ipinfo.io) - Location detection
  - [Leaflet](https://leafletjs.com/) - Interactive maps (OpenStreetMap tiles)

## Prerequisites

- [Deno](https://deno.land/) installed (v1.x or higher)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/suncalc-deno.git
   cd suncalc-deno
   ```

2. Add your Mapbox token:
   Run the application:
   ```bash
   deno run --allow-net --allow-read main.ts
   ```

3. Open your browser to:
   ```
   http://localhost:8000
   ```

4. **Use the app:**
   - Select your language from the dropdown (🌐)
   - The map will auto-detect your location
   - Drag the marker to change location and see updated sun/moon times
## Development

### Project Structure

```
suncalc-deno/
├── main.ts              # Deno HTTP server
├── index.html           # Entry HTML page
├── language-selector.js # Language selector component
├── translations.js      # i18n translations (da, en, de, zh)
├── sun-moon-info.js     # Web Component (custom element)
├── PRD.md               # Product Requirements Document
├── AGENTS.md            # Implementation rules
└── README.md            # This file
```

### Running Tests

```bash
deno test
```

### Component Usage

The app uses a custom HTML element:

```html
<sun-moon-info lat="56.2635" lng="10.3041"></sun-moon-info>
```

**Attributes**:
- `lat` - Latitude coordinate
- `lng` - Longitude coordinate

If no attributes are provided, the component auto-detects location via IP.

## HoInteractive Map**: Leaflet.js displays an OpenStreetMap with a draggable marker
3. **Real-time Updates**: Drag the marker to instantly update sun/moon calculations
4. **Data Calculation**: SunCalc.js calculates sun and moon times for your coordinates
5. **Multi-language**: Choose from Danish, English, German, or Chinese
6. **Rendering**: The Web Component displays:
   - Location name with 📍 emoji
   - Sun times (sunrise, sunset, solar noon, daylight duration)
   - Moon times (moonrise, moonset)
   - Interactive Leaflet map with draggable marker
   - 24-hour vertical bar graph showing day/night/twilight phases
7  - Moon times (moonrise, moonset)
   - Mapbox static map centered on your location
   - 24-hour vertical bar graph showing day/night/twilight phases
4. **Responsive Layout**: 
   -OpenStreetMap**: Free tile service (please respect usage policy)
   - Mobile (<768px): Stacked vertical layout

## API Limits

- **IPInfo**: 50,000 requests/month on free tier
- **Mapbox**: 50,000 static image requests/month on free tier
- **SunCalc**: No limits (client-side calculations via CDN)

## Browser Support

Modern browsers with Web Components support:
- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## License

MIT

## Contributing

This project follows the implementation rules in [AGENTS.md](AGENTS.md). Please read them before contributing.
Leaflet](https://leafletjs.com) for interactive maps
- [OpenStreetMap](https://www.openstreetmap.org) contributors for map tiles
## Acknowledgments

- [SunCalc](https://github.com/mourner/suncalc) by Vladimir Agafonkin
- [IPInfo](https://ipinfo.io) for geolocation services
- [Mapbox](https://www.mapbox.com) for map visualization
