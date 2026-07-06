/**
 * Post-build step: point a build's static `robots.txt` and `sitemap.xml` at the
 * domain it will be deployed to.
 *
 * `robots.txt` and `sitemap.xml` are shipped as-is from `public/` and default to
 * the primary domain (slopeworks.nl). For the English `slopeworks.eu` build (and
 * any future per-domain build) this rewrites:
 *   - the `Sitemap:` directive in robots.txt to this domain, and
 *   - each `<loc>` in sitemap.xml to this domain (the hreflang alternates, which
 *     list every language version, are left untouched).
 *
 * Usage: node scripts/localize-static.mjs <outputDir> <origin>
 *   e.g. node scripts/localize-static.mjs dist/slopeworks-eu/browser https://slopeworks.eu
 */
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

/** The origin baked into the source `public/` files, replaced with the target. */
const SOURCE_ORIGIN = 'https://slopeworks.nl';

const [dir, origin] = process.argv.slice(2);
if (!dir || !origin) {
  console.error('usage: node scripts/localize-static.mjs <outputDir> <origin>');
  process.exit(1);
}

/** Rewrites the `Sitemap:` line so each domain advertises its own sitemap. */
const robots = join(dir, 'robots.txt');
if (existsSync(robots)) {
  const txt = readFileSync(robots, 'utf8').replace(/^Sitemap:.*$/m, `Sitemap: ${origin}/sitemap.xml`);
  writeFileSync(robots, txt);
}

/** Rewrites every `<loc>` to this domain; leaves the per-language alternates. */
const sitemap = join(dir, 'sitemap.xml');
if (existsSync(sitemap) && origin !== SOURCE_ORIGIN) {
  const escaped = SOURCE_ORIGIN.replace(/[.]/g, '\\$&');
  const xml = readFileSync(sitemap, 'utf8').replace(new RegExp(`(<loc>)${escaped}`, 'g'), `$1${origin}`);
  writeFileSync(sitemap, xml);
}

console.log(`localized ${dir} -> ${origin}`);
