import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-nav-list-item',
  standalone: true,
  templateUrl: './nav-list-item.component.html',
})
export class NavListItemComponent {
  @Input({required: true}) label!: string;
  @Output() itemClick = new EventEmitter<void>();
}
