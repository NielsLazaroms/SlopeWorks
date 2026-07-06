import {afterNextRender, Directive, ElementRef, OnDestroy, inject} from '@angular/core';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-reveal directive shared by every page band.
 *
 * Replicates the home page's band-by-band entrance: the host element fades in and
 * rises 60px into place with a `power2.out` ease as it crosses 85% of the
 * viewport. Applying `appReveal` to a section is all that is needed — the tween
 * and its `ScrollTrigger` are created here and torn down on destroy, so the
 * per-page GSAP boilerplate lives in one place.
 *
 * The animation is skipped entirely when the visitor prefers reduced motion,
 * leaving the element fully visible, and `clearProps` removes the residual
 * transform on completion so `position: sticky` descendants keep working.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnDestroy {
  /** The host element that fades and rises into view. */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The reveal tween, retained so its `ScrollTrigger` can be killed on teardown. */
  private tween?: gsap.core.Tween;

  /**
   * Registers the scroll-reveal once the host is laid out. `afterNextRender`
   * runs in the browser only, so the animation is skipped during prerendering
   * (leaving the content fully visible in the served HTML).
   */
  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      this.tween = gsap.from(this.host.nativeElement, {
        scrollTrigger: {
          trigger: this.host.nativeElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform',
      });
    });
  }

  /** Kills this reveal's tween and its `ScrollTrigger` on teardown. */
  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
  }
}
