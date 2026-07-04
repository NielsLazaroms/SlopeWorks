import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-nav-list-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './nav-list-item.component.html',
})
export class NavListItemComponent {
  /** Visible link label. */
  @Input({required: true}) label!: string;
  /** Whether this entry points at the current route (shown in brand yellow). */
  @Input() active = false;
  /** Emitted when the entry is clicked. */
  @Output() itemClick = new EventEmitter<void>();
}
