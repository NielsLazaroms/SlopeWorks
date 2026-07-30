import {Component, inject, InjectionToken} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MnTranslatePipe, provideMnComponentConfig} from 'mn-angular-lib';
import {EyebrowComponent} from '../eyebrow/eyebrow';

/**
 * A single external link shown in the footer's social row.
 */
export interface FooterLink {
  /** Visible label, e.g. "LinkedIn". */
  label: string;
  /** Absolute URL the link points to. */
  href: string;
}

/**
 * An internal wayfinding link in the footer's "Navigate" column.
 */
export interface FooterNavItem {
  /** i18n key resolved through {@link MnTranslatePipe} for the link label. */
  labelKey: string;
  /** Router path the link navigates to. */
  route: string;
}

/**
 * Configuration for {@link FooterComponent}, provided via {@link APP_FOOTER_CONFIG}
 * and overridden in `mn-config.json5`. Holds the brand mark, the social links and
 * the factual contact / legal details shown in the footer's lower columns.
 */
export interface FooterConfig {
  /** Path to the brand logo image. */
  logoSrc?: string;
  /** Alt text for the brand logo. */
  logoAlt?: string;
  /** i18n key for the copyright line resolved in the template. */
  copyrightText?: string;
  /** External social links. */
  links?: FooterLink[];
  /** Contact email address (rendered as a `mailto:` link). */
  email?: string;
  /** Contact phone number in human-readable form, e.g. "+32 468 41 12 87". */
  phone?: string;
  /** Registered-office address lines above the country, e.g. street and city. */
  addressLines?: string[];
  /** Belgian company registration number ("ondernemingsnummer"). */
  companyNumber?: string;
  /** Belgian VAT number ("btw-nummer"). */
  vatNumber?: string;
}

/**
 * Injection token carrying the {@link FooterConfig} for the footer component.
 */
export const APP_FOOTER_CONFIG = new InjectionToken<FooterConfig>('APP_FOOTER_CONFIG');

/**
 * Site footer. Beyond the brand mark and social links it acts as the field-guide
 * colophon: a "Navigate" column mirrors the main navigation, "Reach us" exposes the
 * direct channels, and "Base camp" frames the registered office and legal numbers
 * as the one place on the map that is SlopeWorks' own.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MnTranslatePipe, EyebrowComponent],
  providers: [
    provideMnComponentConfig<FooterConfig>(APP_FOOTER_CONFIG, 'app-footer'),
  ],
  templateUrl: './footer.html',
})
export class FooterComponent {
  /** Resolved footer configuration (logo, socials, contact and legal details). */
  protected readonly componentConfig = inject(APP_FOOTER_CONFIG);

  /** Current calendar year, shown in the copyright line. */
  protected readonly currentYear = new Date().getFullYear();

  /**
   * Wayfinding links for the "Navigate" column. Kept in step with the navbar's
   * routes; labels resolve through the shared `navbar.*` i18n keys so the two
   * navigations never drift in wording.
   */
  protected readonly navItems: FooterNavItem[] = [
    {labelKey: 'navbar.home', route: '/'},
    {labelKey: 'navbar.destinations', route: '/bestemmingen'},
    {labelKey: 'navbar.about', route: '/over-ons'},
    {labelKey: 'navbar.faq', route: '/faq'},
    {labelKey: 'navbar.comparison', route: '/vergelijken'},
    {labelKey: 'navbar.contact', route: '/contact'},
  ];

  /**
   * Strips spaces from the configured phone number to build a valid `tel:` target.
   * @param phone The human-readable phone number.
   * @returns The phone number with whitespace removed.
   */
  protected telHref(phone: string): string {
    return phone.replace(/\s+/g, '');
  }
}
