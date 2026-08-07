import {afterNextRender, Component, ElementRef, OnDestroy, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Meta} from '@angular/platform-browser';
import {LucideArrowRight} from '@lucide/angular';
import gsap from 'gsap';
import {MnButton, MnButtonTypes, MnTranslatePipe} from 'mn-angular-lib';
import {EyebrowComponent} from '../../components/eyebrow/eyebrow';

/**
 * The 404 page (the `**` catch-all route, and the prerendered `/404` served by
 * the host's `ErrorDocument` for mistyped URLs).
 *
 * Framed in the brand's own piste vernacular: a visitor on a dead URL has skied
 * off the marked run. It reuses the site's sanctioned hero treatment — a scouting
 * photograph under a deep gradient, the only full-dark surface besides the page
 * heroes — because a 404 is spiritually a hero with no body. The wayfinding is the
 * real work: two clear routes back onto the piste (home, destinations) plus a
 * quiet line to contact.
 *
 * On load it plays one orchestrated GSAP arrival: the photo drifts in, the
 * headline rises behind a mask, then the lede and buttons settle in, over a field
 * of ambient snow. The whole sequence is browser-only (so the prerendered/no-JS
 * HTML shows the final state) and skipped for visitors who prefer reduced motion.
 *
 * The page adds a temporary `noindex` robots tag (baked into the prerendered HTML)
 * so search engines don't index the soft-404, and removes it on navigation away so
 * the site's indexable default is restored for every other page.
 */
@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, LucideArrowRight, MnButton, MnTranslatePipe, EyebrowComponent],
  templateUrl: './not-found-page.html',
})
export class NotFoundPage implements OnDestroy {
  /** Meta service used to add and later remove the page-scoped `noindex` tag. */
  private readonly meta = inject(Meta);

  /** Host element, scoped root for the entrance timeline's element lookups. */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** GSAP context owning the entrance timeline, reverted on teardown. */
  private ctx?: gsap.Context;

  /** Tears down the ambient snow (rAF loop + resize observer); set when it starts. */
  private stopSnow?: () => void;

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

  /**
   * Marks the 404 as `noindex` so crawlers skip the soft-404 (baked into the
   * static `404.html` during prerender too), then plays the entrance timeline once
   * the view is laid out in the browser.
   */
  constructor() {
    this.meta.updateTag({name: 'robots', content: 'noindex, follow'});
    afterNextRender(() => {
      // Both the entrance and the drifting snow are motion; a visitor who prefers
      // reduced motion gets the finished, still layout instead.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      this.playEntrance();
      this.startSnow();
    });
  }

  /**
   * Plays the one-shot arrival: photo drift, masked headline rise (the yellow
   * accent rides up with it), then the lede and buttons settling in. Initial
   * hidden states are set here (not in CSS) so the served HTML and reduced-motion
   * visitors always see the finished layout.
   */
  private playEntrance(): void {
    const root = this.host.nativeElement;
    const pick = (name: string) => root.querySelector<HTMLElement>(`[data-anim="${name}"]`);
    const [photo, eyebrow, heading, lede, note] = ['photo', 'eyebrow', 'heading', 'lede', 'note'].map(pick);
    const ctas = root.querySelectorAll<HTMLElement>('[data-anim="cta"]');

    this.ctx = gsap.context(() => {
      gsap.set([eyebrow, lede, note], {autoAlpha: 0, y: 18});
      gsap.set(ctas, {autoAlpha: 0, y: 16});
      gsap.set(heading, {yPercent: 110});

      gsap
        .timeline({defaults: {ease: 'power3.out'}})
        .from(photo, {scale: 1.1, duration: 1.6, ease: 'power2.out'}, 0)
        .to(eyebrow, {autoAlpha: 1, y: 0, duration: 0.6}, 0.15)
        .to(heading, {yPercent: 0, duration: 0.9, ease: 'power4.out'}, 0.28)
        .to(lede, {autoAlpha: 1, y: 0, duration: 0.6}, 0.7)
        .to(ctas, {autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.09}, 0.82)
        .to(note, {autoAlpha: 1, y: 0, duration: 0.5}, 1.0);
    }, root);
  }

  /**
   * Runs the ambient snow: a lightweight canvas particle field drawn over the
   * photo but beneath the content, so drifting flakes never touch the text. Flakes
   * fall slowly with a gentle horizontal sway and recycle from the top; the count
   * scales with the viewport and the canvas tracks its own size. Kept sparse and
   * low-contrast so it reads as atmosphere, not a snow globe. `requestAnimationFrame`
   * pauses itself when the tab is hidden.
   */
  private startSnow(): void {
    const canvas = this.host.nativeElement.querySelector<HTMLCanvasElement>('[data-snow]');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rnd = (min: number, max: number) => min + Math.random() * (max - min);
    /** One snowflake: position, radius, fall speed, sway width/phase, and opacity. */
    type Flake = {x: number; y: number; r: number; vy: number; sway: number; phase: number; alpha: number};
    let width = 0;
    let height = 0;
    const flakes: Flake[] = [];

    /** Builds a flake; `fromTop` starts it just above the frame, else anywhere. */
    const spawn = (fromTop: boolean): Flake => ({
      x: rnd(0, width || 1),
      y: fromTop ? -rnd(0, 40) : rnd(0, height || 1),
      r: rnd(0.8, 2.6),
      vy: rnd(12, 34),
      sway: rnd(6, 18),
      phase: rnd(0, Math.PI * 2),
      alpha: rnd(0.25, 0.7),
    });

    /** Matches the backing store to the canvas size and (re)fills the flake pool. */
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with the visible area (not just width) and has a floor, so
      // tall, narrow phone screens still get a proper flurry rather than a width-
      // based handful of flakes.
      const target = Math.max(34, Math.min(80, Math.round((width * height) / 20000)));
      while (flakes.length < target) {
        flakes.push(spawn(false));
      }
      flakes.length = Math.min(flakes.length, target);
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      for (const f of flakes) {
        f.y += f.vy * dt;
        f.x += Math.sin(now / 1000 + f.phase) * f.sway * dt;
        if (f.y - f.r > height) {
          Object.assign(f, spawn(true));
        }
        ctx.globalAlpha = f.alpha;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    raf = requestAnimationFrame(tick);

    this.stopSnow = () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }

  /** Reverts the entrance timeline, stops the snow and removes `noindex` on teardown. */
  ngOnDestroy(): void {
    this.ctx?.revert();
    this.stopSnow?.();
    this.meta.removeTag("name='robots'");
  }
}
