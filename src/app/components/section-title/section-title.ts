import {Component, Input} from '@angular/core';
import {SectionTitleTypes} from './section-titleTypes';
import {sectionTitleVariants} from './section-titleVariants';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './section-title.html',
})
export class SectionTitle {
  @Input() data!: SectionTitleTypes;

  get classes() {
    return sectionTitleVariants({
      size: this.data?.size,
      shadow: this.data?.shadow,
      showUnderLine: this.data?.showUnderLine,
      textPosition: this.data?.textPosition,
      textColor: this.data?.textColor,
      underlineColor: this.data?.underlineColor,
      fontWeight: this.data?.fontWeight,
      textStroke: this.data?.textStroke,
    });
  }
}
