import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ItineraryService } from '../../../services/itineraries.service';
import { ItineraryDTO } from '../../../models/itinerary.dto';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserDTO } from '../../../models/user.dto';
import { CategoryDTO } from '../../../models/category.dto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userData: UserDTO;
  itineraries: ItineraryDTO[] = [];

  constructor(
  private userService: UserService,
  private itineraryService: ItineraryService,
  private localStorageService: LocalStorageService,
  ) {
    this.userData = new UserDTO('', '', '', '', new Date(), '', '');
  }

 ngOnInit(): void {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.userService.getUSerById(userId).subscribe({
        next: (user: UserDTO) => {
          this.userData = user;
          console.log('userID recibido:', userId);
          this.itineraryService.getItinerariesByUserId(userId).subscribe({
            next: (itinerarios) => {
              console.log('Itinerarios recibidos:', itinerarios);
              this.itineraries = itinerarios;
            },
            error: (err) => {
              console.error('Error al obtener los itinerarios del usuario', err);
            }
          });
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario', err);
        }
      });
    }
  }

  get itineraryCount(): number {
    return this.itineraries.length;
  }

  getCardData(itinerary: ItineraryDTO) {
    return {
      link: '/itinerarios/' + itinerary.itineraryId,
      imageUrl: itinerary.coverImage,
      title: `Itinerario de ${itinerary.duration} por ${itinerary.destination}`,
      date: itinerary.publicationDate,
      author: itinerary.userAlias || 'Autor desconocido',
      categories: itinerary.categories?.map(cat => cat.title) || 'Sin categoría',
      rating: itinerary.rating
    };
  }
}
