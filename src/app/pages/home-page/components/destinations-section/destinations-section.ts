import {Component, inject, InjectionToken} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LucideArrowRight} from '@lucide/angular';
import {MnButton, MnButtonTypes, provideMnComponentConfig} from 'mn-angular-lib';
import {EyebrowComponent} from '../../../../components/eyebrow/eyebrow';

/**
 * A single destination card (a resort SlopeWorks has scouted).
 */
export interface DestinationCard {
  /** Country / region line, e.g. "Austria · Ötztal". */
  country: string;
  /** Resort name. */
  name: string;
  /** One-line description. */
  tagline: string;
  /** Call-to-action text, e.g. "View Sölden". */
  linkText: string;
  /** Photo URL. */
  imageUrl?: string;
  /** Accessible alt text for the photo. */
  imageAlt?: string;
  /** Router path the card links to (its detail page or the overview). */
  route?: string;
}

/**
 * Configuration for the destinations section, supplied via `mn-config.json5`.
 */
export interface DestinationsSectionConfig {
  /** Small uppercase eyebrow label. */
  label?: string;
  /** Section headline. */
  title?: string;
  /** The destination cards to render. */
  cards?: DestinationCard[];
  /** "See all" link text below the grid. */
  seeAllText?: string;
  /** Router path the "see all" link navigates to (the destinations overview). */
  seeAllRoute?: string;
}

/** Injection token for {@link DestinationsSectionConfig}. */
export const APP_DESTINATIONS_SECTION_CONFIG = new InjectionToken<DestinationsSectionConfig>('APP_DESTINATIONS_SECTION_CONFIG');

/**
 * A grid of scouted destinations on the home page. Each card links to its detail
 * page (or the destinations overview), and "see all" opens the overview.
 */
@Component({
  selector: 'app-destinations-section',
  standalone: true,
  imports: [RouterLink, LucideArrowRight, MnButton, EyebrowComponent],
  providers: [
    provideMnComponentConfig<DestinationsSectionConfig>(APP_DESTINATIONS_SECTION_CONFIG, 'app-destinations-section'),
  ],
  templateUrl: './destinations-section.html',
})
export class DestinationsSectionComponent {
  /** Section content resolved from `mn-config.json5`. */
  protected readonly componentConfig = inject(APP_DESTINATIONS_SECTION_CONFIG);

  /**
   * MnLib styling for the "see all" text button. Overridden to `dark-yellow` in
   * the template so it stays legible on the light section (the text variant's
   * brand-yellow fails contrast on white).
   */
  protected readonly seeAllData: Partial<MnButtonTypes> = {
    color: 'primary',
    size: 'md',
    variant: 'text',
    borderRadius: 'sm',
    hover: true,
  };
}
