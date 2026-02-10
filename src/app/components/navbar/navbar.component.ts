import {Component, HostListener, inject, InjectionToken} from '@angular/core';
import {NgClass} from '@angular/common';
import {NavListItemComponent} from './nav-list-item/nav-list-item.component';
import {provideMnComponentConfig} from 'mn-angular-lib';

export interface NavbarNavItem {
  label: string;
  sectionId: string;
}

export interface NavbarConfig {
  logoSrc?: string;
  logoAlt?: string;
  navItems?: NavbarNavItem[];
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
  protected readonly componentConfig = inject(APP_NAVBAR_CONFIG);
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.navbar');
    if (!clickedInside) {
      this.menuOpen = false;
    }
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({behavior: 'smooth', block: 'start'});
      this.closeMenu();
    }
  }
}
