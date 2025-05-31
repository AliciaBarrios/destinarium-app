import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SimpleCard } from '../../models/simple-card.interface';
import { ItineraryDTO } from '../../models/itinerary.dto';
import { ItineraryService } from '../../services/itineraries.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  topItineraries: ItineraryDTO[] = [];
  
  simpleCards: SimpleCard[] = [
    {
      imageUrl: '../../../assets/itinerarios-img.jpg',
      link: '/itinerarios/crear-itinerario',
      title: 'Crear un itinerario'
    },
    {
      imageUrl: '../../../assets/destinos-img.jpg',
      link: '/itinerarios',
      title: 'Visitar un destino'
    },
    {
      imageUrl: '../../../assets/interes-img.webp',
      link: '/puntos-interes',
      title: 'Ver puntos de interés'
    }
  ];

  constructor(private itineraryService: ItineraryService) {}

  ngOnInit(): void {
    this.itineraryService.getItineraries().subscribe({
      next: (itineraries: ItineraryDTO[]) => {
        this.topItineraries = itineraries.filter(itinerary => itinerary.rating >= 4.5);
      },
      error: (err) => {
        console.error('Error al cargar los itinerarios:', err);
      }
    });
  }

  getImageUrl(itinerary: ItineraryDTO): string {
    if (itinerary.coverImage) {
      return `${environment.apiUrlDestinarium}/uploads/${itinerary.coverImage}`;
    }
    return 'assets/predeterminada-img.webp';
  }

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  scrollCarousel(direction: 'left' | 'right') {
    const container = this.carousel.nativeElement;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
}
