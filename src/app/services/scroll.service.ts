import {Injectable} from '@angular/core';
import gsap from 'gsap';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/**
 * Provides smooth, animated scrolling to in-page sections.
 *
 * Centralises the GSAP scroll behaviour so the navbar, hero and CTA components
 * all share one implementation (and one offset for the fixed navbar).
 */
@Injectable({providedIn: 'root'})
export class ScrollService {
  /** Vertical offset (px) applied so targets clear the fixed navbar. */
  private readonly navbarOffset = 80;

  /**
   * Smoothly scrolls the viewport to the element with the given id.
   *
   * @param sectionId DOM id of the target section; a no-op if not found.
   */
  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }
    gsap.to(window, {
      duration: 1,
      scrollTo: {y: section, offsetY: this.navbarOffset},
      ease: 'power2.inOut',
    });
  }
}
