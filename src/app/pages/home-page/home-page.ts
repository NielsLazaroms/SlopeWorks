import {Component} from '@angular/core';
import {ParallaxComponent, ParallaxComponentData} from '../../components/parallax-component/parallax-component';
import {FocusCarousel} from '../../components/focus-carousel/focus-carousel';
import {FocusCarouselTypes} from '../../components/focus-carousel/focus-carouselTypes';
import {MnButtonTypes} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../components/section-title/section-titleTypes';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ParallaxComponent,
    FocusCarousel,

  ],
  templateUrl: './home-page.html',
})
export class HomePage {
  parallaxData: ParallaxComponentData = {
    description: 'Parallax description',
    backgroundImage: {
      url: 'https://4kwallpapers.com/images/walls/thumbs_3t/1025.jpg',
      alt: 'Parallax image',
      id: 1
    },
    button: {
      color: 'primary',
      size: 'md',
      variant: 'fill',
      borderRadius: 'xl',
    } as MnButtonTypes,
    title: {
      text: 'Corporate ski retreats, elevated',
      size: 'md',
      shadow: true,
      showUnderLine: false,
      textPosition: 'left',
      textColor: 'light',
      fontWeight: 'semibold',
      textStroke: 'sm',
    } as SectionTitleTypes,
  } as const;

  carouselData:FocusCarouselTypes  = {
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
