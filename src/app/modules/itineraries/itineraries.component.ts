import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrl: './itineraries.component.scss'
})
export class ItinerariesComponent implements OnInit {
  searchTerm = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit() {}

  search() {
    this.router.navigate(['/itinerarios/resultados'], {
      queryParams: { destino: this.searchTerm }
    });
  }

  goTo(path: 'resultados') {
    this.router.navigate([`/itinerarios/${path}`]);
  }
}
