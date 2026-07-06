import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MnButton, MnButtonTypes, MnTranslatePipe} from 'mn-angular-lib';
import {EyebrowComponent} from '../../../../components/eyebrow/eyebrow';

/**
 * The home page hero.
 *
 * A full-bleed scouting photograph with a deep gradient, the brand's thesis
 * headline (with a yellow accent on the phrase that matters), two calls to action
 * (start a conversation / browse destinations), and the signature "field note" —
 * a scouting quote card that embodies what SlopeWorks sells: first-hand knowledge
 * of the mountain. Replaces the previous generic parallax hero.
 */
@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterLink, MnButton, MnTranslatePipe, EyebrowComponent],
  templateUrl: './home-hero.html',
})
export class HomeHeroComponent {
  /** MnLib button styling for the primary CTA (brand fill, with hover enabled). */
  protected readonly primaryData: Partial<MnButtonTypes> = {
    color: 'primary',
    size: 'lg',
    variant: 'fill',
    borderRadius: 'sm',
    hover: true,
  };

  /** MnLib button styling for the secondary CTA (text variant, reads on the dark hero). */
  protected readonly secondaryData: Partial<MnButtonTypes> = {
    color: 'primary',
    size: 'lg',
    variant: 'text',
    borderRadius: 'sm',
    hover: true,
  };
}
