/**
 * Build-time settings that differ per deployed locale / domain.
 *
 * This default file targets the **Dutch** build served on `slopeworks.nl` and
 * `slopeworks.be`. The English `slopeworks.eu` build swaps in
 * `environment.eu.ts` via the `eu` build configuration's `fileReplacements`
 * (see `angular.json`), so the same source produces two localized static sites.
 */
export const environment = {
  /** Locale forced into the prerendered HTML and its metadata. */
  prerenderLocale: 'nl',
  /** Public origin used for canonical / `og:url` during prerender. */
  prerenderOrigin: 'https://slopeworks.nl',
};
