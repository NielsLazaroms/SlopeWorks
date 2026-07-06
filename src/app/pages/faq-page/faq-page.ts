import {afterNextRender, Component, inject, OnDestroy, signal} from '@angular/core';
import {MnLanguageService, MnTranslatePipe} from 'mn-angular-lib';
import {PageHeroComponent} from '../../components/page-hero/page-hero';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';
import {FaqAccordionComponent, FaqEntry} from '../../components/faq-accordion/faq-accordion';
import {SeoService} from '../../services/seo.service';

/**
 * A themed group of FAQ entries with its own anchor in the side navigation.
 */
interface FaqGroup {
  /** DOM id used as the scroll anchor. */
  id: string;
  /** i18n key for the group title. */
  titleKey: string;
  /** i18n key for the one-line group description. */
  subKey: string;
  /** The questions in this group. */
  items: FaqEntry[];
}

/**
 * The FAQ page (`/faq`).
 *
 * A grouped accordion with a sticky side navigation. Built by hand because MnLib
 * has no accordion component; questions expand independently, so open state is
 * tracked as a set of question keys.
 */
@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [MnTranslatePipe, PageHeroComponent, PageCtaComponent, RevealDirective, FaqAccordionComponent],
  templateUrl: './faq-page.html',
})
export class FaqPage implements OnDestroy {
  /** Id of the injected `FAQPage` JSON-LD block. */
  private static readonly SCHEMA_ID = 'faq-schema';

  /** Id of the group currently in view, highlighted in the index rail. */
  protected readonly activeGroup = signal<string>('werkwijze');

  /** Group ids whose section is currently intersecting the viewport band. */
  private readonly visibleGroups = new Set<string>();

  private readonly seo = inject(SeoService);
  private readonly lang = inject(MnLanguageService);

  /**
   * Publishes the `FAQPage` structured data (baked into the prerendered HTML) and
   * wires up the scroll-spy that keeps the index rail in sync with the group the
   * reader is currently looking at (browser only).
   */
  constructor() {
    this.seo.setStructuredData(FaqPage.SCHEMA_ID, this.buildFaqSchema());
    afterNextRender(() => this.observeGroups());
  }

  /** Removes the FAQ schema so it does not linger after navigating away. */
  ngOnDestroy(): void {
    this.seo.removeStructuredData(FaqPage.SCHEMA_ID);
  }

  /**
   * Builds the `FAQPage` JSON-LD graph from every group's questions, resolving
   * each question and answer to text in the active language.
   */
  private buildFaqSchema(): unknown {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.groups
        .flatMap((group) => group.items)
        .map((item) => ({
          '@type': 'Question',
          name: this.lang.translate(item.qKey),
          acceptedAnswer: {
            '@type': 'Answer',
            text: this.lang.translate(item.aKey),
          },
        })),
    };
  }

  /** The FAQ groups in display order. */
  protected readonly groups: FaqGroup[] = [
    {
      id: 'werkwijze',
      titleKey: 'faq.werk.title',
      subKey: 'faq.werk.sub',
      items: [
        {qKey: 'faq.werk.q1', aKey: 'faq.werk.a1'},
        {qKey: 'faq.werk.q2', aKey: 'faq.werk.a2'},
        {qKey: 'faq.werk.q3', aKey: 'faq.werk.a3'},
      ],
    },
    {
      id: 'prijzen',
      titleKey: 'faq.prijs.title',
      subKey: 'faq.prijs.sub',
      items: [
        {qKey: 'faq.prijs.q1', aKey: 'faq.prijs.a1'},
        {qKey: 'faq.prijs.q2', aKey: 'faq.prijs.a2'},
        {qKey: 'faq.prijs.q3', aKey: 'faq.prijs.a3'},
      ],
    },
    {
      id: 'groepen',
      titleKey: 'faq.groep.title',
      subKey: 'faq.groep.sub',
      items: [
        {qKey: 'faq.groep.q1', aKey: 'faq.groep.a1'},
        {qKey: 'faq.groep.q2', aKey: 'faq.groep.a2'},
        {qKey: 'faq.groep.q3', aKey: 'faq.groep.a3'},
      ],
    },
    {
      id: 'bestemmingen-faq',
      titleKey: 'faq.best.title',
      subKey: 'faq.best.sub',
      items: [
        {qKey: 'faq.best.q1', aKey: 'faq.best.a1'},
        {qKey: 'faq.best.q2', aKey: 'faq.best.a2'},
        {qKey: 'faq.best.q3', aKey: 'faq.best.a3'},
      ],
    },
    {
      id: 'praktisch',
      titleKey: 'faq.prakt.title',
      subKey: 'faq.prakt.sub',
      items: [
        {qKey: 'faq.prakt.q1', aKey: 'faq.prakt.a1'},
        {qKey: 'faq.prakt.q2', aKey: 'faq.prakt.a2'},
        {qKey: 'faq.prakt.q3', aKey: 'faq.prakt.a3'},
      ],
    },
  ];

  /**
   * Smoothly scrolls a FAQ group into view, clearing the fixed navbar.
   *
   * @param id DOM id of the group to reveal.
   */
  scrollToGroup(id: string): void {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  /**
   * Observes each group section and marks the topmost visible one as active,
   * so the index rail reflects where the reader is in the document.
   */
  private observeGroups(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.visibleGroups.add(entry.target.id);
          } else {
            this.visibleGroups.delete(entry.target.id);
          }
        }
        // Highlight the first group (in document order) still in the band.
        const active = this.groups.find((group) => this.visibleGroups.has(group.id));
        if (active) {
          this.activeGroup.set(active.id);
        }
      },
      // A horizontal band ~28% down the viewport decides the "current" group.
      {rootMargin: '-28% 0px -60% 0px'},
    );

    for (const group of this.groups) {
      const el = document.getElementById(group.id);
      if (el) {
        observer.observe(el);
      }
    }
  }
}
