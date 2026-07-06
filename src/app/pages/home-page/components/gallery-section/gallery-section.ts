import {Component, ElementRef, signal, viewChildren} from '@angular/core';
import {NgClass} from '@angular/common';
import {MnBadge, MnTranslatePipe} from 'mn-angular-lib';
import {EyebrowComponent} from '../../../../components/eyebrow/eyebrow';

/**
 * A single slide in the gallery: a scouting photo with a location stamp.
 */
interface GallerySlide {
  /** Photo URL. */
  src: string;
  /** i18n key for the alt text. */
  altKey: string;
  /** Location stamp overlaid on the photo (proper nouns — language-neutral). */
  caption: string;
}

/**
 * The home page photo gallery: a contained slideshow of scouting shots.
 *
 * One feature photo is shown at a time inside the page's content column, so the
 * frame always fits the viewport on every screen. Photos crossfade between
 * slides, each carries a location stamp — the "we've actually been there" idea
 * the whole page runs on — and a contact-sheet thumbnail rail below lets you jump
 * to any shot, the active frame lifting with a brand ring.
 */
@Component({
  selector: 'app-gallery-section',
  standalone: true,
  imports: [MnBadge, MnTranslatePipe, NgClass, EyebrowComponent],
  templateUrl: './gallery-section.html',
})
export class GallerySectionComponent {
  /** The thumbnail buttons, so the active one can be scrolled into view. */
  private readonly thumbs = viewChildren<ElementRef<HTMLElement>>('thumb');

  /** Index of the slide currently shown in the feature frame. */
  protected readonly activeIndex = signal(0);

  /** Slides in display order; captions are scouted locations. */
  protected readonly slides: GallerySlide[] = [
    {src: '/images/gallery/solden-gaislachkogl.webp', altKey: 'home.gallery.alt.gaislachkogl', caption: 'Sölden · Gaislachkogl'},
    {src: '/images/gallery/solden-schirmbar.webp', altKey: 'home.gallery.alt.schirmbar', caption: 'Sölden · Schirmbar'},
    {src: '/images/gallery/hintertux-ijsgrot.webp', altKey: 'home.gallery.alt.ijsgrot', caption: 'Hintertux · ijsgrot'},
    {src: '/images/gallery/mayrhofen-kaiserschmarrn.webp', altKey: 'home.gallery.alt.kaiserschmarrn', caption: 'Mayrhofen · Kaiserschmarrn'},
    {src: '/images/gallery/mayrhofen-jagerhof.webp', altKey: 'home.gallery.alt.jagerhof', caption: 'Mayrhofen · Hotel Jägerhof'},
    {src: '/images/gallery/mayrhofen-zillertalerhof.webp', altKey: 'home.gallery.alt.zillertalerhof', caption: 'Mayrhofen · Hotel Zillertalerhof'},
    {src: '/images/gallery/gstaad-golfhotel.webp', altKey: 'home.gallery.alt.golfhotel', caption: 'Saanenmöser · Golfhotel'},
    {src: '/images/gallery/gstaad-lauenensee.webp', altKey: 'home.gallery.alt.lauenensee', caption: 'Gstaad · Lauenensee'},
    {src: '/images/gallery/gstaad-saanenmoser.webp', altKey: 'home.gallery.alt.saanenmoser', caption: 'Saanenmöser'},
  ];

  /**
   * Shows the slide at the given index.
   *
   * @param index Position of the slide to show.
   */
  protected select(index: number): void {
    this.activeIndex.set(index);
    this.revealActiveThumb();
  }

  /**
   * Advances the feature frame in the given direction, wrapping at both ends.
   *
   * @param direction `-1` for the previous slide, `1` for the next.
   */
  protected step(direction: -1 | 1): void {
    const count = this.slides.length;
    this.activeIndex.update((index) => (index + direction + count) % count);
    this.revealActiveThumb();
  }

  /**
   * Centres the active thumbnail within the rail. Called only from user
   * actions — never on load — so it can never scroll the page to the gallery
   * while the section is still below the fold.
   */
  private revealActiveThumb(): void {
    this.thumbs()[this.activeIndex()]?.nativeElement.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth',
    });
  }
}
