import {isPlatformServer} from '@angular/common';
import {DOCUMENT, inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {MnLanguageService} from 'mn-angular-lib';
import {filter} from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Keeps the document title, meta description, canonical link, Open Graph tags
 * and `<html lang>` in sync with the active route and language.
 *
 * Each route declares a `data.seo` key (e.g. `'home'`); the title and
 * description are resolved from the `seo.<key>.*` i18n entries, so the metadata
 * is written in the same language as the page content — Dutch in the
 * prerendered build, and the visitor's language after client navigation.
 *
 * The site is client-rendered/prerendered, so these tags are written on every
 * navigation. Canonical and `og:url` are derived from the live origin, which
 * keeps them correct across the `.nl` / `.be` / `.eu` domains without
 * hard-coding a host.
 */
@Injectable({providedIn: 'root'})
export class SeoService {
  /** Suffix appended to every page title. */
  private static readonly TITLE_SUFFIX = ' | SlopeWorks';

  /** i18n key used when a route declares no `data.seo`. */
  private static readonly DEFAULT_KEY = 'home';

  /**
   * Public origin used for canonical / `og:url` during prerender. On the server
   * `document.location.origin` is the internal build host (`ng-localhost`), which
   * would otherwise be baked into the static HTML; the build's environment
   * supplies the real domain instead (`slopeworks.nl` / `slopeworks.eu`). In the
   * browser the live per-domain origin is used, so each page stays
   * self-referential.
   */
  private static readonly PRERENDER_ORIGIN = environment.prerenderOrigin;

  /** Element id of the sitewide `BreadcrumbList` JSON-LD block. */
  private static readonly BREADCRUMB_ID = 'breadcrumb-schema';

  /** Maps an app locale to the `language_TERRITORY` form Open Graph expects. */
  private static readonly OG_LOCALES: Record<string, string> = {nl: 'nl_NL', en: 'en_US'};

  /**
   * The sibling domains that form the `hreflang` cluster, in the order they are
   * written. The routes are identical across all three domains, so each page's
   * alternates are these origins plus the shared canonical path — the same
   * cluster is listed on every build regardless of which domain it is served on.
   */
  private static readonly HREFLANG_ALTERNATES: {hreflang: string; origin: string}[] = [
    {hreflang: 'nl-NL', origin: 'https://slopeworks.nl'},
    {hreflang: 'nl-BE', origin: 'https://slopeworks.be'},
    {hreflang: 'en', origin: 'https://slopeworks.eu'},
    {hreflang: 'x-default', origin: 'https://slopeworks.eu'},
  ];

  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly lang = inject(MnLanguageService);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Subscribes to router navigation and updates the page metadata after each
   * completed navigation. Call once, from the root component.
   */
  init(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.apply(this.resolveKey()));
  }

  /**
   * Walks to the deepest activated route and returns its `data.seo` key,
   * falling back to the default key when a route declares none.
   */
  private resolveKey(): string {
    let snapshot: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    let key: string | undefined;
    while (snapshot) {
      key = (snapshot.data['seo'] as string | undefined) ?? key;
      snapshot = snapshot.firstChild;
    }
    return key ?? SeoService.DEFAULT_KEY;
  }

  /**
   * Overrides the current page's metadata from arbitrary i18n keys. Data-driven
   * pages (e.g. the destination detail page) call this so each instance gets its
   * own title and description instead of the generic route-level one.
   *
   * @param titleKey i18n key for the page title.
   * @param descriptionKey i18n key for the meta description.
   */
  setFromKeys(titleKey: string, descriptionKey: string): void {
    this.write(this.lang.translate(titleKey), this.lang.translate(descriptionKey));
  }

  /**
   * Writes the title, meta description, canonical link, Open Graph tags and
   * document language for the given SEO key.
   *
   * @param key i18n key group (`seo.<key>.title` / `seo.<key>.description`).
   */
  private apply(key: string): void {
    this.write(this.lang.translate(`seo.${key}.title`), this.lang.translate(`seo.${key}.description`));
  }

  /**
   * Writes all metadata tags for a resolved title/description pair.
   *
   * @param rawTitle Page title before the site-name suffix.
   * @param description Meta and social-card description.
   */
  private write(rawTitle: string, description: string): void {
    const title = rawTitle + SeoService.TITLE_SUFFIX;
    const path = this.canonicalPath(this.router.url);
    const url = this.origin() + path;

    this.document.documentElement.lang = this.lang.locale;
    this.title.setTitle(title);
    this.meta.updateTag({name: 'description', content: description});

    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({property: 'og:url', content: url});
    this.meta.updateTag({property: 'og:locale', content: SeoService.OG_LOCALES[this.lang.locale] ?? this.lang.locale});
    this.meta.updateTag({name: 'twitter:title', content: title});
    this.meta.updateTag({name: 'twitter:description', content: description});

    this.setCanonical(url);
    this.setHreflang(path);
    this.applyBreadcrumb(rawTitle);
  }

  /**
   * Normalises a router URL to the path form the static host actually serves.
   * The query/fragment is dropped and every non-root path gets a single trailing
   * slash, matching the `route/index.html` files the static build emits — a
   * request for `/faq` is served as `/faq/`. Keeping canonical, `og:url`,
   * `hreflang` and the sitemap on this one form removes the canonical-vs-effective
   * URL mismatch flagged in the SEO audit.
   *
   * @param routerUrl The active router URL (may carry a query or fragment).
   * @returns The canonical path, e.g. `/` or `/faq/`.
   */
  private canonicalPath(routerUrl: string): string {
    const path = routerUrl.split(/[?#]/)[0];
    if (path === '' || path === '/') {
      return '/';
    }
    return path.endsWith('/') ? path : path + '/';
  }

  /**
   * Rewrites the `hreflang` alternate links for the current path. Because the
   * routes are identical across the three domains, each alternate is a sibling
   * origin plus the shared canonical path. Replacing the whole set on every
   * navigation keeps each page pointing at its own translation instead of the
   * homepage, and — being written into the head like the canonical — the correct
   * cluster is baked into the prerendered HTML.
   *
   * @param path Canonical path (with trailing slash) shared across all domains.
   */
  private setHreflang(path: string): void {
    this.document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((link) => link.remove());
    for (const {hreflang, origin} of SeoService.HREFLANG_ALTERNATES) {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', origin + path);
      this.document.head.appendChild(link);
    }
  }

  /**
   * Publishes a `BreadcrumbList` for the current route: `Home › {page}` for a
   * top-level page, and nothing for the home page itself. Deeper pages (e.g. a
   * destination detail) replace this with a richer trail via {@link setBreadcrumb}.
   *
   * @param leaf Name of the current page (its title without the site suffix).
   */
  private applyBreadcrumb(leaf: string): void {
    const path = this.router.url.split(/[?#]/)[0];
    if (path === '/' || path === '') {
      this.removeStructuredData(SeoService.BREADCRUMB_ID);
      return;
    }
    this.setBreadcrumb([
      {name: this.lang.translate('breadcrumb.home'), path: '/'},
      {name: leaf, path},
    ]);
  }

  /**
   * Writes a `BreadcrumbList` JSON-LD block from an ordered trail of crumbs, each
   * an absolute URL built from the current origin. Replaces any existing trail.
   *
   * @param items The breadcrumb trail, root first, current page last.
   */
  setBreadcrumb(items: {name: string; path: string}[]): void {
    this.setStructuredData(SeoService.BREADCRUMB_ID, {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: this.origin() + this.canonicalPath(item.path),
      })),
    });
  }

  /**
   * Creates or updates the single `<link rel="canonical">` element.
   *
   * @param url Absolute, self-referencing canonical URL for the active route.
   */
  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * The origin to build absolute URLs from. During prerender the runtime origin
   * is the internal build host, so the public primary domain is used instead; in
   * the browser the live origin keeps canonical / `og:url` self-referential.
   */
  private origin(): string {
    return isPlatformServer(this.platformId)
      ? SeoService.PRERENDER_ORIGIN
      : this.document.location.origin;
  }

  /**
   * Adds or replaces a JSON-LD structured-data block in the document head, keyed
   * by `id` so a page can register its own schema (e.g. `FAQPage`). Injected into
   * the head so it is baked into the prerendered HTML for search and AI crawlers.
   *
   * @param id Stable id for the script element, used to update or remove it.
   * @param data The JSON-LD graph to serialise.
   */
  setStructuredData(id: string, data: unknown): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    // Escape `<` so a translated string containing `</script>` can't break out.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  /**
   * Removes a structured-data block previously added with {@link setStructuredData},
   * so a page's schema does not linger after the visitor navigates away.
   *
   * @param id The id passed to {@link setStructuredData}.
   */
  removeStructuredData(id: string): void {
    this.document.getElementById(id)?.remove();
  }
}
