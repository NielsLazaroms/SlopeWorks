import {Component} from '@angular/core';
import {FocusCarousel} from '../../../../components/focus-carousel/focus-carousel';
import {FocusCarouselTypes} from '../../../../components/focus-carousel/focus-carouselTypes';
import {SectionTitleTypes} from '../../../../components/section-title/section-titleTypes';
import {SectionTitle} from '../../../../components/section-title/section-title';

@Component({
  selector: 'app-pictures-section',
  standalone: true,
  imports: [
    SectionTitle,
    FocusCarousel,
  ],
  templateUrl: './pictures-section.html',
})
export class PicturesSectionComponent {
  carouselTitle = {
    text: 'Our pictures',
    size: 'md',
    shadow: false,
    showUnderLine: true,
    underlineColor: 'primary',
    textPosition: 'left',
    textColor: 'dark',
    fontWeight: 'semibold',
    textStroke: 'sm',
  } as SectionTitleTypes;

  carouselData: FocusCarouselTypes = {
    images: [
      {
        id: 1,
        src: 'https://images.photowall.com/products/47782/extreme-skiing.jpg?h=699&q=85',
        alt: 'Image 1',
      },
      {
        id: 2,
        src: 'https://hotel-kaya.com/assets/uploads/2022/06/regles-ski-alpin.jpg',
        alt: 'Image 2',
      },
      {
        id: 3,
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ski_Famille_-_Family_Ski_Holidays.jpg/500px-Ski_Famille_-_Family_Ski_Holidays.jpg',
        alt: 'Image 3',
      },
    ],
    showArrows: true,
  };
}
