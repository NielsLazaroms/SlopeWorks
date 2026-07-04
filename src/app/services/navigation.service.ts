import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ScrollService} from './scroll.service';

/**
 * Bridges the multi-page router with the home page's in-page scroll sections.
 *
 * The site is a hybrid: destination/FAQ/comparison pages are real routes, while
 * "About" and "Contact" remain scroll targets on the home page. This service lets
 * the navbar, CTA strips and destination cards ask for a home section from
 * anywhere — scrolling directly when already on home, or navigating home first
 * and then scrolling once the view has rendered.
 */
@Injectable({providedIn: 'root'})
export class NavigationService {
  private readonly router = inject(Router);
  private readonly scroll = inject(ScrollService);

  /** Delay (ms) after navigating home before scrolling, so the target renders. */
  private readonly renderDelay = 120;

  /** Whether the home page is the active route. */
  private get onHome(): boolean {
    return this.router.url.split('?')[0].split('#')[0] === '/';
  }

  /**
   * Scrolls to a home-page section, navigating home first when on another route.
   *
   * @param sectionId DOM id of the target home section (e.g. `contact-section`).
   */
  goToSection(sectionId: string): void {
    if (this.onHome) {
      this.scroll.scrollToSection(sectionId);
      return;
    }
    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => this.scroll.scrollToSection(sectionId), this.renderDelay);
    });
  }
}
