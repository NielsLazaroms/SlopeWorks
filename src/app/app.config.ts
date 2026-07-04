import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import {provideMnConfig} from 'mn-angular-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Land at the top of each interior page rather than keeping scroll position.
      withInMemoryScrolling({scrollPositionRestoration: 'top'}),
    ),
    ...provideMnConfig('mn-config.json5', false),
  ]
};
