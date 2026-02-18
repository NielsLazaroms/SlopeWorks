import {Component, inject, InjectionToken} from '@angular/core';
import {
  MnButton,
  MnButtonTypes,
  MnDualHorizontalImage,
  MnInstanceDirective, provideMnComponentConfig,
} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../../../components/section-title/section-titleTypes';
import {SectionTitle} from '../../../../components/section-title/section-title';

export interface AboutSectionConfig {
  description?: string;
  aboutUsButtonText?: string;
}

export const APP_ABOUT_SECTION_COMPONENT_CONFIG = new InjectionToken<AboutSectionConfig>('APP_ABOUT_SECTION_CONFIG');



@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [
    SectionTitle,
    MnDualHorizontalImage,
    MnButton,
    MnInstanceDirective,
  ],
  providers: [
    provideMnComponentConfig<AboutSectionConfig>(APP_ABOUT_SECTION_COMPONENT_CONFIG, 'app-about-section'),
  ],
  templateUrl: './about-section.html',
})
export class AboutSectionComponent {

  protected readonly componentConfig = inject(APP_ABOUT_SECTION_COMPONENT_CONFIG);

  aboutUsTitle = {
    size: 'md',
    shadow: false,
    showUnderLine: true,
    underlineColor: 'primary',
    textPosition: 'left',
    textColor: 'dark',
    fontWeight: 'semibold',
    textStroke: 'sm',
  } as SectionTitleTypes;

  aboutUsButton = {
    color: 'primary',
    size: 'md',
    variant: 'fill',
    borderRadius: 'xl',
    fullWidth: false,
  } as MnButtonTypes;

  scrollToContact() {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
