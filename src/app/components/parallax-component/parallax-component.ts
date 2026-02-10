import {Component, inject, InjectionToken, Input} from '@angular/core';
import {MnButton, MnInstanceDirective, provideMnComponentConfig} from 'mn-angular-lib';
import {NgStyle} from '@angular/common';
import {SectionTitle} from '../section-title/section-title';
import {imageType, ParallaxComponentData} from './parallax-componentTypes';


export interface ParallaxComponentConfig {
  backgroundImageUrl?: string;
  description?: string;
  buttonText?: string;
}

export const APP_PARALLAX_COMPONENT_CONFIG = new InjectionToken<ParallaxComponentConfig>('APP_PARALLAX_COMPONENT_CONFIG');


@Component({
  selector: 'app-parallax-component',
  standalone: true,
  imports: [
    MnButton,
    NgStyle,
    SectionTitle,
    MnInstanceDirective
  ],
  providers: [
    provideMnComponentConfig<ParallaxComponentConfig>(APP_PARALLAX_COMPONENT_CONFIG, 'app-parallax-component'),
  ],
  templateUrl: './parallax-component.html',
})
export class ParallaxComponent {
  @Input({ required: true }) data!: ParallaxComponentData;

  protected readonly componentConfig = inject(APP_PARALLAX_COMPONENT_CONFIG);
}
