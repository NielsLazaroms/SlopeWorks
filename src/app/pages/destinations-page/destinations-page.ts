import {Component, computed, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MnBadge, MnTranslatePipe} from 'mn-angular-lib';
import {PageHeroComponent} from '../../components/page-hero/page-hero';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';

/**
 * A ski area SlopeWorks has scouted, as shown on the destinations overview.
 */
interface DestinationEntry {
  /** Resort name (kept literal across languages). */
  name: string;
  /** i18n key for the country / region line. */
  countryKey: string;
  /** i18n key for the one-line description. */
  descriptionKey: string;
  /** i18n keys for the small trait tags. */
  tagKeys: string[];
  /** Country filter this entry belongs to. */
  country: 'at' | 'ch';
  /** Scouting photo URL. */
  imageUrl: string;
  /** Router path to the detail page; omitted while the page is still in progress. */
  route?: string;
  /** i18n key for the corner badge (e.g. "glacier-sure" / "page in progress"). */
  badgeKey?: string;
}

/**
 * The destinations overview page (`/bestemmingen`).
 *
 * Lists the six scouted ski areas with a country filter. Every area links to its
 * own detail page (`/bestemmingen/:slug`).
 */
@Component({
  selector: 'app-destinations-page',
  standalone: true,
  imports: [NgClass, RouterLink, MnBadge, MnTranslatePipe, PageHeroComponent, PageCtaComponent, RevealDirective],
  templateUrl: './destinations-page.html',
})
export class DestinationsPage {
  /** Active country filter; `all` shows every area. */
  protected readonly filter = signal<'all' | 'at' | 'ch'>('all');

  /** The country filters offered above the grid. */
  protected readonly filters: {id: 'all' | 'at' | 'ch'; labelKey: string}[] = [
    {id: 'all', labelKey: 'destinations.filter.all'},
    {id: 'at', labelKey: 'destinations.filter.at'},
    {id: 'ch', labelKey: 'destinations.filter.ch'},
  ];

  /** All six scouted areas, in display order. */
  private readonly destinations: DestinationEntry[] = [
    {
      name: 'Sölden',
      countryKey: 'destinations.solden.country',
      descriptionKey: 'destinations.solden.description',
      tagKeys: ['destinations.solden.tag1', 'destinations.solden.tag2', 'destinations.solden.tag3'],
      country: 'at',
      imageUrl: '/images/carousel_1.webp',
      route: '/bestemmingen/solden',
      badgeKey: 'destinations.solden.badge',
    },
    {
      name: 'Mayrhofen',
      countryKey: 'destinations.mayrhofen.country',
      descriptionKey: 'destinations.mayrhofen.description',
      tagKeys: ['destinations.mayrhofen.tag1', 'destinations.mayrhofen.tag2'],
      country: 'at',
      imageUrl: '/images/carousel_8.webp',
      route: '/bestemmingen/mayrhofen',
    },
    {
      name: 'St. Anton am Arlberg',
      countryKey: 'destinations.stanton.country',
      descriptionKey: 'destinations.stanton.description',
      tagKeys: ['destinations.stanton.tag1', 'destinations.stanton.tag2'],
      country: 'at',
      imageUrl: '/images/carousel_7.webp',
      route: '/bestemmingen/st-anton',
    },
    {
      name: 'Kitzbühel-Kirchberg',
      countryKey: 'destinations.kitzbuhel.country',
      descriptionKey: 'destinations.kitzbuhel.description',
      tagKeys: ['destinations.kitzbuhel.tag1', 'destinations.kitzbuhel.tag2'],
      country: 'at',
      imageUrl: '/images/carousel_9.webp',
      route: '/bestemmingen/kitzbuhel',
    },
    {
      name: 'Zell am See-Kaprun',
      countryKey: 'destinations.zellamsee.country',
      descriptionKey: 'destinations.zellamsee.description',
      tagKeys: ['destinations.zellamsee.tag1', 'destinations.zellamsee.tag2'],
      country: 'at',
      imageUrl: '/images/carousel_10.webp',
      route: '/bestemmingen/zell-am-see',
    },
    {
      name: 'Gstaad / Saanenmöser',
      countryKey: 'destinations.gstaad.country',
      descriptionKey: 'destinations.gstaad.description',
      tagKeys: ['destinations.gstaad.tag1'],
      country: 'ch',
      imageUrl: '/images/carousel_5.webp',
      route: '/bestemmingen/gstaad',
    },
  ];

  /** The destinations matching the active country filter. */
  protected readonly visible = computed<DestinationEntry[]>(() => {
    const active = this.filter();
    return active === 'all' ? this.destinations : this.destinations.filter((d) => d.country === active);
  });

  /**
   * Selects a country filter.
   *
   * @param id The filter to activate.
   */
  setFilter(id: 'all' | 'at' | 'ch'): void {
    this.filter.set(id);
  }
}
