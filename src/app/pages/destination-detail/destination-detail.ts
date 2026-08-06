import {Component, computed, effect, inject, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {MnBadge, MnLanguageService, MnTranslatePipe} from 'mn-angular-lib';
import {BreadcrumbComponent} from '../../components/breadcrumb/breadcrumb';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';
import {FaqAccordionComponent, FaqEntry} from '../../components/faq-accordion/faq-accordion';
import {EyebrowComponent} from '../../components/eyebrow/eyebrow';
import {SeoService} from '../../services/seo.service';

/**
 * Shared, language-independent facts about one scouted area: its display name, the
 * i18n key for its country/region line, its hero photo and its route. Kept in one
 * table so both a destination's own hero and the "other areas" cards on sibling
 * pages resolve from the same source.
 */
interface AreaMeta {
  /** Resort name, shown in the breadcrumb and on related-area cards. */
  name: string;
  /** i18n key for the country / region line. */
  countryKey: string;
  /** Hero / card photo URL. */
  image: string;
  /** Router path to this area's detail page. */
  route: string;
}

/**
 * Per-area configuration that drives the generic detail template: which i18n
 * prefix holds its copy, its signature photo, how many for-whom bullets and FAQ
 * entries it has, and which three areas to surface as "other destinations".
 */
interface DestinationConfig {
  /** i18n key prefix for this area's copy (e.g. `stanton`). */
  prefix: string;
  /** Photo shown in the signature band. */
  signatureImage: string;
  /** Number of "a good fit if" bullets. */
  fitYes: number;
  /** Number of "less suitable if" bullets. */
  fitNo: number;
  /** Number of FAQ entries. */
  faq: number;
  /** Whether this area has authored "a day with your team" copy (`<prefix>.day.*`). */
  day?: boolean;
  /** Whether this area has authored travel/logistics copy (`<prefix>.logistics.*`). */
  logistics?: boolean;
  /** Slugs of the three related areas shown at the foot of the page. */
  relatedSlugs: string[];
}

/**
 * The photographic hero shown at the top of every destination detail page. It is
 * deliberately the same across all areas — the per-area photos live in the
 * signature band and the related-area cards instead, so the pages share one
 * consistent, wide-format opening image.
 */
const DETAIL_HERO_IMAGE = '/images/hero_image.webp';

/** Shared metadata for every scouted area, keyed by URL slug. */
const AREA_META: Record<string, AreaMeta> = {
  'solden': {name: 'Sölden', countryKey: 'destinations.solden.country', image: '/images/destinations/solden.webp', route: '/bestemmingen/solden'},
  'mayrhofen': {name: 'Mayrhofen', countryKey: 'destinations.mayrhofen.country', image: '/images/destinations/mayrhofen.webp', route: '/bestemmingen/mayrhofen'},
  'st-anton': {name: 'St. Anton am Arlberg', countryKey: 'destinations.stanton.country', image: '/images/destinations/st-anton.webp', route: '/bestemmingen/st-anton'},
  'kitzbuhel': {name: 'Kitzbühel-Kirchberg', countryKey: 'destinations.kitzbuhel.country', image: '/images/destinations/kitzbuhel.webp', route: '/bestemmingen/kitzbuhel'},
  'zell-am-see': {name: 'Zell am See-Kaprun', countryKey: 'destinations.zellamsee.country', image: '/images/destinations/zell-am-see.webp', route: '/bestemmingen/zell-am-see'},
  'gstaad': {name: 'Gstaad', countryKey: 'destinations.gstaad.country', image: '/images/destinations/gstaad.webp', route: '/bestemmingen/gstaad'},
};

/** Per-area template configuration, keyed by URL slug. */
const CONFIG: Record<string, DestinationConfig> = {
  'solden': {prefix: 'solden', signatureImage: '/images/destinations/solden-hero.webp', fitYes: 4, fitNo: 3, faq: 4, day: true, logistics: true, relatedSlugs: ['mayrhofen', 'st-anton', 'gstaad']},
  'mayrhofen': {prefix: 'mayrhofen', signatureImage: '/images/destinations/mayrhofen-hero.webp', fitYes: 4, fitNo: 2, faq: 4, day: true, logistics: true, relatedSlugs: ['solden', 'st-anton', 'gstaad']},
  'st-anton': {prefix: 'stanton', signatureImage: '/images/destinations/st-anton-hero.webp', fitYes: 3, fitNo: 3, faq: 4, day: true, logistics: true, relatedSlugs: ['solden', 'kitzbuhel', 'gstaad']},
  'kitzbuhel': {prefix: 'kitzbuhel', signatureImage: '/images/destinations/kitzbuhel-hero.webp', fitYes: 3, fitNo: 2, faq: 3, day: true, logistics: true, relatedSlugs: ['mayrhofen', 'st-anton', 'zell-am-see']},
  'zell-am-see': {prefix: 'zellamsee', signatureImage: '/images/destinations/zell-am-see-hero.webp', fitYes: 4, fitNo: 3, faq: 3, day: true, logistics: true, relatedSlugs: ['kitzbuhel', 'mayrhofen', 'gstaad']},
  'gstaad': {prefix: 'gstaad', signatureImage: '/images/destinations/gstaad-hero.webp', fitYes: 4, fitNo: 3, faq: 4, day: true, logistics: true, relatedSlugs: ['solden', 'st-anton', 'zell-am-see']},
};

/** A related area surfaced at the foot of a detail page. */
interface RelatedRef {
  /** Resort name. */
  name: string;
  /** i18n key for the country / region line. */
  countryKey: string;
  /** Card photo URL. */
  imageUrl: string;
  /** Router path to that area. */
  route: string;
}

/** The resolved, template-ready view of one destination. */
interface DestinationView {
  /** i18n prefix, concatenated with field suffixes to resolve copy. */
  prefix: string;
  /** Resort name for the breadcrumb. */
  breadcrumbName: string;
  /** i18n key for the country / region line in the hero. */
  countryKey: string;
  /** Hero photograph. */
  heroImage: string;
  /** Signature-band photograph. */
  signatureImage: string;
  /** Fixed stat-card / facts-strip sub-keys, in order. */
  statIds: string[];
  /** Fixed facts-strip sub-keys, in order. */
  infoIds: string[];
  /** i18n keys for the "a good fit if" bullets. */
  fitYesKeys: string[];
  /** i18n keys for the "less suitable if" bullets. */
  fitNoKeys: string[];
  /** FAQ entries for the shared accordion. */
  faqs: FaqEntry[];
  /** Whether to render the "a day with your team" section for this area. */
  hasDay: boolean;
  /** Whether to render the travel/logistics section for this area. */
  hasLogistics: boolean;
  /** The three related areas. */
  related: RelatedRef[];
}

/**
 * The destination detail page (`/bestemmingen/:slug`).
 *
 * One data-driven template for every scouted area. The design is the mockup's
 * area template — photographic hero with an at-a-glance stat card, an intro, a
 * facts strip, a signature-moment band, a for-whom / not-for-whom split, related
 * areas and a page-specific FAQ — with all copy resolved from the area's i18n
 * prefix so a single component serves all six destinations.
 */
@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [RouterLink, MnBadge, MnTranslatePipe, BreadcrumbComponent, PageCtaComponent, RevealDirective, FaqAccordionComponent, EyebrowComponent],
  templateUrl: './destination-detail.html',
})
export class DestinationDetailPage implements OnDestroy {
  /** Element id of this page's `FAQPage` JSON-LD block. */
  private static readonly FAQ_SCHEMA_ID = 'faq-schema';

  /** Router, used to redirect unknown slugs back to the overview. */
  private readonly router = inject(Router);

  /** Live route parameters, so navigating between areas re-resolves the view. */
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);

  /** The active area slug from the URL. */
  private readonly slug = computed(() => this.params()?.get('slug') ?? '');

  /**
   * The resolved view for the active slug, or `null` for an unknown area.
   * Building the fit/FAQ key lists here keeps the template declarative.
   */
  protected readonly view = computed<DestinationView | null>(() => {
    const slug = this.slug();
    const cfg = CONFIG[slug];
    const meta = AREA_META[slug];
    if (!cfg || !meta) {
      return null;
    }
    const p = cfg.prefix;
    const range = (n: number): number[] => Array.from({length: n}, (_, i) => i + 1);
    return {
      prefix: p,
      breadcrumbName: meta.name,
      countryKey: meta.countryKey,
      heroImage: DETAIL_HERO_IMAGE,
      signatureImage: cfg.signatureImage,
      statIds: ['pistes', 'altitude', 'transfer', 'season', 'group'],
      infoIds: ['pass', 'crowd', 'level', 'vibe'],
      fitYesKeys: range(cfg.fitYes).map((i) => `${p}.fit.yes${i}`),
      fitNoKeys: range(cfg.fitNo).map((i) => `${p}.fit.no${i}`),
      faqs: range(cfg.faq).map((i) => ({qKey: `${p}.faq.q${i}`, aKey: `${p}.faq.a${i}`})),
      hasDay: !!cfg.day,
      hasLogistics: !!cfg.logistics,
      related: cfg.relatedSlugs.map((s) => ({
        name: AREA_META[s].name,
        countryKey: AREA_META[s].countryKey,
        imageUrl: AREA_META[s].image,
        route: AREA_META[s].route,
      })),
    };
  });

  /** Sends unknown slugs back to the destinations overview. */
  private readonly guard = effect(() => {
    if (this.params() && this.view() === null) {
      void this.router.navigate(['/bestemmingen']);
    }
  });

  private readonly seo = inject(SeoService);
  private readonly lang = inject(MnLanguageService);

  /**
   * Gives each area its own title and description (from its i18n copy) instead
   * of the generic route-level metadata, plus a `FAQPage` for its questions and a
   * full breadcrumb trail — so the six detail pages are distinct, richly marked-up
   * entries for search engines and AI answers rather than near-duplicates.
   */
  private readonly seoEffect = effect(() => {
    const view = this.view();
    if (!view) {
      return;
    }
    this.seo.setFromKeys(`${view.prefix}.title`, `seo.dest.${view.prefix}.description`);
    this.seo.setBreadcrumb([
      {name: this.lang.translate('breadcrumb.home'), path: '/'},
      {name: this.lang.translate('breadcrumb.destinations'), path: '/bestemmingen'},
      {name: view.breadcrumbName, path: `/bestemmingen/${this.slug()}`},
    ]);
    this.seo.setStructuredData(DestinationDetailPage.FAQ_SCHEMA_ID, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: view.faqs.map((faq) => ({
        '@type': 'Question',
        name: this.lang.translate(faq.qKey),
        acceptedAnswer: {'@type': 'Answer', text: this.lang.translate(faq.aKey)},
      })),
    });
  });

  /** Removes the area's FAQ schema when the visitor navigates away. */
  ngOnDestroy(): void {
    this.seo.removeStructuredData(DestinationDetailPage.FAQ_SCHEMA_ID);
  }
}
