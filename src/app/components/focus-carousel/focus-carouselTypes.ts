import {InjectionToken} from '@angular/core';

export interface ImageProps {
  src: string;
  alt: string;
  id: number;
}

export interface FocusCarouselTypes {
  images: ImageProps[];
  showArrows: boolean;
}

export interface FocusCarouselConfig {
  images?: ImageProps[];
  showArrows?: boolean;
}

export const APP_FOCUS_CAROUSEL_CONFIG = new InjectionToken<FocusCarouselConfig>('APP_FOCUS_CAROUSEL_CONFIG');
