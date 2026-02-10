import {Component} from '@angular/core';
import {ParallaxComponent, ParallaxComponentData} from '../../components/parallax-component/parallax-component';
import {MnButtonTypes} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../components/section-title/section-titleTypes';
import {AboutSectionComponent} from './components/about-section/about-section';
import {PackagesSectionComponent} from './components/packages-section/packages-section';
import {PicturesSectionComponent} from './components/pictures-section/pictures-section';
import {ContactSectionComponent} from './components/contact-section/contact-section';
import {FooterComponent} from '../../components/footer/footer';
import {NavbarComponent} from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ParallaxComponent,
    AboutSectionComponent,
    PackagesSectionComponent,
    PicturesSectionComponent,
    ContactSectionComponent,
    FooterComponent,
    NavbarComponent,
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
}
