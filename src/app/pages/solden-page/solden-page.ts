import {Component, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MnTranslatePipe} from 'mn-angular-lib';
import {BreadcrumbComponent} from '../../components/breadcrumb/breadcrumb';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';

/**
 * A key/value pair (both i18n keys) for the hero stat card and info strip.
 */
interface KeyValue {
  /** i18n key for the label. */
  labelKey: string;
  /** i18n key for the value. */
  valueKey: string;
}

/**
 * A related destination shown at the foot of the page.
 */
interface RelatedDestination {
  /** Resort name (kept literal across languages). */
  name: string;
  /** i18n key for the country / region line. */
  countryKey: string;
  /** Photo URL. */
  imageUrl: string;
  /** Router path, when a detail page exists. */
  route?: string;
}

/**
 * A question/answer pair for the on-page FAQ.
 */
interface QnA {
  /** i18n key for the question. */
  qKey: string;
  /** i18n key for the answer. */
  aKey: string;
}

/**
 * The Sölden destination-detail page (`/bestemmingen/solden`).
 *
 * The template for every scouted area: a photographic hero with an at-a-glance
 * stat card, an intro, a facts strip, a dark "signature moment" band, a
 * for-whom/not-for-whom split, related areas, and a page-specific FAQ.
 */
@Component({
  selector: 'app-solden-page',
  standalone: true,
  imports: [RouterLink, MnTranslatePipe, BreadcrumbComponent, PageCtaComponent, RevealDirective],
  templateUrl: './solden-page.html',
})
export class SoldenPage {
  /** At-a-glance rows shown in the hero stat card. */
  protected readonly statRows: KeyValue[] = [
    {labelKey: 'solden.stat.pistes.k', valueKey: 'solden.stat.pistes.v'},
    {labelKey: 'solden.stat.altitude.k', valueKey: 'solden.stat.altitude.v'},
    {labelKey: 'solden.stat.transfer.k', valueKey: 'solden.stat.transfer.v'},
    {labelKey: 'solden.stat.season.k', valueKey: 'solden.stat.season.v'},
    {labelKey: 'solden.stat.group.k', valueKey: 'solden.stat.group.v'},
  ];

  /** Four-up facts strip beneath the intro. */
  protected readonly infoCells: KeyValue[] = [
    {labelKey: 'solden.info.pass.k', valueKey: 'solden.info.pass.v'},
    {labelKey: 'solden.info.crowd.k', valueKey: 'solden.info.crowd.v'},
    {labelKey: 'solden.info.level.k', valueKey: 'solden.info.level.v'},
    {labelKey: 'solden.info.vibe.k', valueKey: 'solden.info.vibe.v'},
  ];

  /** "Fits well if" bullet keys. */
  protected readonly fitYes: string[] = [
    'solden.fit.yes1',
    'solden.fit.yes2',
    'solden.fit.yes3',
    'solden.fit.yes4',
  ];

  /** "Less suitable if" bullet keys. */
  protected readonly fitNo: string[] = [
    'solden.fit.no1',
    'solden.fit.no2',
    'solden.fit.no3',
  ];

  /** Related destinations shown at the foot of the page. */
  protected readonly related: RelatedDestination[] = [
    {name: 'Mayrhofen', countryKey: 'destinations.mayrhofen.country', imageUrl: '/images/carousel_8.webp', route: '/bestemmingen'},
    {name: 'St. Anton am Arlberg', countryKey: 'destinations.stanton.country', imageUrl: '/images/carousel_7.webp', route: '/bestemmingen'},
    {name: 'Gstaad / Saanenmöser', countryKey: 'destinations.gstaad.country', imageUrl: '/images/carousel_5.webp', route: '/bestemmingen'},
  ];

  /** On-page FAQ entries specific to Sölden. */
  protected readonly faqs: QnA[] = [
    {qKey: 'solden.faq.q1', aKey: 'solden.faq.a1'},
    {qKey: 'solden.faq.q2', aKey: 'solden.faq.a2'},
    {qKey: 'solden.faq.q3', aKey: 'solden.faq.a3'},
    {qKey: 'solden.faq.q4', aKey: 'solden.faq.a4'},
  ];

  /** Currently expanded FAQ questions, keyed by their question i18n key. */
  private readonly openKeys = signal<ReadonlySet<string>>(new Set());

  /**
   * Whether an FAQ question is currently expanded.
   *
   * @param qKey The question's i18n key.
   */
  isOpen(qKey: string): boolean {
    return this.openKeys().has(qKey);
  }

  /**
   * Expands or collapses a single FAQ question.
   *
   * @param qKey The question's i18n key.
   */
  toggle(qKey: string): void {
    const next = new Set(this.openKeys());
    if (next.has(qKey)) {
      next.delete(qKey);
    } else {
      next.add(qKey);
    }
    this.openKeys.set(next);
  }
}
