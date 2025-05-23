import { Component } from '@angular/core';
import { PlacesApiService } from '../../services/places.api.service';

@Component({
  selector: 'app-points-of-interest',
  templateUrl: './points-of-interest.component.html',
  styleUrl: './points-of-interest.component.scss'
})
export class PointsOfInterestComponent {
   query = '';
  results: any;

  constructor(private placesService: PlacesApiService) {}

  search() {
    if (this.query.trim().length === 0) return;
    this.placesService.searchPlace(this.query).subscribe(data => {
      this.results = data.candidates;
    }, err => {
      console.error('Error searching places:', err);
    });
  }
}
