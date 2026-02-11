import {Component, inject} from '@angular/core';
import {
  MnInformationCard,
  MnInstanceDirective,
} from 'mn-angular-lib';
import {SectionTitleTypes} from '../../../../components/section-title/section-titleTypes';
import {SectionTitle} from '../../../../components/section-title/section-title';
import {provideMnComponentConfig} from 'mn-angular-lib';
import {APP_PACKAGES_SECTION_CONFIG, PackagesSectionConfig} from './packages-sectionTypes';


@Component({
  selector: 'app-packages-section',
  standalone: true,
  imports: [
    SectionTitle,
    MnInformationCard,
    MnInstanceDirective,
  ],
  templateUrl: './packages-section.html',
  providers: [
    provideMnComponentConfig<PackagesSectionConfig>(APP_PACKAGES_SECTION_CONFIG, 'app-packages-section'),
  ],
})
export class PackagesSectionComponent {
  protected readonly componentConfig = inject(APP_PACKAGES_SECTION_CONFIG);

  packagesTitle = {
    text: this.componentConfig.packagesTitleText ?? 'Our packages',
    size: 'md',
    shadow: false,
    showUnderLine: true,
    underlineColor: 'primary',
    textPosition: 'left',
    textColor: 'dark',
    fontWeight: 'semibold',
    textStroke: 'sm',
  } as SectionTitleTypes;
}
