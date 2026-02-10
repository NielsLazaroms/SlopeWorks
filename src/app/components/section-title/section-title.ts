import {Component, inject, InjectionToken, Input} from '@angular/core';
import {SectionTitleTypes} from './section-titleTypes';
import {sectionTitleVariants} from './section-titleVariants';
import {NgClass} from '@angular/common';
import {APP_PARALLAX_COMPONENT_CONFIG, ParallaxComponentConfig} from '../parallax-component';
import {provideMnComponentConfig} from 'mn-angular-lib';

export interface SectionTitleConfig {
  title?: string;
}

export const APP_SECTION_TITLE_CONFIG = new InjectionToken<SectionTitleConfig>('APP_SECTION_TITLE_CONFIG');



@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [
    NgClass
  ],
  providers: [
    provideMnComponentConfig<ParallaxComponentConfig>(APP_SECTION_TITLE_CONFIG, 'app-section-title'),
  ],
  templateUrl: './section-title.html',
})
export class SectionTitle {
  @Input() data!: SectionTitleTypes;

  protected readonly componentConfig = inject(APP_SECTION_TITLE_CONFIG);

  get classes() {
    return sectionTitleVariants({
      size: this.data?.size,
      shadow: this.data?.shadow,
      showUnderLine: this.data?.showUnderLine,
      textPosition: this.data?.textPosition,
      textColor: this.data?.textColor,
      underlineColor: this.data?.underlineColor,
      fontWeight: this.data?.fontWeight,
      textStroke: this.data?.textStroke,
    });
  }
}
