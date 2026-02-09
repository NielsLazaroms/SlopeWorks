import {Component, Input} from '@angular/core';
import {MnButton, MnButtonTypes} from 'mn-angular-lib';
import {NgStyle} from '@angular/common';
import {SectionTitleTypes} from '../section-title/section-titleTypes';
import {SectionTitle} from '../section-title/section-title';

// TODO  Import from library
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

@Component({
  selector: 'app-parallax-component',
  standalone: true,
  imports: [
    MnButton,
    NgStyle,
    SectionTitle
  ],
  templateUrl: './parallax-component.html',
})
export class ParallaxComponent {
  @Input({ required: true }) data!: ParallaxComponentData;
}
