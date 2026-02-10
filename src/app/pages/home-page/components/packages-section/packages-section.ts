import {Component} from '@angular/core';
import {
  MnImageType,
  MnInformationCard,
  MnInformationCardData,
} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../../../components/section-title/section-titleTypes';
import {SectionTitle} from '../../../../components/section-title/section-title';

type OneImageExtra = { kind: 'one-image'; image: MnImageType };
type OneImageCard = MnInformationCardData<OneImageExtra>;

@Component({
  selector: 'app-packages-section',
  standalone: true,
  imports: [
    SectionTitle,
    MnInformationCard,
  ],
  templateUrl: './packages-section.html',
})
export class PackagesSectionComponent {
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
      borderRadius:'md',
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
      borderRadius:'md',
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
      borderRadius:'md',
      shadow: true,
      image: {
        id: 3,
        url: 'https://logo-icons.com/cdn/shop/files/2081-logo-1713630973.369.svg?v=1713641356',
        alt: 'test-image',
      },
    }
  ];
}
