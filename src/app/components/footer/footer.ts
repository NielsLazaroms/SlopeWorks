import {Component, inject, InjectionToken} from '@angular/core';
import {provideMnComponentConfig} from 'mn-angular-lib';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  logoSrc?: string;
  logoAlt?: string;
  copyrightText?: string;
  links?: FooterLink[];
}

export const APP_FOOTER_CONFIG = new InjectionToken<FooterConfig>('APP_FOOTER_CONFIG');

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  providers: [
    provideMnComponentConfig<FooterConfig>(APP_FOOTER_CONFIG, 'app-footer'),
  ],
  templateUrl: './footer.html',
})
export class FooterComponent {
  protected readonly componentConfig = inject(APP_FOOTER_CONFIG);
  currentYear = new Date().getFullYear();
}
