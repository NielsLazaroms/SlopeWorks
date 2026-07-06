import {Component, Input} from '@angular/core';
import {BreadcrumbComponent, Crumb} from '../breadcrumb/breadcrumb';
import {EyebrowComponent} from '../eyebrow/eyebrow';

/**
 * The shared hero band at the top of every interior page.
 *
 * This is the site's signature blend: it takes the mockup's dark editorial
 * page-header (breadcrumb → eyebrow → headline → lede) but renders it over a real
 * scouting photograph with a deep gradient, echoing the photographic parallax
 * hero on the home page instead of a flat ink block. Dark is used as accent over
 * the image, not as the page's default surface.
 */
@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [BreadcrumbComponent, EyebrowComponent],
  templateUrl: './page-hero.html',
})
export class PageHeroComponent {
  /** Background photograph URL (a scouting image). */
  @Input({required: true}) imageUrl = '';
  /** Small uppercase eyebrow above the headline; omit to hide. */
  @Input() eyebrow?: string;
  /** Main page headline (rendered as the page `h1`). */
  @Input({required: true}) title = '';
  /** Supporting lede beneath the headline; omit to hide. */
  @Input() subtitle?: string;
  /** Breadcrumb trail shown at the top of the hero. */
  @Input() crumbs: Crumb[] = [];
}
