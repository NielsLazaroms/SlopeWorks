import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MnSectionDirective} from 'mn-angular-lib';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer';
import {SeoService} from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MnSectionDirective, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SlopeWorks');
  private readonly seo = inject(SeoService);

  /** Starts syncing per-route SEO metadata for the lifetime of the app. */
  constructor() {
    this.seo.init();
  }
}
