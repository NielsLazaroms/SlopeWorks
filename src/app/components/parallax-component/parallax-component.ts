import {Component, inject, InjectionToken, Input} from '@angular/core';
import gsap from 'gsap';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);
import {MnButton, MnInstanceDirective, provideMnComponentConfig} from 'mn-angular-lib';
import {NgOptimizedImage} from '@angular/common';
import {SectionTitle} from '../section-title/section-title';
import {ParallaxComponentData} from './parallax-componentTypes';


export interface ParallaxComponentConfig {
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  description?: string;
  buttonText?: string;
}

export const APP_PARALLAX_COMPONENT_CONFIG = new InjectionToken<ParallaxComponentConfig>('APP_PARALLAX_COMPONENT_CONFIG');


@Component({
  selector: 'app-parallax-component',
  standalone: true,
  imports: [
    MnButton,
    SectionTitle,
    MnInstanceDirective,
    NgOptimizedImage
  ],
  providers: [
    provideMnComponentConfig<ParallaxComponentConfig>(APP_PARALLAX_COMPONENT_CONFIG, 'app-parallax-component'),
  ],
  templateUrl: './parallax-component.html',
})
export class ParallaxComponent {
  @Input({ required: true }) data!: ParallaxComponentData;

  protected readonly componentConfig = inject(APP_PARALLAX_COMPONENT_CONFIG);

  scrollToPackages() {
    const element = document.getElementById('packages-section');
    if (element) {
      gsap.to(window, { duration: 1, scrollTo: { y: element, offsetY: 80 }, ease: 'power2.inOut' });
    }
  }
}
