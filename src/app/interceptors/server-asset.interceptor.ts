import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {Observable, of} from 'rxjs';

/**
 * Serves the config and i18n files from disk during prerendering.
 *
 * `MnConfigService` and `MnLanguageService` fetch `mn-config.json5` and
 * `assets/i18n/{locale}.json` over `HttpClient` with relative URLs. In the
 * browser those resolve against the page origin, but during a Node prerender
 * there is no server to answer them — the requests would fail and the pages
 * would render empty. This interceptor short-circuits those relative requests
 * by reading the file straight from the build inputs.
 *
 * Registered only in the server build (`app.config.server.ts`); the browser
 * bundle never imports this file, so its Node `fs` usage stays out of it.
 */
@Injectable()
export class ServerAssetInterceptor implements HttpInterceptor {
  /** Directories searched, in order, for a requested asset. */
  private static readonly BASES = [
    join(process.cwd(), 'public'),
    join(process.cwd(), 'dist', 'SlopeWorks', 'browser'),
  ];

  /**
   * Resolves relative `*.json`/`*.json5` requests from disk; passes everything
   * else through untouched.
   *
   * @param req The outgoing request.
   * @param next The next handler in the chain.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const path = req.url.split(/[?#]/)[0];
    if (/^https?:\/\//i.test(path) || !/\.json5?$/i.test(path)) {
      return next.handle(req);
    }

    const rel = path.replace(/^\//, '');
    for (const base of ServerAssetInterceptor.BASES) {
      const file = join(base, rel);
      if (existsSync(file)) {
        const text = readFileSync(file, 'utf8');
        const body = req.responseType === 'json' ? JSON.parse(text) : text;
        return of(new HttpResponse({status: 200, url: req.url, body}));
      }
    }
    return next.handle(req);
  }
}
