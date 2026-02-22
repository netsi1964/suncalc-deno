# Sun & Moon Info Web App

A web application that displays real-time sun and moon information using vanilla JavaScript Custom Elements.

## 🌐 Live Demo

**[https://netsi1964.github.io/suncalc-deno/](https://netsi1964.github.io/suncalc-deno/)**

## Features

- 🌍 **Auto Location Detection** - Detects your location via IP geolocation
- 🗺️ **Interactive Map** - Drag the marker to change location in real-time
- ☀️ **Sun Data** - Sunrise, sunset, solar noon, and daylight duration
- 🌙 **Moon Data** - Moonrise and moonset times
- 🌐 **Multi-language Support** - Danish, English, German, and Chinese
- 📊 **24-Hour Graph** - Visual timeline of day/night/twilight phases
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Vanilla JavaScript Web Components (Shadow DOM)
- **Dev Server**: http-server (for local development)
- **APIs**:
  - [SunCalc.js](https://github.com/mourner/suncalc) - Astronomical calculations
  - [IPInfo](https://ipinfo.io) - Location detection
  - [Leaflet](https://leafletjs.com/) - Interactive maps (OpenStreetMap tiles)

## Prerequisites

- [Node.js](https://nodejs.org/) installed (v18 or higher)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/suncalc-deno.git
   cd suncalc-deno
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

4. Open your browser to:
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
suncalc-desktop/
├── index.html           # Entry HTML page
├── language-selector.js # Language selector component
├── translations.js      # i18n translations (da, en, de, zh, es)
├── sun-moon-info.js     # Web Component (custom element)
├── electron/            # Electron desktop app
├── tests/               # Playwright E2E tests
└── README.md            # This file
```

### Running Tests

```bash
npm test
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

## Desktop App (Neutralino)

A lightweight alternative to Electron using [Neutralino.js](https://neutralino.js.org/).

### Run (development)
```bash
npm run neutralino:dev
```

### Build standalone executable
```bash
npm run neutralino:build
```

Output is placed in the `dist/` folder. The CI/CD pipeline (`.github/workflows/neutralino-release.yml`) automatically builds a macOS `.app` bundle on every push to `main`.

#### 🍏 macOS Installation Guide (Important!)
Because this is a free Open-Source project, it does not use a paid Apple Developer Certificate ($99/year). As a result, macOS's security feature ("Gatekeeper") automatically places the downloaded app in "Quarantine" to protect you from unknown software, which prevents it from running.

You only need to remove this quarantine **once** using a simple Terminal command:

1. **Unzip** the downloaded app `.zip` file so you see the `.app` file.
2. Open the **Terminal** app on your Mac (you can find it via Spotlight Search: `Cmd + Space` -> "Terminal").
3. Type the following command, ending with a single space (do not press enter yet):
   ```bash
   xattr -cr
   ```
4. **Drag and drop** the `.app` file from Finder directly into the Terminal window. This will automatically paste the correct file path.
5. Press **Enter**. (It won't show any success message, it just goes to the next line).
6. You're done! You can now **double-click** the app in Finder to open it normally forever.

---

## Desktop App (Electron)

You can also run the project as a desktop app using Electron.

### Requirements
- Node.js installed
- npm dependencies installed (`npm install`)

### Run Electron app
```bash
npm run electron
```

Electron loads the app directly from local files without requiring a web server.

## Desktop builds & GitHub Releases

Der er nu build scripts til Electron-pakker for alle platforme:

```bash
npm run dist:mac    # macOS (.dmg + .zip)
npm run dist:win    # Windows (.exe/.nsis + .zip)
npm run dist:linux  # Linux (.AppImage + .deb + .tar.gz)
npm run dist:all    # Bygger alle platform targets
npm run release     # Bygger + publicerer til GitHub Releases
```

Output placeres i mappen `release/`.

### Hent seneste version fra GitHub Releases

- **Release side (seneste):**
  `https://github.com/netsi1964/suncalc-deno/releases/latest`

- **Direkte link til alle releases:**
  `https://github.com/netsi1964/suncalc-deno/releases`

### Installer på din platform

- **macOS**
  1. Gå til `releases/latest` linket ovenfor.
  2. Download filen `SunCalc Desktop-<version>.dmg` (eller `.zip`).
  3. Åbn `.dmg` og træk appen til **Applications**.

- **Windows**
  1. Gå til `releases/latest`.
  2. Download `SunCalc Desktop Setup <version>.exe` (NSIS installer).
  3. Kør installationsfilen og følg guiden.

- **Linux**
  1. Gå til `releases/latest`.
  2. Download enten `*.AppImage`, `*.deb` eller `*.tar.gz`.
  3. For AppImage: gør filen eksekverbar (`chmod +x <fil>.AppImage`) og start den.
