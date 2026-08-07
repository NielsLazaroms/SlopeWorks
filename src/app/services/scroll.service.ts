import {Injectable} from '@angular/core';

/**
 * Provides smooth, animated scrolling to in-page sections.
 *
 * Centralises the native smooth-scroll behaviour so the navbar, hero and CTA
 * components all share one implementation (and one offset for the fixed navbar).
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
    const top = section.getBoundingClientRect().top + window.scrollY - this.navbarOffset;
    window.scrollTo({top, behavior: 'smooth'});
  }
}
