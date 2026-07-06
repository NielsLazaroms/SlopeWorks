import {Component, computed, effect, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {MnTranslatePipe} from 'mn-angular-lib';
import {BreadcrumbComponent} from '../../components/breadcrumb/breadcrumb';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';
import {FaqAccordionComponent, FaqEntry} from '../../components/faq-accordion/faq-accordion';

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
  /** Slugs of the three related areas shown at the foot of the page. */
  relatedSlugs: string[];
}

/** Shared metadata for every scouted area, keyed by URL slug. */
const AREA_META: Record<string, AreaMeta> = {
  'solden': {name: 'Sölden', countryKey: 'destinations.solden.country', image: '/images/carousel_1.webp', route: '/bestemmingen/solden'},
  'mayrhofen': {name: 'Mayrhofen', countryKey: 'destinations.mayrhofen.country', image: '/images/carousel_8.webp', route: '/bestemmingen/mayrhofen'},
  'st-anton': {name: 'St. Anton am Arlberg', countryKey: 'destinations.stanton.country', image: '/images/carousel_7.webp', route: '/bestemmingen/st-anton'},
  'kitzbuhel': {name: 'Kitzbühel-Kirchberg', countryKey: 'destinations.kitzbuhel.country', image: '/images/carousel_9.webp', route: '/bestemmingen/kitzbuhel'},
  'zell-am-see': {name: 'Zell am See-Kaprun', countryKey: 'destinations.zellamsee.country', image: '/images/carousel_10.webp', route: '/bestemmingen/zell-am-see'},
  'gstaad': {name: 'Gstaad', countryKey: 'destinations.gstaad.country', image: '/images/carousel_5.webp', route: '/bestemmingen/gstaad'},
};

/** Per-area template configuration, keyed by URL slug. */
const CONFIG: Record<string, DestinationConfig> = {
  'solden': {prefix: 'solden', signatureImage: '/images/carousel_6.webp', fitYes: 4, fitNo: 3, faq: 4, relatedSlugs: ['mayrhofen', 'st-anton', 'gstaad']},
  'mayrhofen': {prefix: 'mayrhofen', signatureImage: '/images/carousel_3.webp', fitYes: 4, fitNo: 2, faq: 4, relatedSlugs: ['solden', 'st-anton', 'gstaad']},
  'st-anton': {prefix: 'stanton', signatureImage: '/images/carousel_4.webp', fitYes: 3, fitNo: 3, faq: 4, relatedSlugs: ['solden', 'kitzbuhel', 'gstaad']},
  'kitzbuhel': {prefix: 'kitzbuhel', signatureImage: '/images/carousel_2.webp', fitYes: 3, fitNo: 2, faq: 3, relatedSlugs: ['mayrhofen', 'st-anton', 'zell-am-see']},
  'zell-am-see': {prefix: 'zellamsee', signatureImage: '/images/carousel_6.webp', fitYes: 4, fitNo: 3, faq: 3, relatedSlugs: ['kitzbuhel', 'mayrhofen', 'gstaad']},
  'gstaad': {prefix: 'gstaad', signatureImage: '/images/carousel_2.webp', fitYes: 4, fitNo: 3, faq: 4, relatedSlugs: ['solden', 'st-anton', 'zell-am-see']},
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
  imports: [RouterLink, MnTranslatePipe, BreadcrumbComponent, PageCtaComponent, RevealDirective, FaqAccordionComponent],
  templateUrl: './destination-detail.html',
})
export class DestinationDetailPage {
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
      heroImage: meta.image,
      signatureImage: cfg.signatureImage,
      statIds: ['pistes', 'altitude', 'transfer', 'season', 'group'],
      infoIds: ['pass', 'crowd', 'level', 'vibe'],
      fitYesKeys: range(cfg.fitYes).map((i) => `${p}.fit.yes${i}`),
      fitNoKeys: range(cfg.fitNo).map((i) => `${p}.fit.no${i}`),
      faqs: range(cfg.faq).map((i) => ({qKey: `${p}.faq.q${i}`, aKey: `${p}.faq.a${i}`})),
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
}
