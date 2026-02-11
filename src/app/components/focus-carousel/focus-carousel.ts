import {Component, inject} from '@angular/core';
import {ImageProps, FocusCarouselConfig, APP_FOCUS_CAROUSEL_CONFIG} from './focus-carouselTypes';
import {NgxSplideModule} from 'ngx-splide';
import {Options} from '@splidejs/splide';
import {provideMnComponentConfig} from 'mn-angular-lib';

@Component({
  selector: 'app-focus-carousel',
  imports: [NgxSplideModule],
  standalone: true,
  templateUrl: './focus-carousel.html',
  providers: [
    provideMnComponentConfig<FocusCarouselConfig>(APP_FOCUS_CAROUSEL_CONFIG, 'app-focus-carousel'),
  ],
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 80vw;
      overflow: hidden;
    }
  `]
})
export class FocusCarousel {

  protected readonly componentConfig = inject(APP_FOCUS_CAROUSEL_CONFIG);

  get images(): ImageProps[] {
    return this.componentConfig.images ?? [];
  }

  readonly options: Options = {
    type: 'loop',
    arrows: true,
    pagination: true,
    focus: 'center',
    updateOnMove: true,
    cloneStatus: false,
    autoWidth: false,
    gap: '1rem',
    perPage: 5,
    breakpoints: {
      1400: { perPage: 3 },
      1024: { perPage: 3 },
      768: { perPage: 3 },
      600: { perPage: 1 },
    },
  };
}
