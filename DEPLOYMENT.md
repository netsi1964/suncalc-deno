# GitHub Pages Deployment

Denne app er konfigureret til automatisk deployment på GitHub Pages.

## Setup

1. **Push til GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **Aktiver GitHub Pages:**
   - Gå til repository Settings → Pages
   - Under "Source" vælg: **GitHub Actions**
   - Deployment sker automatisk ved push til main branch

3. **Tilgå appen:**
   - URL: `https://[dit-brugernavn].github.io/suncalc-deno/`
   - Første deployment tager 1-2 minutter

## Automatisk Deployment

Workflow filen `.github/workflows/deploy.yml` håndterer:
- ✅ Automatisk build ved push til main
- ✅ Upload af statiske filer
- ✅ Deployment til GitHub Pages

## Lokal Test

Appen kan stadig køres lokalt:
```bash
deno run --allow-net --allow-read main.ts
```

## Filer til GitHub Pages

- `.nojekyll` - Disable Jekyll processing
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- Alle `.html`, `.js`, `.css` filer serves direkte

## Ingen Build Step Nødvendig

Appen bruger vanilla JavaScript og kræver ingen build process.
GitHub Pages server filerne direkte som de er i repositoryet.
