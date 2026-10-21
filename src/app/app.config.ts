import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { LocationStrategy } from '@angular/common';

import { routes } from './app.routes';
import { TrailingSlashLocationStrategy } from './trailing-slash-location-strategy';
import {provideMnConfig} from 'mn-angular-lib/core';

/** Browser application providers: routing, hydration, HTTP and the MnLib config. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Reuse the prerendered DOM instead of destroying and re-rendering it on
    // bootstrap. Without this the client rebuilds the whole page from scratch,
    // which re-paints the LCP hero late (huge LCP "render delay"). `withEventReplay`
    // captures clicks made before hydration finishes and replays them after.
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    provideRouter(
      routes,
      // Land at the top of each interior page rather than keeping scroll position.
      withInMemoryScrolling({scrollPositionRestoration: 'top'}),
    ),
    // Links and the address bar use the canonical trailing-slash URLs (`/faq/`),
    // so internal links don't point at the host's slash redirect.
    {provide: LocationStrategy, useClass: TrailingSlashLocationStrategy},
    // MnConfigService loads the config and i18n files over HttpClient, so the
    // app must provide it. `withInterceptorsFromDi` lets the server build add a
    // disk-reading interceptor for prerendering (see `app.config.server.ts`).
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    ...provideMnConfig('mn-config.json5', false),
  ]
};
