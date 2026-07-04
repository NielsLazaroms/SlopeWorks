import {Component, ElementRef, viewChild} from '@angular/core';
import {MnTranslatePipe} from 'mn-angular-lib';

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
 * The home page photo gallery: a horizontal scroll-snap film strip of scouting
 * shots.
 *
 * Every image keeps its native aspect ratio at a uniform height, so nothing is
 * cropped, and each carries a location stamp — the "we've actually been there"
 * idea the whole page runs on. Built on native scroll-snap (not a JS carousel) so
 * layout never depends on image-load timing; the arrows just scroll the track.
 */
@Component({
  selector: 'app-gallery-section',
  standalone: true,
  imports: [MnTranslatePipe],
  templateUrl: './gallery-section.html',
})
export class GallerySectionComponent {
  /** The scrollable strip element, scrolled by the arrow controls. */
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  /** Slides in display order; captions are scouted locations. */
  protected readonly slides: GallerySlide[] = [
    {src: '/images/carousel_1.webp', altKey: 'home.pictures.carousel.1.alt', caption: 'Sölden · Ötztal'},
    {src: '/images/carousel_2.webp', altKey: 'home.pictures.carousel.2.alt', caption: 'Gaislachkogl · 3.048 m'},
    {src: '/images/carousel_6.webp', altKey: 'home.pictures.carousel.5.alt', caption: 'Hintertux · gletsjer'},
    {src: '/images/carousel_8.webp', altKey: 'home.pictures.carousel.6.alt', caption: 'Mayrhofen · Zillertal'},
    {src: '/images/carousel_5.webp', altKey: 'home.pictures.carousel.4.alt', caption: 'Gstaad · Saanenland'},
    {src: '/images/carousel_4.webp', altKey: 'home.pictures.carousel.3.alt', caption: 'Zell am See'},
    {src: '/images/carousel_10.webp', altKey: 'home.pictures.carousel.7.alt', caption: 'St. Anton · Arlberg'},
    {src: '/images/carousel_12.webp', altKey: 'home.pictures.carousel.1.alt', caption: 'Kitzbühel · Tirol'},
  ];

  /**
   * Scrolls the strip by roughly one viewport of images, looping at the ends:
   * "next" past the last photo returns to the first, "previous" before the first
   * jumps to the last.
   *
   * @param direction `-1` to scroll left (previous), `1` to scroll right (next).
   */
  scroll(direction: -1 | 1): void {
    const element = this.track().nativeElement;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const step = Math.min(element.clientWidth * 0.8, 680);

    if (direction === 1 && element.scrollLeft >= maxScroll - 8) {
      element.scrollTo({left: 0, behavior: 'smooth'});
      return;
    }
    if (direction === -1 && element.scrollLeft <= 8) {
      element.scrollTo({left: maxScroll, behavior: 'smooth'});
      return;
    }
    element.scrollBy({left: direction * step, behavior: 'smooth'});
  }
}
