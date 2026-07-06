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
}
