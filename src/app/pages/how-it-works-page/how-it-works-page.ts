import {Component} from '@angular/core';
import {MnTranslatePipe} from 'mn-angular-lib';
import {PageHeroComponent} from '../../components/page-hero/page-hero';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';
import {FaqAccordionComponent, FaqEntry} from '../../components/faq-accordion/faq-accordion';

/** A titled/bodied block resolved from a pair of i18n keys. */
interface TitledBlock {
  /** i18n key for the block heading. */
  titleKey: string;
  /** i18n key for the block body. */
  bodyKey: string;
}

/**
 * The "Hoe het werkt" page (`/hoe-het-werkt`).
 *
 * Explains how SlopeWorks turns a 30-minute intake into a fully organised company
 * ski trip: the five steps, then the practical questions (budget, changes, who
 * communicates, when to start) as an editorial prose run. Copy resolves from the
 * `howitworks.*` i18n keys; the shared page hero and closing CTA frame it.
 */
@Component({
  selector: 'app-how-it-works-page',
  standalone: true,
  imports: [MnTranslatePipe, PageHeroComponent, PageCtaComponent, RevealDirective, FaqAccordionComponent],
  templateUrl: './how-it-works-page.html',
})
export class HowItWorksPage {
  /** The five ordered steps of the process. */
  protected readonly steps: TitledBlock[] = Array.from({length: 5}, (_, i) => ({
    titleKey: `howitworks.step${i + 1}.title`,
    bodyKey: `howitworks.step${i + 1}.body`,
  }));

  /**
   * The practical questions after the steps. Their headings are literally
   * questions, so they collapse into the shared accordion instead of a long
   * scroll of prose bands.
   */
  protected readonly faqBlocks: FaqEntry[] = Array.from({length: 10}, (_, i) => ({
    qKey: `howitworks.block${i + 1}.title`,
    aKey: `howitworks.block${i + 1}.body`,
  }));
}
