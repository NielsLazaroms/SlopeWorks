import {Component, inject, InjectionToken, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {provideMnComponentConfig} from 'mn-angular-lib';

export interface InfoItemConfig {
  title?: string;
  description?: string;
}

export const APP_INFO_ITEM_CONFIG = new InjectionToken<InfoItemConfig>('APP_INFO_ITEM_CONFIG');

@Component({
  selector: 'app-info-item',
  standalone: true,
  imports: [
    NgClass
  ],
  providers: [
    provideMnComponentConfig<InfoItemConfig>(APP_INFO_ITEM_CONFIG, 'app-info-item'),
  ],
  templateUrl: './info-item.html',
})
export class InfoItem {
  protected readonly componentConfig = inject(APP_INFO_ITEM_CONFIG);
  @Input() bgColor = 'bg-brand-500';
}

