import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

/**
 * A single crumb in the breadcrumb trail.
 */
export interface Crumb {
  /** Visible label (already resolved to the active language). */
  label: string;
  /** Router path to link to; omit for the current (last) crumb. */
  route?: string;
}

/**
 * A slim breadcrumb trail rendered over the photographic page hero.
 *
 * Light-on-dark by design: it lives on top of the hero image's gradient, so the
 * linked crumbs are muted white and the current crumb is picked out in brand
 * yellow. Purely presentational — the trail is supplied by each page.
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
})
export class BreadcrumbComponent {
  /** Ordered crumbs from root to current page; the last is rendered as current. */
  @Input({required: true}) items: Crumb[] = [];
}
