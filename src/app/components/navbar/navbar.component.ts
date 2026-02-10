import {Component, HostListener} from '@angular/core';
import {NgClass} from '@angular/common';
import {NavListItemComponent} from './nav-list-item/nav-list-item.component';

@Component({
  selector: 'app-navbar',
  imports: [NavListItemComponent, NgClass],
  templateUrl: './navbar.component.html',
  standalone: true,
})
export class NavbarComponent {
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
