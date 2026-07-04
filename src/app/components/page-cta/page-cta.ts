import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MnButton, MnButtonTypes, MnTranslatePipe} from 'mn-angular-lib';

/**
 * The quiet closing call-to-action band shared by every interior page.
 *
 * A clean, near-white band separated by a hairline rule (ink heading, muted body,
 * a single yellow button), so every interior page resolves on the same restrained
 * note rather than a dark strip or a loud colour block. Its button routes to the
 * contact page. Copy is passed as i18n keys and resolved here to keep page
 * templates lean.
 */
@Component({
  selector: 'app-page-cta',
  standalone: true,
  imports: [RouterLink, MnButton, MnTranslatePipe],
  templateUrl: './page-cta.html',
})
export class PageCtaComponent {
  /** i18n key for the CTA headline. */
  @Input({required: true}) titleKey = '';
  /** i18n key for the supporting line. */
  @Input({required: true}) subKey = '';
  /** i18n key for the button label. */
  @Input({required: true}) buttonKey = '';

  /** Route the button navigates to (the contact page by default). */
  @Input() route = '/contact';

  /** MnLib button styling for the CTA (brand fill, with hover enabled). */
  protected readonly buttonData: Partial<MnButtonTypes> = {
    color: 'primary',
    size: 'lg',
    variant: 'fill',
    borderRadius: 'sm',
    hover: true,
  };
}
