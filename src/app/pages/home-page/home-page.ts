import { Component } from '@angular/core';
import {Navbar} from '../../components/navbar/navbar';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    Navbar
  ],
  templateUrl: './home-page.html',
})
export class HomePage {}
