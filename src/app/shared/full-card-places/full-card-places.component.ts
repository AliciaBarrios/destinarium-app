import { Component, Input } from '@angular/core';
import { FullCardPlaces } from '../../models/full-card-places.interface';

@Component({
  selector: 'app-full-card-places',
  templateUrl: './full-card-places.component.html',
  styleUrl: './full-card-places.component.scss'
})
export class FullCardPlacesComponent {
  fallbackImage: string = '../../../assets/predeterminada-img.webp';
  
  @Input() card: FullCardPlaces = {
    imageUrl: '',
    link: '',
    title: '',
    address: '',
    categories: [],
    rating: 0
  };

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }
}
