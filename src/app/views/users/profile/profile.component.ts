import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ItineraryService } from '../../../services/itineraries.service';
import { ItineraryDTO } from '../../../models/itinerary.dto';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserDTO } from '../../../models/user.dto';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.services';
import { HttpErrorResponse } from '@angular/common/http';

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
  private router: Router,
  private sharedService: SharedService
  ) {
    this.userData = new UserDTO('', '', '', '', new Date(), '', '');
  }

 ngOnInit(): void {
    this.loadItineraries();
  }

  private async loadItineraries(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.userService.getUSerById(userId).subscribe({
        next: (user: UserDTO) => {
          this.userData = user;
          console.log('userID recibido:', userId);
          this.itineraryService.getItinerariesByUserId(userId).subscribe({
            next: (itinerarios: ItineraryDTO[]) => {
              this.itineraries = itinerarios;
            },
            error: (error: HttpErrorResponse) => {
              errorResponse = error.error;
              this.sharedService.errorLog(errorResponse);
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
      imageUrl: '../../../../assets/predeterminada-img.webp',
      title: `Itinerario de ${itinerary.duration} días por ${itinerary.destination}`,
      date: itinerary.publicationDate,
      author: itinerary.userAlias || 'Autor desconocido',
      categories: itinerary.categories?.map(cat => cat.title) || 'Sin categoría',
      rating: itinerary.rating
    };
  }

  onEditItinerary(id: string): void {
    this.router.navigate(['/itinerarios/editar', id]);
  }

  onDeleteItinerary(id: string) {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm('Confirm delete post with id: ' + id + ' .');
    if (result) {
      this.itineraryService.deleteItinerary(id).subscribe({
        next: (response: any) => {
          const rowsAffected = response; 
          if (rowsAffected.affected > 0) {
            this.loadItineraries();
          }
        }, 
        error: (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      });
    }
  }
}
