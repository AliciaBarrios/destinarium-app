import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../../services/itineraries.service';
import { ItineraryDTO } from '../../../models/itinerary.dto';
import { SortDialogComponent, SortOption } from '../../../shared/sort-dialog/sort-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent, FilterData } from '../../../shared/filter-dialog/filter-dialog.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  itineraries: ItineraryDTO[] = [];
  filteredItineraries: ItineraryDTO[] = [];
  filterData: FilterData = {};
  searchTerm: string = '';
  showEditDeleteButtons: boolean = false;
  currentSort: string = 'destination-a-z';

  itinerariesSortOptions: SortOption[] = [
    { value: 'category', label: 'Categoría' },
    { value: 'destination-a-z', label: 'Destino (A-Z)' },
    { value: 'destination-z-a', label: 'Destino (Z-A)' },
    { value: 'rating-0-5', label: 'Valoración (0-5)' },
    { value: 'rating-5-0', label: 'Valoración (5-0)' },
    { value: 'duration-asc', label: 'Duración (ascendente)' },
    { value: 'duration-des', label: 'Duración (descendente)' },
  ];

  constructor(
    private route: ActivatedRoute,
    private itineraryService: ItineraryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    combineLatest([
      this.itineraryService.getItineraries(),
      this.route.queryParams
    ]).subscribe(([data, params]) => {
      console.log(data, params);
      this.itineraries = data;
      this.searchTerm = params['destino'] || '';
      this.filterData.destination = this.searchTerm;
      this.applyFilters();
    });
  }

  filterItineraries(): void {
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredItineraries = this.itineraries.filter(itinerary =>
        itinerary.destination.toLowerCase().includes(term)
      );
    } else {
      this.filteredItineraries = [...this.itineraries];
    }
    this.applySort();
  }

  getCardData(itinerary: ItineraryDTO) {
    return {
      link: `/itinerarios/resultados/${itinerary.itineraryId}`,
      imageUrl: itinerary.coverImage ? `http://localhost:3000/uploads/${itinerary.coverImage}` : 'assets/predeterminada-img.webp',
      title: `Itinerario de ${itinerary.duration} días por ${itinerary.destination}`,
      date: itinerary.publicationDate,
      author: itinerary.userAlias || 'Autor desconocido',
      categories: itinerary.categories?.map(cat => cat.title) || 'Sin categoría',
      rating: itinerary.rating
    };
  }

  get resultsCount(): number {
    return this.filteredItineraries.length;
  }

  openSortDialog() {
    const dialogRef = this.dialog.open(SortDialogComponent, {
      width: '350px',
      data: {
        currentSort: this.currentSort,
        options: this.itinerariesSortOptions
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentSort = result;
        this.applySort();
      }
    });
  } 

  applySort() {
    switch (this.currentSort) {
      case 'category':
        this.filteredItineraries.sort((a, b) =>
          (a.categories[0]?.title || '').localeCompare(b.categories[0]?.title || '')
        );
        break;
      case 'destination-a-z':
        this.filteredItineraries.sort((a, b) =>
          a.destination.localeCompare(b.destination)
        );
        break;
      case 'destination-z-a':
        this.filteredItineraries.sort((a, b) =>
          b.destination.localeCompare(a.destination)
        );
        break;
      case 'rating-5-0':
        this.filteredItineraries.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-0-5':
        this.filteredItineraries.sort((a, b) => a.rating - b.rating);
        break;
      case 'duration-asc':
        this.filteredItineraries.sort((a, b) => a.duration - b.duration);
        break;
      case 'duration-des':
        this.filteredItineraries.sort((a, b) => b.duration - a.duration);
        break;
    }
  }

  openFilterDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '500px',
      data: { ...this.filterData }
    });

    dialogRef.afterClosed().subscribe((filters: FilterData | null) => {
      if (filters) {
        this.filterData = filters;
        this.searchTerm = this.filterData.destination || '';
        this.applyFilters();
      } else {
        this.filterData = {};
        this.searchTerm = ''; 
        this.filteredItineraries = [...this.itineraries];
        this.applySort();
      }
    });
  }

  applyFilters() {
    this.filteredItineraries = this.itineraries.filter(itinerary => {
      const matchesDestination = !this.filterData.destination || itinerary.destination.toLowerCase().includes(this.filterData.destination.toLowerCase());

      const matchesRating =
        (!this.filterData.minRating || itinerary.rating >= this.filterData.minRating) &&
        (!this.filterData.maxRating || itinerary.rating <= this.filterData.maxRating);

      const matchesDuration =
        (!this.filterData.minDuration || itinerary.duration >= this.filterData.minDuration) &&
        (!this.filterData.maxDuration || itinerary.duration <= this.filterData.maxDuration);

      const matchesCategory =
        !this.filterData.selectedCategories?.length ||
        itinerary.categories?.some(cat => this.filterData?.selectedCategories?.includes(cat.title));

      return matchesDestination && matchesRating && matchesDuration && matchesCategory;
    });
    this.applySort();
  }

  get resultsTitle(): string {
    const hasSearch = this.searchTerm.trim().length > 0;
    const hasFilters = Object.keys(this.filterData).some(key => {
      const val = this.filterData[key as keyof typeof this.filterData];
      if (Array.isArray(val)) {
        return val.length > 0;
      }
      return val !== null && val !== undefined && val !== '';
    });

    if (this.resultsCount === 0) {
      return 'No se han encontrado itinerarios con esos criterios';
    }

    if (hasSearch) {
      return `Resultados para "${this.searchTerm}"`;
    }

    if (hasFilters) {
      return 'Itinerarios filtrados';
    }

    return 'Todos los itinerarios';
  }
}
