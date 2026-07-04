import {Component, inject, InjectionToken} from '@angular/core';
import {provideMnComponentConfig} from 'mn-angular-lib';

/**
 * One column of the comparison grid (a heading plus bullet points).
 */
export interface CompareColumn {
  /** Column heading, e.g. "A travel agency" or "SlopeWorks". */
  head: string;
  /** Bullet points listed under the heading. */
  items: string[];
}

/**
 * Configuration for the "why SlopeWorks" section, supplied via `mn-config.json5`.
 */
export interface WhySectionConfig {
  /** Small uppercase eyebrow label. */
  label?: string;
  /** Section headline. */
  title?: string;
  /** Lead paragraph (emphasised). */
  intro?: string;
  /** Supporting second paragraph. */
  introSecondary?: string;
  /** The "them" (travel agency) comparison column. */
  them?: CompareColumn;
  /** The "us" (SlopeWorks) comparison column. */
  us?: CompareColumn;
}

/** Injection token for {@link WhySectionConfig}. */
export const APP_WHY_SECTION_CONFIG = new InjectionToken<WhySectionConfig>('APP_WHY_SECTION_CONFIG');

/**
 * The "why SlopeWorks" section: intro copy plus a two-column comparison grid
 * contrasting a traditional travel agency with SlopeWorks.
 */
@Component({
  selector: 'app-why-section',
  standalone: true,
  imports: [],
  providers: [
    provideMnComponentConfig<WhySectionConfig>(APP_WHY_SECTION_CONFIG, 'app-why-section'),
  ],
  templateUrl: './why-section.html',
})
export class WhySectionComponent {
  /** Section content resolved from `mn-config.json5`. */
  protected readonly componentConfig = inject(APP_WHY_SECTION_CONFIG);
}
