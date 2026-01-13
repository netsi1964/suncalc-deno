# Sun & Moon Info Web App

A Deno-based web application that displays real-time sun and moon information using vanilla JavaScript Custom Elements.

## Features

- 🌍 **Auto Location Detection** - Detects your location via IP geolocation
- ☀️ **Sun Data** - Sunrise, sunset, solar noon, and daylight duration
- 🌙 **Moon Data** - Moonrise and moonset times
- 🗺️ **Interactive Map** - Shows your location on a Mapbox static map
- 📊 **24-Hour Graph** - Visual timeline of day/night/twilight phases
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Runtime**: Deno
- **Frontend**: Vanilla JavaScript Web Components (Shadow DOM)
- **APIs**:
  - [SunCalc.js](https://github.com/mourner/suncalc) - Astronomical calculations
  - [IPInfo](https://ipinfo.io) - Location detection
  - [Mapbox Static API](https://docs.mapbox.com/api/maps/static-images/) - Map visualization

## Prerequisites

- [Deno](https://deno.land/) installed (v1.x or higher)
- Mapbox API token (get one free at [mapbox.com](https://www.mapbox.com/))

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/suncalc-deno.git
   cd suncalc-deno
   ```

2. Add your Mapbox token:
   - Open `sun-moon-info.js`
   - Replace `YOUR_MAPBOX_TOKEN` with your actual token

3. Run the application:
   ```bash
   deno run --allow-net --allow-read main.ts
   ```

4. Open your browser to:
   ```
   http://localhost:8000
   ```

## Development

### Project Structure

```
suncalc-deno/
├── main.ts              # Deno HTTP server
├── index.html           # Entry HTML page
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

## How It Works

1. **Location Detection**: On load, the app fetches your location using IPInfo API
2. **Data Calculation**: SunCalc.js calculates sun and moon times for your coordinates
3. **Rendering**: The Web Component displays:
   - Location name with 📍 emoji
   - Sun times (sunrise, sunset, solar noon, daylight duration)
   - Moon times (moonrise, moonset)
   - Mapbox static map centered on your location
   - 24-hour vertical bar graph showing day/night/twilight phases
4. **Responsive Layout**: 
   - Desktop (>768px): 3-column grid layout
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

## Acknowledgments

- [SunCalc](https://github.com/mourner/suncalc) by Vladimir Agafonkin
- [IPInfo](https://ipinfo.io) for geolocation services
- [Mapbox](https://www.mapbox.com) for map visualization
