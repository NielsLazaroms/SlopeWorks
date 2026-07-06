/**
 * Belgian build settings for `slopeworks.be`. Dutch content like the `.nl`
 * build, but self-canonical to `slopeworks.be` so the Belgian site ranks on its
 * own (matching the `nl-BE` hreflang) instead of consolidating into `.nl`.
 *
 * Swapped in for `environment.ts` by the `be` build configuration's
 * `fileReplacements` (see `angular.json`). Keep this in the same shape as
 * `environment.ts`.
 */
export const environment = {
  /** Locale forced into the prerendered HTML and its metadata. */
  prerenderLocale: 'nl',
  /** Public origin used for canonical / `og:url` during prerender. */
  prerenderOrigin: 'https://slopeworks.be',
};
