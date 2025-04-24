import { Component } from '@angular/core';
import { SimpleCard } from '../../models/simple-card.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

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

}
