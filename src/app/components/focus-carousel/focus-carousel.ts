import { Component, Input } from '@angular/core';
import { ImageProps, FocusCarouselTypes } from './focus-carouselTypes';
import { NgxSplideModule } from 'ngx-splide';
import { Options } from '@splidejs/splide';

@Component({
  selector: 'app-focus-carousel',
  imports: [NgxSplideModule],
  standalone: true,
  templateUrl: './focus-carousel.html',
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
  images: ImageProps[] = [];
  showArrows: boolean = true;

  options: Options = {
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
      1024: { perPage: 5 },
      768: { perPage: 3 },
      480: { perPage: 1 },
    },
  };

  private _data!: FocusCarouselTypes;

  @Input() set data(value: FocusCarouselTypes) {
    this._data = value;
    this.images = this._data.images;
    this.showArrows = this._data.showArrows;
    this.options = {
      ...this.options,
      arrows: this.showArrows,
    };
  }
}
