import {Component} from '@angular/core';
import {MnButtonTypes, MnSectionDirective} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../components/section-title/section-titleTypes';
import {AboutSectionComponent} from './components/about-section/about-section';
import {PackagesSectionComponent} from './components/packages-section/packages-section';
import {PicturesSectionComponent} from './components/pictures-section/pictures-section';
import {ContactSectionComponent} from './components/contact-section/contact-section';
import {FooterComponent} from '../../components/footer/footer';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {ParallaxComponent, ParallaxComponentData} from '../../components/parallax-component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ParallaxComponent,
    AboutSectionComponent,
    PackagesSectionComponent,
    PicturesSectionComponent,
    ContactSectionComponent,
    MnSectionDirective,
  ],
  templateUrl: './home-page.html',
})
export class HomePage {
  parallaxData: ParallaxComponentData = {
    button: {
      color: 'primary',
      size: 'md',
      variant: 'fill',
      borderRadius: 'xl',
      fullWidth: false,
    } as MnButtonTypes,
    title: {
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
