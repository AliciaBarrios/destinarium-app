import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ItineraryService } from '../../services/itineraries.service';
import { PlacesApiService, Destination } from '../../services/places.api.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrl: './itineraries.component.scss',
})
export class ItinerariesComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
  map!: google.maps.Map;
  searchTerm = '';
  destinations: Destination[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private itineraryService: ItineraryService,
    private placesApi: PlacesApiService
  ) {}

  ngOnInit(): void {}

  search() {
    this.router.navigate(['/itinerarios/resultados'], {
      queryParams: { destino: this.searchTerm },
    });
  }

  loadDestinations(): void {
    this.itineraryService.getItineraries().subscribe(itinerarios => {
      const destinosUnicos = [...new Set(itinerarios.map((itinerary: any) => itinerary.destination))];

      const coordRequests = destinosUnicos.map(name =>
        this.placesApi.getCoordinates(name, this.map).pipe(
          map(coords => ({
            name: name,
            lat: coords.lat,
            lng: coords.lng
          }))
        )
      );

      forkJoin(coordRequests).subscribe({
        next: (destinos: Destination[]) => {
          this.destinations = destinos;
          this.addMarkersToMap();
        },
        error: err => {
          console.error('Error al obtener coordenadas:', err);
        }
      });
    });
  }

  addMarkersToMap(): void {
    if (!this.map) return;
    this.destinations.forEach(destino => {
      const marker = new google.maps.Marker({
        position: { lat: destino.lat, lng: destino.lng },
        map: this.map,
        title: destino.name,
      });

      marker.addListener('click', () => {
        this.onDestinationClick(destino.name);
      });
    });
  }

  onDestinationClick(destino: string) {
    this.router.navigate(['/itinerarios/resultados'], { queryParams: { destino } });
  }
  ngAfterViewInit(): void {
    const options: google.maps.MapOptions = {
      center: { lat: 0, lng: 0 }, // centro del mundo
      zoom: 2,
      disableDefaultUI: false,
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, options);

    this.loadDestinations(); 

    // (Opcional) Buscar lugares con Places API
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Buscar lugar...';
    input.style.position = 'absolute';
    input.style.top = '10px';
    input.style.left = '10px';
    input.style.zIndex = '5';

    this.gmap.nativeElement.parentElement.appendChild(input);

    const searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(8);

          new google.maps.Marker({
            map: this.map,
            position: place.geometry.location,
          });
        }
      }
    });
  }
}
