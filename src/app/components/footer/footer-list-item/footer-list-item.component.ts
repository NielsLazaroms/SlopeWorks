import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-footer-list-item',
  standalone: true,
  templateUrl: './footer-list-item.component.html',
})
export class FooterListItemComponent {
  @Input({required: true}) label!: string;
  @Input({required: true}) href!: string;
}
