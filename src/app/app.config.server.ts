import {
  ApplicationConfig,
  inject,
  mergeApplicationConfig,
  provideAppInitializer,
} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {MnConfigService, MnLanguageService} from 'mn-angular-lib';

import {appConfig} from './app.config';
import {serverRoutes} from './app.routes.server';
import {ServerAssetInterceptor} from './interceptors/server-asset.interceptor';

/**
 * Locale baked into the prerendered HTML. The static build is deployed to
 * slopeworks.nl (a Dutch market), and without a browser `window` mn-lib's
 * domain-based locale resolution falls back to the config default (`en`).
 * Forcing Dutch keeps the served HTML in the visitor's language.
 */
const PRERENDER_LOCALE = 'nl';

/** Upper bound on poll iterations while waiting for the config to load. */
const CONFIG_WAIT_MAX_TICKS = 1000;

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {provide: HTTP_INTERCEPTORS, useClass: ServerAssetInterceptor, multi: true},
    provideAppInitializer(async () => {
      const config = inject(MnConfigService);
      const lang = inject(MnLanguageService);

      // `provideMnConfig` loads the config (and its language section) in its own
      // initializer, which runs concurrently with this one. Wait for that to
      // finish — signalled by a bumped config version — then force the locale.
      for (let tick = 0; config.configVersion() === 0 && tick < CONFIG_WAIT_MAX_TICKS; tick++) {
        await new Promise((resolve) => setTimeout(resolve));
      }

      try {
        await lang.setLocale(PRERENDER_LOCALE);
      } catch {
        // If the config failed to load the language never configured; render
        // with whatever locale is active rather than aborting the prerender.
      }
    }),
  ],
};

/** Server application config: the browser config plus prerender-only providers. */
export const config = mergeApplicationConfig(appConfig, serverConfig);
