import { Component, OnInit } from '@angular/core';
import { PlacesApiService, PlaceFull } from '../../services/places.api.service';
import { MatDialog } from '@angular/material/dialog';
import { SortDialogComponent, SortOption } from '../../shared/sort-dialog/sort-dialog.component';
import { environment } from '../../../environments/environment';

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
  currentSort: string = 'title-a-z';

  sortOptions: SortOption[] = [
    { value: 'title-a-z', label: 'Título (A-Z)' },
    { value: 'title-z-a', label: 'Título (Z-A)' },
    { value: 'rating-0-5', label: 'Valoración (ascendente)' },
    { value: 'rating-5-0', label: 'Valoración (descendente)' }
  ];

  constructor(
    private placesService: PlacesApiService,
    private dialog: MatDialog
  ) {}

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
      imageUrl: validPhoto ? (isFullUrl ? validPhoto : `${environment.apiUrlDestinarium}/uploads/${validPhoto}`) : fallback,
      title: place.name,
      address: place.address || 'Dirección desconocida',
      categories: place.types || ['Sin categoría'],
      rating: place.rating ?? 'No disponible'
    };
  }

  openSortDialog() {
    const dialogRef = this.dialog.open(SortDialogComponent, {
      data: { 
        currentSort: this.currentSort, 
        options: this.sortOptions 
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.currentSort = result;
        this.applySort();
      }
    });
  }

  applySort() {
    switch (this.currentSort) {
      case 'title-a-z':
        this.places.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'title-z-a':
        this.places.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-0-5':
        this.places.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
        break;
      case 'rating-5-0':
        this.places.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'category':
        // Ordenar por la primera categoría alfabéticamente
        this.places.sort((a, b) => {
          const catA = a.types?.[0] || '';
          const catB = b.types?.[0] || '';
          return catA.localeCompare(catB);
        });
        break;
      default:
        break;
    }
  }

}
