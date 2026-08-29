import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LucideArrowRight} from '@lucide/angular';
import {MnButton, MnButtonTypes, MnSectionDirective, MnTranslatePipe} from 'mn-angular-lib';
import {HomeHeroComponent} from './components/home-hero/home-hero';
import {WhySectionComponent} from './components/why-section/why-section';
import {ProofSectionComponent} from './components/proof-section/proof-section';
import {TeambuildingSectionComponent} from './components/teambuilding-section/teambuilding-section';
import {DestinationsSectionComponent} from './components/destinations-section/destinations-section';
import {GallerySectionComponent} from './components/gallery-section/gallery-section';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';
import {EyebrowComponent} from '../../components/eyebrow/eyebrow';
import {FaqAccordionComponent, FaqEntry} from '../../components/faq-accordion/faq-accordion';

/** A titled/bodied block resolved from a pair of i18n keys. */
interface TitledBlock {
  /** i18n key for the block heading. */
  titleKey: string;
  /** i18n key for the block body. */
  bodyKey: string;
}

/**
 * The SlopeWorks home page.
 *
 * Now that the site is multi-page, home is a landing hub: a photographic hero
 * with the brand thesis, the differentiator narrative ("why", proof), a preview
 * of destinations, a pair of cards routing out to the FAQ and comparison pages, a
 * photo gallery, and a closing CTA to the contact page. Each band reveals on
 * scroll via the shared {@link RevealDirective}.
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    LucideArrowRight,
    MnButton,
    MnTranslatePipe,
    HomeHeroComponent,
    WhySectionComponent,
    ProofSectionComponent,
    TeambuildingSectionComponent,
    DestinationsSectionComponent,
    GallerySectionComponent,
    PageCtaComponent,
    MnSectionDirective,
    RevealDirective,
    EyebrowComponent,
    FaqAccordionComponent,
  ],
  templateUrl: './home-page.html',
})
export class HomePage {
  /**
   * MnLib styling for the "orient" card text buttons. Overridden to `dark-yellow`
   * in the template so they stay legible on the light cards.
   */
  protected readonly orientData: Partial<MnButtonTypes> = {
    color: 'primary',
    size: 'md',
    variant: 'text',
    borderRadius: 'sm',
    hover: true,
  };

  /** MnLib styling for the "how it works" text button in the process section. */
  protected readonly processButtonData: Partial<MnButtonTypes> = {
    color: 'primary',
    size: 'md',
    variant: 'text',
    borderRadius: 'sm',
    hover: true,
  };

  /**
   * The differentiator SlopeWorks leads the "what we handle" section with:
   * on-location support (s7), the part most agencies skip. Given a photo and
   * room to breathe above the six table-stakes services.
   */
  protected readonly featuredService: TitledBlock = {
    titleKey: 'home.services.s7.title',
    bodyKey: 'home.services.s7.body',
  };

  /** The six things every good trip needs, handled well (s1–s6). */
  protected readonly services: TitledBlock[] = Array.from({length: 6}, (_, i) => ({
    titleKey: `home.services.s${i + 1}.title`,
    bodyKey: `home.services.s${i + 1}.body`,
  }));

  /** The three trip goals (Reward / Better Together / Reset). */
  protected readonly outcomes: TitledBlock[] = [
    {titleKey: 'home.outcome.reward.title', bodyKey: 'home.outcome.reward.body'},
    {titleKey: 'home.outcome.together.title', bodyKey: 'home.outcome.together.body'},
    {titleKey: 'home.outcome.reset.title', bodyKey: 'home.outcome.reset.body'},
  ];

  /** The five steps of how a trip is put together. */
  protected readonly steps: TitledBlock[] = Array.from({length: 5}, (_, i) => ({
    titleKey: `home.process.step${i + 1}.title`,
    bodyKey: `home.process.step${i + 1}.body`,
  }));

  /** The home page's frequently-asked questions. */
  protected readonly homeFaqs: FaqEntry[] = Array.from({length: 8}, (_, i) => ({
    qKey: `home.faq.q${i + 1}`,
    aKey: `home.faq.a${i + 1}`,
  }));
}
