import {Component, AfterViewInit, OnDestroy, inject} from '@angular/core';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import {MnButtonTypes, MnLanguageService, MnSectionDirective, MnTranslatePipe} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../components/section-title/section-titleTypes';
import {AboutSectionComponent} from './components/about-section/about-section';
import {PackagesSectionComponent} from './components/packages-section/packages-section';
import {PicturesSectionComponent} from './components/pictures-section/pictures-section';
import {ContactSectionComponent} from './components/contact-section/contact-section';
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
export class HomePage implements AfterViewInit, OnDestroy {
  private readonly lang = inject(MnLanguageService);

  get currentLocale(): string {
    return this.lang.locale;
  }

  async toggleLocale() {
    const next = this.lang.locale === 'en' ? 'nl' : 'en';
    await this.lang.setLocale(next);
  }

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

  ngAfterViewInit() {
    const sections = ['about-section', 'packages-section', 'pictures-section', 'contact-section'];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    });
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}
