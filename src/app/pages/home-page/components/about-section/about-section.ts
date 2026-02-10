import {Component} from '@angular/core';
import {
  MnButton,
  MnButtonTypes,
  MnDualHorizontalImage,
  MnDualHorizontalImageTypes,
} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../../../components/section-title/section-titleTypes';
import {SectionTitle} from '../../../../components/section-title/section-title';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [
    SectionTitle,
    MnDualHorizontalImage,
    MnButton,
  ],
  templateUrl: './about-section.html',
})
export class AboutSectionComponent {
  aboutUsTitle = {
    text: 'About us',
    size: 'md',
    shadow: false,
    showUnderLine: true,
    underlineColor: 'primary',
    textPosition: 'left',
    textColor: 'dark',
    fontWeight: 'semibold',
    textStroke: 'sm',
  } as SectionTitleTypes;

  aboutUsButton = {
    color: 'primary',
    size: 'md',
    variant: 'fill',
    borderRadius: 'xl',
    fullWidth: false,
  } as MnButtonTypes;

  aboutUsImages: MnDualHorizontalImageTypes[] = [
    { id: '1', url: 'https://www.wildkogel-arena.at/site/assets/files/17949/wildkogelarena_2024-7237.1920x0-sp.jpg', alt: 'Image 1' },
    { id: '2', url: 'https://6hsport15.wordpress.com/wp-content/uploads/2016/01/skic3abn.jpg?w=617&h=411', alt: 'Image 2' },
  ];
}
