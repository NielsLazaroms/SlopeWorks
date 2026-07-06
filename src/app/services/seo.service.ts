import {DOCUMENT, inject, Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {MnLanguageService} from 'mn-angular-lib';
import {filter} from 'rxjs';

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

  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly lang = inject(MnLanguageService);

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
    const url = this.document.location.origin + this.router.url.split(/[?#]/)[0];

    this.document.documentElement.lang = this.lang.locale;
    this.title.setTitle(title);
    this.meta.updateTag({name: 'description', content: description});

    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({property: 'og:url', content: url});
    this.meta.updateTag({name: 'twitter:title', content: title});
    this.meta.updateTag({name: 'twitter:description', content: description});

    this.setCanonical(url);
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
}
