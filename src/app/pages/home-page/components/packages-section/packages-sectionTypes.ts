import {InjectionToken} from '@angular/core';
import {MnInformationCardData, MnImageType} from 'mn-angular-lib';

type OneImageExtra = { kind: 'one-image'; image: MnImageType };
export type OneImageCard = MnInformationCardData<OneImageExtra>;

export interface PackagesSectionConfig {
  packagesTitleText?: string;
  cards?: OneImageCard[];
}

export const APP_PACKAGES_SECTION_CONFIG = new InjectionToken<PackagesSectionConfig>('APP_PACKAGES_SECTION_CONFIG');
