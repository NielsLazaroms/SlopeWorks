import {Component, Input} from '@angular/core';
import {MnButton, MnButtonTypes} from 'mn-angular-lib';
import {NgStyle} from '@angular/common';

export interface imageType {
  url: string;
  alt: string;
  id: number
}

export interface ParallaxComponentData {
  description: string;
  backgroundImage: imageType;
  button: MnButtonTypes
}

@Component({
  selector: 'app-parallax-component',
  standalone: true,
  imports: [
    MnButton,
    NgStyle
  ],
  templateUrl: './parallax-component.html',
})
export class ParallaxComponent {
  @Input({ required: true }) data!: ParallaxComponentData;
}
