import {Component} from '@angular/core';
import {FooterListItemComponent} from './footer-list-item/footer-list-item.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FooterListItemComponent],
  templateUrl: './footer.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
