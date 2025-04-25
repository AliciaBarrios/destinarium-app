import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../../services/itineraries.service';
import { ItineraryDTO } from '../../../models/itinerary.dto';

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

  constructor(
    private route: ActivatedRoute,
    private itineraryService: ItineraryService
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
      this.filteredItineraries = this.itineraries.filter(itin =>
        itin.destination.toLowerCase().includes(term)
      );
    } else {
      this.filteredItineraries = this.itineraries;
    }
  }

  getCardData(itinerary: ItineraryDTO) {
    return {
      link: '/itinerarios/' + itinerary.itineraryId,
      imageUrl: '../../../../assets/predeterminada-img.webp',
      title: `Itinerario de ${itinerary.duration} días por ${itinerary.destination}`,
      date: itinerary.publicationDate,
      author: itinerary.userAlias || 'Autor desconocido',
      categories: itinerary.categories?.map(cat => cat.title) || 'Sin categoría',
      rating: itinerary.rating
    };
  }
}
