import {Component, HostListener, inject, InjectionToken} from '@angular/core';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {NavListItemComponent} from './nav-list-item/nav-list-item.component';
import {MnLanguageService, provideMnComponentConfig} from 'mn-angular-lib';
import {NavigationService} from '../../services/navigation.service';

/**
 * A single navigation entry. Each entry either routes to a page (`route`) or
 * scrolls to an in-page section on the home page (`sectionId`); exactly one is set.
 */
export interface NavbarNavItem {
  /** Visible link label (already resolved to the active language). */
  label: string;
  /** DOM id of the home section the link scrolls to (in-page targets). */
  sectionId?: string;
  /** Router path the link navigates to (dedicated pages). */
  route?: string;
}

/**
 * Configuration for the navbar, supplied via `mn-config.json5`.
 */
export interface NavbarConfig {
  /** Path to the logo icon rendered next to the wordmark. */
  logoSrc?: string;
  /** Accessible alt text for the logo. */
  logoAlt?: string;
  /** Primary navigation entries. */
  navItems?: NavbarNavItem[];
  /** Contact entry, surfaced separately from the main list. */
  contactItem?: NavbarNavItem;
}

export const APP_NAVBAR_CONFIG = new InjectionToken<NavbarConfig>('APP_NAVBAR_CONFIG');

@Component({
  selector: 'app-navbar',
  imports: [NavListItemComponent, NgClass],
  templateUrl: './navbar.component.html',
  standalone: true,
  providers: [
    provideMnComponentConfig<NavbarConfig>(APP_NAVBAR_CONFIG, 'app-navbar'),
  ],
})
export class NavbarComponent {
  /** Navbar content resolved from `mn-config.json5`. */
  protected readonly componentConfig = inject(APP_NAVBAR_CONFIG);
  private readonly lang = inject(MnLanguageService);
  private readonly navigation = inject(NavigationService);
  private readonly router = inject(Router);

  /** Whether the mobile full-screen menu is open. */
  menuOpen = false;

  /** The currently active locale (`'en'` or `'nl'`). */
  get currentLocale(): string {
    return this.lang.locale;
  }

  /**
   * Switches the active language.
   *
   * @param locale Target locale.
   */
  async setLocale(locale: 'en' | 'nl') {
    await this.lang.setLocale(locale);
  }

  /** Toggles the mobile menu open/closed. */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /** Closes the mobile menu. */
  closeMenu() {
    this.menuOpen = false;
  }

  /**
   * Closes the mobile menu when a click lands outside the navbar.
   *
   * @param event The originating document click.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.navbar');
    if (!clickedInside) {
      this.menuOpen = false;
    }
  }

  /**
   * Handles a nav entry click: routes to its page or scrolls to its home
   * section, then closes the mobile menu.
   *
   * @param item The navigation entry that was activated.
   */
  onNavItem(item: NavbarNavItem) {
    if (item.route) {
      this.router.navigateByUrl(item.route);
    } else if (item.sectionId) {
      this.navigation.goToSection(item.sectionId);
    }
    this.closeMenu();
  }

  /**
   * Whether a route-based nav entry matches the current URL (also active on its
   * child routes, e.g. `/bestemmingen` stays lit on `/bestemmingen/solden`).
   *
   * @param item The navigation entry to test.
   */
  isActive(item: NavbarNavItem): boolean {
    if (!item.route) {
      return false;
    }
    const url = this.router.url.split(/[?#]/)[0];
    return url === item.route || url.startsWith(`${item.route}/`);
  }

  /** Navigates to the home page (and scrolls to the top hero when already there). */
  goHome() {
    this.navigation.goToSection('top-section');
    this.closeMenu();
  }
}
