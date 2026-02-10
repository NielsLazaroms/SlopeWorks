import {Component, inject, InjectionToken} from '@angular/core';
import {FocusCarousel} from '../../../../components/focus-carousel/focus-carousel';
import {SectionTitleTypes} from '../../../../components/section-title/section-titleTypes';
import {SectionTitle} from '../../../../components/section-title/section-title';
import {MnInstanceDirective, provideMnComponentConfig} from 'mn-angular-lib';

export interface PicturesSectionConfig {
  description?: string;
}

export const APP_PICTURES_SECTION_COMPONENT_CONFIG = new InjectionToken<PicturesSectionConfig>('APP_PICTURES_SECTION_CONFIG');


@Component({
  selector: 'app-pictures-section',
  standalone: true,
  imports: [
    SectionTitle,
    FocusCarousel,
    MnInstanceDirective,
  ],
  providers: [
    provideMnComponentConfig<PicturesSectionConfig>(APP_PICTURES_SECTION_COMPONENT_CONFIG, 'app-pictures-section'),
  ],
  templateUrl: './pictures-section.html',
})
export class PicturesSectionComponent {

  protected readonly componentConfig = inject(APP_PICTURES_SECTION_COMPONENT_CONFIG);

  carouselTitle = {
    size: 'md',
    shadow: false,
    showUnderLine: true,
    underlineColor: 'primary',
    textPosition: 'left',
    textColor: 'dark',
    fontWeight: 'semibold',
    textStroke: 'sm',
  } as SectionTitleTypes;
}
