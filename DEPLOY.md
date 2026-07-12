# Deploy

SlopeWorks ships as **static prerendered HTML** (Angular SSG). There is no Node
server at runtime — each build produces a folder of static files that is uploaded
to the matching domain's web root (e.g. `public_html`) over FTP.

There are **three domains, two languages**, so there are **three builds** — one
per domain. Each build bakes its own language, canonical URL, `robots.txt`, and
`sitemap.xml`, so every domain ranks independently and the `hreflang` cluster
stays consistent.

## Build → domain map

| Command | Output folder | Deploy to | Language | Canonical host |
| --- | --- | --- | --- | --- |
| `npm run build` | `dist/SlopeWorks/browser/` | **slopeworks.nl** | Dutch | `slopeworks.nl` |
| `npm run build:be` | `dist/slopeworks-be/browser/` | **slopeworks.be** | Dutch | `slopeworks.be` |
| `npm run build:eu` | `dist/slopeworks-eu/browser/` | **slopeworks.eu** | English | `slopeworks.eu` |
| `npm run build:all` | all three of the above | — | — | — |

Upload the **contents of the `browser/` folder** (not the folder itself) to each
domain's web root.

> ⚠️ **The one rule:** deploy each `dist/` folder to its matching domain only.
> The language and canonical URL are baked into the static HTML at build time, so
> putting the `.eu` (English) build on `slopeworks.nl` — or vice versa — serves
> the wrong language to crawlers and breaks canonical/`hreflang`.

## What each build bakes

- **Language** — `<html lang>`, page titles, meta descriptions, `og:locale`, and
  all JSON-LD text. Dutch for `.nl`/`.be`, English for `.eu`.
- **Canonical + `og:url`** — self-referential to that domain.
- **`robots.txt`** — its `Sitemap:` line points at that domain's sitemap.
- **`sitemap.xml`** — each `<loc>` is that domain's URL; the `hreflang`
  alternates still list all three domains.
- **`llms.txt`** — a root-level summary of the brand, services and key pages for
  AI crawlers. Its URLs point at that domain, and the English `.eu` build swaps
  in the English body (`llms.en.txt`).

Runtime language is unchanged and still **domain-based** (mn-lib's
`domainLocaleMap` in `public/mn-config.json5`): `.nl`/`.be` → `nl`, `.eu` → `en`.
The per-domain builds simply make the *static* HTML match what the browser
resolves, so there is no language flash and crawlers see the right language
immediately.

## After deploy

Submit each domain's sitemap in **its own Google Search Console property**:

- `https://slopeworks.nl/sitemap.xml`
- `https://slopeworks.be/sitemap.xml`
- `https://slopeworks.eu/sitemap.xml`

## How it works (for maintainers)

- **Locale + origin per build** live in `src/environments/environment*.ts`
  (`environment.ts` = nl/`.nl`, `environment.be.ts`, `environment.eu.ts`).
- `src/app/app.config.server.ts` forces `environment.prerenderLocale` during
  prerender; `SeoService` uses `environment.prerenderOrigin` for the canonical
  host on the server (the browser stays on its live origin).
- `angular.json` has a build **configuration per domain** (`be`, `eu`) that swaps
  the environment file via `fileReplacements` and sets `outputPath`. The default
  `production` build is `.nl`.
- Each `build*` script chains `scripts/localize-static.mjs <dir> <origin> <locale>`,
  which rewrites the built `robots.txt`, `sitemap.xml` `<loc>`s and `llms.txt` to
  that domain, and picks the English `llms.txt` body for the `en` build.
- Prerendered routes are defined in `src/app/app.routes.server.ts` (all routes,
  with the six destination slugs enumerated).

### Adding another domain/locale

1. Add `src/environments/environment.<x>.ts` with its `prerenderLocale` +
   `prerenderOrigin`.
2. Add a `<x>` configuration in `angular.json` (copy the `eu` block, change the
   file + `outputPath`).
3. Add a `build:<x>` script (copy `build:eu`, change the configuration name,
   output dir, and origin) and include it in `build:all`.
4. If it introduces a new language, make sure `public/assets/i18n/<locale>.json`
   exists and `preload` in `mn-config.json5` includes it.
