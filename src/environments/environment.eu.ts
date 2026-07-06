/**
 * English build settings for `slopeworks.eu`. Swapped in for
 * `environment.ts` by the `eu` build configuration's `fileReplacements`
 * (see `angular.json`). Keep this in the same shape as `environment.ts`.
 */
export const environment = {
  /** Locale forced into the prerendered HTML and its metadata. */
  prerenderLocale: 'en',
  /** Public origin used for canonical / `og:url` during prerender. */
  prerenderOrigin: 'https://slopeworks.eu',
};
