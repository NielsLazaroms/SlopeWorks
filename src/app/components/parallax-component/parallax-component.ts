import {Component, Input} from '@angular/core';
import {MnButton} from 'mn-angular-lib';
import {NgStyle} from '@angular/common';
import {SectionTitle} from '../section-title/section-title';
import {ParallaxComponentData} from './parallax-componentTypes';



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
