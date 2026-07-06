import {Component, inject, InjectionToken} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MnButton, MnButtonTypes, provideMnComponentConfig} from 'mn-angular-lib';
import {EyebrowComponent} from '../../../../components/eyebrow/eyebrow';

/**
 * The creative partner featured alongside SlopeWorks in the teambuilding section.
 */
export interface TeambuildingPartner {
  /** Short monogram shown in the avatar tile, e.g. "KV". */
  initials: string;
  /** Partner name. */
  name: string;
  /** One-line description of what the partner does. */
  role: string;
  /** Pull quote in the partner's own words. */
  quote: string;
  /** The partner's website, shown muted at the foot of the card. */
  site: string;
}

/**
 * Configuration for the teambuilding ("creative partner") section, supplied via
 * `mn-config.json5`.
 */
export interface TeambuildingSectionConfig {
  /** Small uppercase eyebrow label. */
  label?: string;
  /** Section headline. */
  title?: string;
  /** Lead paragraph. */
  intro?: string;
  /** Supporting second paragraph. */
  introSecondary?: string;
  /** Call-to-action text. */
  buttonText?: string;
  /** Router path the call to action navigates to. */
  buttonRoute?: string;
  /** The creative partner shown in the quote card. */
  partner?: TeambuildingPartner;
}

/** Injection token for {@link TeambuildingSectionConfig}. */
export const APP_TEAMBUILDING_SECTION_CONFIG = new InjectionToken<TeambuildingSectionConfig>('APP_TEAMBUILDING_SECTION_CONFIG');

/**
 * The teambuilding section: a light "creative partner" band that reveals the
 * deeper layer of a SlopeWorks week — a collaboration with Kamp Vuur that turns
 * the trip into experience-based team development. A narrative column on the left
 * pairs with the partner's own quote card on the right.
 */
@Component({
  selector: 'app-teambuilding-section',
  standalone: true,
  imports: [RouterLink, MnButton, EyebrowComponent],
  providers: [
    provideMnComponentConfig<TeambuildingSectionConfig>(APP_TEAMBUILDING_SECTION_CONFIG, 'app-teambuilding-section'),
  ],
  templateUrl: './teambuilding-section.html',
})
export class TeambuildingSectionComponent {
  /** Section content resolved from `mn-config.json5`. */
  protected readonly componentConfig = inject(APP_TEAMBUILDING_SECTION_CONFIG);

  /** MnLib button styling for the CTA (brand fill). */
  protected readonly buttonData: Partial<MnButtonTypes> = {
    color: 'primary',
    size: 'lg',
    variant: 'fill',
    borderRadius: 'sm',
    hover: true,
  };
}
