// TODO  Import from library
import {SectionTitleTypes} from '../section-title/section-titleTypes';
import {MnButtonTypes} from 'mn-angular-lib';

export interface imageType {
  url: string;
  alt: string;
  id: number
}

export interface ParallaxComponentData {
  title: SectionTitleTypes;
  description: string;
  backgroundImage: imageType;
  button: MnButtonTypes
}
