import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MnSectionDirective} from 'mn-angular-lib/core';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer';
import {SeoService} from './services/seo.service';

/** Root component: the navbar, routed page and footer shell. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MnSectionDirective, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App {
  /** Site name. */
  protected readonly title = signal('SlopeWorks');
  /** Keeps per-route title, description and structured data in sync. */
  private readonly seo = inject(SeoService);

  /** Starts syncing per-route SEO metadata for the lifetime of the app. */
  constructor() {
    this.seo.init();
  }
}
