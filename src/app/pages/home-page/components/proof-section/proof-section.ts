import {Component, inject, InjectionToken} from '@angular/core';
import {provideMnComponentConfig} from 'mn-angular-lib';
import {EyebrowComponent} from '../../../../components/eyebrow/eyebrow';

/**
 * A single "proof" card: a concrete, scouted example experience.
 */
export interface ProofCard {
  /** Location tag, e.g. "Hintertux · Austria". */
  tag: string;
  /** Card heading. */
  title: string;
  /** Card body copy. */
  body: string;
  /** Attribution stamp, e.g. "Scouted by Bas & Carmen". */
  stamp: string;
  /** Photo URL for the card image. */
  imageUrl?: string;
  /** Accessible alt text for the photo. */
  imageAlt?: string;
}

/**
 * Configuration for the proof section, supplied via `mn-config.json5`.
 */
export interface ProofSectionConfig {
  /** Small uppercase eyebrow label. */
  label?: string;
  /** Section headline. */
  title?: string;
  /** The proof cards to render. */
  cards?: ProofCard[];
}

/** Injection token for {@link ProofSectionConfig}. */
export const APP_PROOF_SECTION_CONFIG = new InjectionToken<ProofSectionConfig>('APP_PROOF_SECTION_CONFIG');

/**
 * A dark section showcasing concrete, self-scouted experiences that prove the
 * "we've been there" promise.
 */
@Component({
  selector: 'app-proof-section',
  standalone: true,
  imports: [EyebrowComponent],
  providers: [
    provideMnComponentConfig<ProofSectionConfig>(APP_PROOF_SECTION_CONFIG, 'app-proof-section'),
  ],
  templateUrl: './proof-section.html',
})
export class ProofSectionComponent {
  /** Section content resolved from `mn-config.json5`. */
  protected readonly componentConfig = inject(APP_PROOF_SECTION_CONFIG);
}
