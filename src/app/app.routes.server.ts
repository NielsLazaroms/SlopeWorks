import {RenderMode, ServerRoute} from '@angular/ssr';

/** Every scouted destination that has a detail page (used to prerender slugs). */
const DESTINATION_SLUGS = [
  'solden',
  'mayrhofen',
  'st-anton',
  'kitzbuhel',
  'zell-am-see',
  'gstaad',
];

/**
 * Server rendering rules. The site is fully static, so every route is
 * prerendered at build time; the parameterised destination route enumerates
 * its slugs explicitly.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'bestemmingen/:slug',
    renderMode: RenderMode.Prerender,
    /** Supplies the slug set so each destination gets its own static page. */
    getPrerenderParams: async () => DESTINATION_SLUGS.map((slug) => ({slug})),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
