import {Component} from '@angular/core';
import {ParallaxComponent} from '../../components/parallax-component/parallax-component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ParallaxComponent
  ],
  templateUrl: './home-page.html',
})
export class HomePage {
  parallaxData = {
    description: 'Parallax description',
    backgroundImage: {
      url: 'https://4kwallpapers.com/images/walls/thumbs_3t/1025.jpg',
      alt: 'Parallax image',
      id: 1
    },
    button: {
      color: 'primary',
      size: 'sm',
      variant: 'fill',
      borderRadius: 'three_xl',
    },
  } as const;

}
