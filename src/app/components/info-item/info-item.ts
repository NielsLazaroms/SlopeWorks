import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-info-item',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './info-item.html',
})
export class InfoItem {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() bgColor = 'bg-brand-500';
}

