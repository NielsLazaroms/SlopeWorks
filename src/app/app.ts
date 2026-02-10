import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MnSectionDirective} from 'mn-angular-lib';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MnSectionDirective, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SlopeWorks');
}
