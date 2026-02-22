# SunCalc — Sun & Moon Info

Real-time sun and moon data for any location on Earth. Drag the map marker, pick a date, and instantly see sunrise, sunset, moonrise, moonset, and a 24-hour day/night timeline.

## Try it

| Option | How |
|--------|-----|
| 🌐 **Browser (no install)** | [netsi1964.github.io/suncalc-deno](https://netsi1964.github.io/suncalc-deno/) |
| 🖥️ **Desktop app (download)** | [github.com/netsi1964/suncalc-deno/releases](https://github.com/netsi1964/suncalc-deno/releases) |
| 🛠️ **Run locally** | See [Development](#development) below |

---

## Desktop App

Download the latest release for your platform from **[Releases](https://github.com/netsi1964/suncalc-deno/releases)**.

Two desktop builds are available per release:

| Build | Size | Platforms | Notes |
|-------|------|-----------|-------|
| **Electron** | ~150 MB | macOS, Windows, Linux | Full Chromium runtime included |
| **Neutralino** | ~2 MB | macOS | Lightweight, uses system WebView |

### Installation

**macOS (both builds)**

> Because this project is open-source and not signed with a paid Apple Developer Certificate, macOS Gatekeeper will quarantine the downloaded app. Remove the quarantine once with this Terminal command:
>
> ```bash
> xattr -cr /path/to/SunCalc.app
> ```
>
> Tip: type `xattr -cr ` (with a trailing space), then drag the `.app` from Finder into Terminal — it will paste the path automatically. Press Enter, then double-click the app normally.

**Windows (Electron)**

Download and run `SunCalc-Setup-<version>.exe`.

**Linux (Electron)**

Download `.AppImage`, `.deb`, or `.tar.gz` from the release page.
For AppImage: `chmod +x SunCalc-<version>.AppImage && ./SunCalc-<version>.AppImage`

---

## Features

- 📍 **Auto location detection** via IP geolocation (overridable)
- 🗺️ **Interactive map** — drag the marker to any location
- ☀️ **Sun data** — sunrise, sunset, solar noon, daylight duration
- 🌙 **Moon data** — moonrise, moonset (shows `+1` when moonset falls the next day)
- 📊 **24-hour timeline** — day/night/twilight phases with a live "now" marker
- 📅 **Date picker** — browse any date
- 🌐 **5 languages** — Danish, English, German, Chinese, Spanish

---

## Development

### Requirements

- Node.js v18+

### Setup

```bash
git clone https://github.com/netsi1964/suncalc-deno.git
cd suncalc-deno
npm install
```

### Run in browser

```bash
npm start
# → http://localhost:8000
```

### Run as Electron app

```bash
npm run electron
```

### Run as Neutralino app (macOS)

```bash
npm run neutralino:build
npm run neutralino:open
```

### Tests

```bash
npm test
```

---

## Releasing

Push a version tag to trigger both Electron and Neutralino builds on GitHub Actions. Both are uploaded to the same GitHub Release automatically.

```bash
npm run release:patch   # 1.0.0 → 1.0.1
npm run release:minor   # 1.0.0 → 1.1.0
npm run release:major   # 1.0.0 → 2.0.0
```

---

## Tech Stack

- **UI**: Vanilla JavaScript Web Components (no framework)
- **Astronomy**: [SunCalc.js](https://github.com/mourner/suncalc) by Vladimir Agafonkin
- **Maps**: [Leaflet](https://leafletjs.com/) + OpenStreetMap
- **Location**: [IPInfo](https://ipinfo.io)
- **Desktop (heavy)**: [Electron](https://www.electronjs.org/) + electron-builder
- **Desktop (light)**: [Neutralino.js](https://neutralino.js.org/)
- **CI/CD**: GitHub Actions

---

## License

MIT
