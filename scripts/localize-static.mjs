/**
 * Post-build step: point a build's static `robots.txt`, `sitemap.xml` and
 * `llms.txt` at the domain (and, for `llms.txt`, the language) it ships to.
 *
 * These files are shipped as-is from `public/` and default to the primary domain
 * (slopeworks.nl) and Dutch. For each per-domain build this rewrites:
 *   - the `Sitemap:` directive in robots.txt to this domain,
 *   - each `<loc>` in sitemap.xml to this domain (the hreflang alternates, which
 *     list every language version, are left untouched), and
 *   - `llms.txt`: its URLs to this domain, and — for an English build — its body
 *     from the English source (`llms.en.txt`), which is then removed from the
 *     output so it is never served on its own.
 *
 * Usage: node scripts/localize-static.mjs <outputDir> <origin> [locale]
 *   e.g. node scripts/localize-static.mjs dist/slopeworks-eu/browser https://slopeworks.eu en
 */
import {copyFileSync, existsSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

/** The origin baked into the source `public/` files, replaced with the target. */
const SOURCE_ORIGIN = 'https://slopeworks.nl';

const [dir, origin, locale = 'nl'] = process.argv.slice(2);
if (!dir || !origin) {
  console.error('usage: node scripts/localize-static.mjs <outputDir> <origin> [locale]');
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

/**
 * Localizes `llms.txt`: picks the English body for an English build, rewrites its
 * URLs to this domain, and drops the English source so it is not served on its own.
 */
const llms = join(dir, 'llms.txt');
const llmsEn = join(dir, 'llms.en.txt');
if (existsSync(llms)) {
  const source = locale === 'en' && existsSync(llmsEn) ? llmsEn : llms;
  let body = readFileSync(source, 'utf8');
  if (origin !== SOURCE_ORIGIN) {
    body = body.split(SOURCE_ORIGIN).join(origin);
  }
  writeFileSync(llms, body);
}
if (existsSync(llmsEn)) {
  rmSync(llmsEn);
}

/**
 * Appends `block` to the build's `.htaccess` unless `marker` is already present,
 * preserving any existing rules.
 *
 * @param {string} marker A line that identifies the block (used for idempotency).
 * @param {string} block The directives to append.
 */
function appendHtaccess(marker, block) {
  const htaccess = join(dir, '.htaccess');
  const existing = existsSync(htaccess) ? readFileSync(htaccess, 'utf8') : '';
  if (!existing.includes(marker)) {
    writeFileSync(htaccess, existing ? `${existing.trimEnd()}\n${block}\n` : `${block}\n`);
  }
}

/**
 * Collapse `www.` onto the bare domain with a 301 so each domain has one
 * indexable host (the canonical tags already point at the non-www origin).
 * Host-agnostic, so the same rule works on .nl, .be and .eu.
 */
const wwwMarker = '# Redirect www to the bare domain';
appendHtaccess(wwwMarker, [
  wwwMarker,
  '<IfModule mod_rewrite.c>',
  'RewriteEngine On',
  'RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]',
  'RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]',
  '</IfModule>',
].join('\n'));

/**
 * Wire up the 404 for direct (mistyped) URLs. On static hosting a request that
 * matches no file is served by the host, not Angular, so the prerendered
 * `/404` page is copied to a root `404.html` and an `.htaccess` points the
 * host's `ErrorDocument` at it — giving a real HTTP 404 with the branded page.
 * The Angular `**` route still handles bad in-app navigation client-side.
 */
const prerendered404 = join(dir, '404', 'index.html');
const served404 = join(dir, '404.html');
if (existsSync(prerendered404)) {
  copyFileSync(prerendered404, served404);
  const directive = 'ErrorDocument 404 /404.html';
  appendHtaccess(directive, directive);
}

console.log(`localized ${dir} -> ${origin} (${locale})`);
