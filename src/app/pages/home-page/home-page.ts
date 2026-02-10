import {Component} from '@angular/core';
import {ParallaxComponent, ParallaxComponentData} from '../../components/parallax-component/parallax-component';
import {FocusCarousel} from '../../components/focus-carousel/focus-carousel';
import {FocusCarouselTypes} from '../../components/focus-carousel/focus-carouselTypes';
import {MnButtonTypes, MnImageType, MnInformationCard, MnInformationCardData} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../components/section-title/section-titleTypes';
import {SectionTitle} from '../../components/section-title/section-title';

type OneImageExtra = { kind: 'one-image'; image: MnImageType };
type OneImageCard = MnInformationCardData<OneImageExtra>;


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ParallaxComponent,
    FocusCarousel,
    SectionTitle,
    MnInformationCard,

  ],
  templateUrl: './home-page.html',
})
export class HomePage {
  parallaxData: ParallaxComponentData = {
    description: 'Parallax  description description description description description description description description description description description description',
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
      fullWidth: false,
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

  packagesTitle = {
    text: 'Our packages',
    size: 'md',
    shadow: false,
    showUnderLine: true,
    underlineColor: 'primary',
    textPosition: 'left',
    textColor: 'dark',
    fontWeight: 'semibold',
    textStroke: 'sm',
  } as SectionTitleTypes;

  cards: MnInformationCardData<OneImageCard>[] = [
    {
      title: 'Card 1',
      id: 1,
      description: 'This is card 1.',
      bottomBorder: true,
      shadow: true,
      kind: 'one-image',
      image: {
        id: 1,
        url: 'https://logo-icons.com/cdn/shop/files/2081-logo-1713630973.369.svg?v=1713641356',
        alt: 'test-image',
      },
      textPosition: 'center',
    },
    {
      id: 2,
      title: 'Card 2',
      description: 'This is card 2.',
      kind: 'one-image',
      bottomBorder: true,
      shadow: true,
      image: {
        id: 2,
        url: 'https://logo-icons.com/cdn/shop/files/2081-logo-1713630973.369.svg?v=1713641356',
        alt: 'test-image',
      },
    },
    {
      id: 3,
      title: 'Card 2',
      description: 'This is card 3.',
      kind: 'one-image',
      bottomBorder: true,
      shadow: true,
      image: {
        id: 3,
        url: 'https://logo-icons.com/cdn/shop/files/2081-logo-1713630973.369.svg?v=1713641356',
        alt: 'test-image',
      },
    }
  ];
}
