import {Component, computed, effect, inject, OnDestroy, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {MnBadge, MnLanguageService, MnTranslatePipe} from 'mn-angular-lib';
import {BreadcrumbComponent} from '../../components/breadcrumb/breadcrumb';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';
import {FaqAccordionComponent, FaqEntry} from '../../components/faq-accordion/faq-accordion';
import {EyebrowComponent} from '../../components/eyebrow/eyebrow';
import {SeoService, SocialImage} from '../../services/seo.service';

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
  /** Hero / card photo URL, also used as the page's `og:image`. */
  image: string;
  /** Intrinsic width of {@link image} in pixels, for `og:image:width`. */
  imageWidth: number;
  /** Intrinsic height of {@link image} in pixels, for `og:image:height`. */
  imageHeight: number;
  /** Router path to this area's detail page. */
  route: string;
}

/**
 * Per-area configuration that drives the generic detail template: which i18n
 * prefix holds its copy, the photo used in the feature band, how many prose
 * sections / for-whom bullets / FAQ entries it has, and which three areas to
 * surface as "other destinations".
 */
interface DestinationConfig {
  /** i18n key prefix for this area's copy (e.g. `stanton`). */
  prefix: string;
  /** Photo shown in the feature band (first prose section). */
  featureImage: string;
  /**
   * Number of ordered prose sections (`<prefix>.sec.<i>.title` / `.body`). Each
   * area carries its own H2 sequence, so this varies per destination — that is
   * deliberate (distinct, non-duplicate pages), not a template quirk.
   */
  sections: number;
  /** Number of "a good fit if" bullets. */
  fitYes: number;
  /** Number of "less suitable if" bullets. */
  fitNo: number;
  /** Number of FAQ entries. */
  faq: number;
  /** Slugs of the three related areas shown at the foot of the page. */
  relatedSlugs: string[];
}

/**
 * The photographic hero shown at the top of every destination detail page. It is
 * deliberately the same across all areas — the per-area photos live in the
 * feature band and the related-area cards instead, so the pages share one
 * consistent, wide-format opening image.
 */
const DETAIL_HERO_IMAGE = '/images/hero_image.webp';

/** Shared metadata for every scouted area, keyed by URL slug. */
const AREA_META: Record<string, AreaMeta> = {
  'solden': {name: 'Sölden', countryKey: 'destinations.solden.country', image: '/images/destinations/solden.webp', imageWidth: 1200, imageHeight: 900, route: '/bestemmingen/solden'},
  'mayrhofen': {name: 'Mayrhofen', countryKey: 'destinations.mayrhofen.country', image: '/images/destinations/mayrhofen.webp', imageWidth: 1200, imageHeight: 1600, route: '/bestemmingen/mayrhofen'},
  'st-anton': {name: 'St. Anton am Arlberg', countryKey: 'destinations.stanton.country', image: '/images/destinations/st-anton.webp', imageWidth: 1200, imageHeight: 900, route: '/bestemmingen/st-anton'},
  'kitzbuhel': {name: 'Kitzbühel-Kirchberg', countryKey: 'destinations.kitzbuhel.country', image: '/images/destinations/kitzbuhel.webp', imageWidth: 1200, imageHeight: 1600, route: '/bestemmingen/kitzbuhel'},
  'zell-am-see': {name: 'Zell am See-Kaprun', countryKey: 'destinations.zellamsee.country', image: '/images/destinations/zell-am-see.webp', imageWidth: 1200, imageHeight: 1600, route: '/bestemmingen/zell-am-see'},
  'gstaad': {name: 'Gstaad', countryKey: 'destinations.gstaad.country', image: '/images/destinations/gstaad.webp', imageWidth: 1024, imageHeight: 768, route: '/bestemmingen/gstaad'},
};

/**
 * Per-area template configuration, keyed by URL slug. The `sections` / `fitYes` /
 * `fitNo` / `faq` counts mirror how many keys each area's copy actually has in the
 * i18n files — they differ on purpose (each area gets the H2s its story needs).
 */
const CONFIG: Record<string, DestinationConfig> = {
  'solden': {prefix: 'solden', featureImage: '/images/destinations/solden-hero.webp', sections: 10, fitYes: 3, fitNo: 3, faq: 4, relatedSlugs: ['mayrhofen', 'st-anton', 'gstaad']},
  'mayrhofen': {prefix: 'mayrhofen', featureImage: '/images/destinations/mayrhofen-hero.webp', sections: 8, fitYes: 4, fitNo: 3, faq: 5, relatedSlugs: ['solden', 'st-anton', 'gstaad']},
  'st-anton': {prefix: 'stanton', featureImage: '/images/destinations/st-anton-hero.webp', sections: 11, fitYes: 3, fitNo: 3, faq: 4, relatedSlugs: ['solden', 'kitzbuhel', 'gstaad']},
  'kitzbuhel': {prefix: 'kitzbuhel', featureImage: '/images/destinations/kitzbuhel-hero.webp', sections: 10, fitYes: 3, fitNo: 2, faq: 4, relatedSlugs: ['mayrhofen', 'st-anton', 'zell-am-see']},
  'zell-am-see': {prefix: 'zellamsee', featureImage: '/images/destinations/zell-am-see-hero.webp', sections: 11, fitYes: 3, fitNo: 2, faq: 4, relatedSlugs: ['kitzbuhel', 'mayrhofen', 'gstaad']},
  'gstaad': {prefix: 'gstaad', featureImage: '/images/destinations/gstaad-hero.webp', sections: 10, fitYes: 3, fitNo: 3, faq: 4, relatedSlugs: ['solden', 'st-anton', 'zell-am-see']},
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

/** One prose section: its heading and body i18n keys. */
interface Section {
  /** i18n key for the section heading. */
  titleKey: string;
  /** i18n key for the section body. */
  bodyKey: string;
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
  /** Photograph for the "moment that stays with you" signature band. */
  signatureImage: string;
  /** This area's photo (path, alt and size) used as the `og:image` share card. */
  ogImage: SocialImage;
  /** Fixed stat-card sub-keys, in order. */
  statIds: string[];
  /** Fixed facts-strip sub-keys, in order. */
  infoIds: string[];
  /** i18n keys for the "a good fit if" bullets. */
  fitYesKeys: string[];
  /** i18n keys for the "less suitable if" bullets. */
  fitNoKeys: string[];
  /**
   * The area's topic sections whose heading is NOT a question — rendered as
   * prose bands (real sections), not folded into the FAQ.
   */
  proseSections: Section[];
  /**
   * The FAQ list rendered in the accordion: only genuine questions — the topic
   * sections whose heading ends in "?" followed by the short practical questions.
   */
  faqs: FaqEntry[];
  /**
   * Only the genuine questions (`faq.*`), used for the `FAQPage` structured data
   * so the schema stays true Q&A rather than including topic sections.
   */
  schemaFaqs: FaqEntry[];
  /** The three related areas. */
  related: RelatedRef[];
}

/**
 * The destination detail page (`/bestemmingen/:slug`).
 *
 * One data-driven template for every scouted area. Fixed chrome — a photographic
 * hero with an at-a-glance stat card, an intro, a facts strip, a for-whom /
 * not-for-whom split, related areas and a page FAQ — wraps a variable-length list
 * of ordered prose sections, so each area carries its own H2 sequence while a
 * single component serves all six destinations.
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
   * Building the section/fit/FAQ key lists here keeps the template declarative.
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
    // Split the area's topic sections by their heading: a question (ends in "?")
    // belongs in the FAQ; a statement is a real prose section. The split is
    // language-invariant (a question translates to a question), so resolving the
    // title once is enough.
    const sections: Section[] = range(cfg.sections).map((i) => ({
      titleKey: `${p}.sec.${i}.title`,
      bodyKey: `${p}.sec.${i}.body`,
    }));
    const isQuestion = (titleKey: string): boolean => this.lang.translate(titleKey).trim().endsWith('?');
    const sectionQuestions: FaqEntry[] = sections
      .filter((s) => isQuestion(s.titleKey))
      .map((s) => ({qKey: s.titleKey, aKey: s.bodyKey}));
    const proseSections = sections.filter((s) => !isQuestion(s.titleKey));
    const questionFaqs: FaqEntry[] = range(cfg.faq).map((i) => ({qKey: `${p}.faq.q${i}`, aKey: `${p}.faq.a${i}`}));
    return {
      prefix: p,
      breadcrumbName: meta.name,
      countryKey: meta.countryKey,
      heroImage: DETAIL_HERO_IMAGE,
      signatureImage: cfg.featureImage,
      ogImage: {
        path: meta.image,
        alt: this.lang.translate(`${p}.title`),
        width: meta.imageWidth,
        height: meta.imageHeight,
      },
      statIds: ['pistes', 'altitude', 'transfer', 'season', 'group'],
      infoIds: ['pass', 'crowd', 'level', 'vibe'],
      fitYesKeys: range(cfg.fitYes).map((i) => `${p}.fit.yes${i}`),
      fitNoKeys: range(cfg.fitNo).map((i) => `${p}.fit.no${i}`),
      proseSections,
      faqs: [...sectionQuestions, ...questionFaqs],
      schemaFaqs: questionFaqs,
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

  /** The open area-note tab (index into `view.proseSections`). */
  protected readonly activeNote = signal(0);

  /** Resets the open note tab to the first whenever the area changes. */
  private readonly noteReset = effect(() => {
    this.slug();
    this.activeNote.set(0);
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
    this.seo.setFromKeys(`${view.prefix}.title`, `seo.dest.${view.prefix}.description`, view.ogImage);
    this.seo.setBreadcrumb([
      {name: this.lang.translate('breadcrumb.home'), path: '/'},
      {name: this.lang.translate('breadcrumb.destinations'), path: '/bestemmingen'},
      {name: view.breadcrumbName, path: `/bestemmingen/${this.slug()}`},
    ]);
    this.seo.setStructuredData(DestinationDetailPage.FAQ_SCHEMA_ID, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: view.schemaFaqs.map((faq) => ({
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
