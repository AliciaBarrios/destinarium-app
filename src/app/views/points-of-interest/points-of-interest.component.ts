import { Component, OnInit } from '@angular/core';
import { PlacesApiService, PlaceFull } from '../../services/places.api.service';

@Component({
  selector: 'app-points-of-interest',
  templateUrl: './points-of-interest.component.html',
  styleUrl: './points-of-interest.component.scss'
})
export class PointsOfInterestComponent implements OnInit {
  query = '';
  loading = false;
  error = '';
  places: PlaceFull[] = [];

  constructor(private placesService: PlacesApiService) {}

  ngOnInit(): void {
      this.loadDefaultPlaces();
  }

  loadDefaultPlaces() {
    this.loading = true;
    this.error = '';
    this.placesService.searchPlaces('restaurantes Barcelona').subscribe({
      next: (data) => {
        this.places = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar lugares predeterminados.';
        console.error(err);
      }
    });
  }
  search() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.error = '';
    this.places = []; 

    this.placesService.searchPlaces(this.query).subscribe({
      next: (data) => {
        this.places = data; 
        this.loading = false;
        if (!data || data.length === 0) {
          this.error = 'No se encontró ningún lugar con esa búsqueda.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al buscar el lugar.';
        console.error(err);
      }
    });
  }

  getCardData(place: any) {
  const fallback = '../../../assets/predeterminada-img.webp';
  const validPhoto = place.photos?.find((photo: string) => !!photo);
  const isFullUrl = validPhoto?.startsWith('http');
    return {
      link: `/puntos-interes/punto-interes/${place.place_id}`,
      imageUrl: validPhoto ? (isFullUrl ? validPhoto : `http://localhost:3000/uploads/${validPhoto}`) : fallback,
      title: place.name,
      address: place.address || 'Dirección desconocida',
      categories: place.types || ['Sin categoría'],
      rating: place.rating ?? 'No disponible'
    };
  }
}
