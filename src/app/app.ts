import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MnSectionDirective} from 'mn-angular-lib';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MnSectionDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SlopeWorks');
}
