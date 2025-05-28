import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../../services/itineraries.service';
import { ItineraryDTO } from '../../../models/itinerary.dto';
import { SortDialogComponent, SortOption } from '../../../shared/sort-dialog/sort-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  itineraries: ItineraryDTO[] = [];
  filteredItineraries: ItineraryDTO[] = [];
  searchTerm: string = '';
  showEditDeleteButtons: boolean = false;
  currentSort: SortOption = 'destination-a-z';

  constructor(
    private route: ActivatedRoute,
    private itineraryService: ItineraryService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit() {
    this.itineraryService.getItineraries().subscribe((data) => {
      this.itineraries = data;
      
      this.route.queryParams.subscribe(params => {
        this.searchTerm = params['destino'] || '';
        this.filterItineraries();
      });
    });
  }

  filterItineraries(): void {
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredItineraries = this.itineraries.filter(itinerary =>
        itinerary.destination.toLowerCase().includes(term)
      );
    } else {
      this.filteredItineraries = this.itineraries;
    }
  }

  getCardData(itinerary: ItineraryDTO) {
    return {
      link: `/itinerarios/itinerario/${itinerary.itineraryId}`,
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
      width: '400px',
      data: { currentSort: this.currentSort },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result: SortOption | undefined) => {
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
}
