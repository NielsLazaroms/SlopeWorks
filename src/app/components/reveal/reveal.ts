import {afterNextRender, Directive, ElementRef, OnDestroy, inject} from '@angular/core';

/**
 * Scroll-reveal directive shared by every page band.
 *
 * Replicates the home page's band-by-band entrance: the host element fades in and
 * rises 60px into place with an ease-out curve as it crosses 85% of the viewport.
 * Applying `appReveal` to a section is all that is needed — the observer and its
 * inline styles are created here and torn down on destroy, so the per-page reveal
 * boilerplate lives in one place.
 *
 * Implemented with a native `IntersectionObserver` and CSS transitions (no
 * animation library), keeping the shared JS bundle small. The animation is
 * skipped entirely when the visitor prefers reduced motion, leaving the element
 * fully visible, and the residual transform is cleared on completion so
 * `position: sticky` descendants keep working.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnDestroy {
  /** The host element that fades and rises into view. */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Watches for the host entering the viewport; disconnected on teardown. */
  private observer?: IntersectionObserver;

  /**
   * Distance (px) the host rises from as it reveals. Matches the previous
   * `y: 60` entrance offset.
   */
  private readonly riseFrom = 60;

  /**
   * Sets the hidden start state and observes the host once it is laid out.
   * `afterNextRender` runs in the browser only, so the animation is skipped
   * during prerendering (leaving the content fully visible in the served HTML).
   */
  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const el = this.host.nativeElement;
      el.style.opacity = '0';
      el.style.transform = `translateY(${this.riseFrom}px)`;
      el.style.willChange = 'opacity, transform';

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.reveal();
              break;
            }
          }
        },
        // Shrinking the root's bottom by 15% mirrors GSAP's `start: 'top 85%'`:
        // the reveal fires once the host crosses 85% of the viewport height.
        {rootMargin: '0px 0px -15% 0px'},
      );
      this.observer.observe(el);
    });
  }

  /**
   * Plays the fade-and-rise entrance once, then clears the inline transform so
   * `position: sticky` descendants keep working, and stops observing.
   */
  private reveal(): void {
    const el = this.host.nativeElement;
    this.observer?.disconnect();

    el.style.transition = 'opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)';

    // Flip to the resting state on the next frame so the transition runs.
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    // Strip the residual inline styles once the transform settles.
    el.addEventListener(
      'transitionend',
      (event) => {
        if (event.propertyName !== 'transform') {
          return;
        }
        el.style.transition = '';
        el.style.transform = '';
        el.style.opacity = '';
        el.style.willChange = '';
      },
      {once: true},
    );
  }

  /** Stops observing the host on teardown. */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
