import {Component} from '@angular/core';
import {MnTranslatePipe} from 'mn-angular-lib';
import {PageHeroComponent} from '../../components/page-hero/page-hero';
import {RevealDirective} from '../../components/reveal/reveal';
import {environment} from '../../../environments/environment';

/**
 * The privacy statement page (`/privacy`).
 *
 * A single-column transcription of SlopeWorks' privacy statement (the source is
 * the Dutch legal original). The two enumerated sections — what data we collect
 * and why we process it — are rendered from key lists; the remaining prose
 * sections live in the template so the wording stays verbatim and the contact
 * addresses can be rendered as real `mailto:`/`tel:` links.
 */
@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [MnTranslatePipe, PageHeroComponent, RevealDirective],
  templateUrl: './privacy-page.html',
})
export class PrivacyPage {
  /**
   * The public domain of the current build (`slopeworks.nl` / `.be` / `.eu`),
   * derived from the per-domain `prerenderOrigin`. Rendered in the intro so the
   * "processed via …" reference names the site the visitor is actually on, rather
   * than always saying `slopeworks.nl`. (The `info@slopeworks.nl` address is a
   * mailbox, not a site URL, and stays the same on every domain.)
   */
  protected readonly siteDomain = 'www.' + environment.prerenderOrigin.replace(/^https?:\/\/(www\.)?/, '');

  /** i18n keys for the "what data we collect" bullet list, in reading order. */
  protected readonly collectKeys: string[] = [
    'privacy.collect.item1',
    'privacy.collect.item2',
    'privacy.collect.item3',
  ];

  /** i18n keys for the "why we process this data" bullet list, in reading order. */
  protected readonly purposeKeys: string[] = [
    'privacy.purpose.item1',
    'privacy.purpose.item2',
    'privacy.purpose.item3',
  ];
}
