import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ItineraryService } from '../../../services/itineraries.service';
import { ItineraryDTO } from '../../../models/itinerary.dto';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserDTO } from '../../../models/user.dto';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.services';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { FilterDialogComponent, FilterData } from '../../../shared/filter-dialog/filter-dialog.component';
import { SortDialogComponent, SortOption } from '../../../shared/sort-dialog/sort-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userData: UserDTO;
  itineraries: ItineraryDTO[] = [];
  filteredItineraries: ItineraryDTO[] = [];
  filterData: FilterData = {};
  sortOption: string = 'destination-a-z';

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
  private userService: UserService,
  private itineraryService: ItineraryService,
  private localStorageService: LocalStorageService,
  private router: Router,
  private sharedService: SharedService,
  private dialog: MatDialog
  ) {
    this.userData = new UserDTO('', '', '', '', new Date(), '', '', 0, 0);
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
          this.userData.followed = 0;
          this.userData.followers = 0;
          this.itineraryService.getItinerariesByUserId(userId).subscribe({
            next: (itinerarios: ItineraryDTO[]) => {
              this.itineraries = itinerarios;
              this.filteredItineraries = [...itinerarios];
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
      link: `/usuario/perfil/${itinerary.itineraryId}`,
      imageUrl: itinerary.coverImage ? `http://localhost:3000/uploads/${itinerary.coverImage}` : 'assets/predeterminada-img.webp',
      title: itinerary.title,
      date: itinerary.publicationDate,
      author: this.userData.alias || 'Autor desconocido',
      categories: itinerary.categories?.map(cat => cat.title) || 'Sin categoría',
      rating: itinerary.rating
    };
  }

  onEditItinerary(id: string): void {
    this.router.navigate(['/itinerarios/editar/paso-1', id]);
  }

  onDeleteItinerary(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Estás segura de que quieres eliminar este itinerario?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itineraryService.deleteItinerary(id).subscribe({
          next: (response: any) => {
            const rowsAffected = response;
            if (rowsAffected.affected > 0) {
              this.loadItineraries();
            }
          },
          error: (error: HttpErrorResponse) => {
            this.sharedService.errorLog(error.error);
          }
        });
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

  applySort() {
    switch (this.sortOption) {
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

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '500px',
      data: { ...this.filterData }
    });

    dialogRef.afterClosed().subscribe((result: FilterData | null) => {
      if (result) {
        this.filterData = result;
        this.applyFilters();
      } else {
        this.filterData = {};
        this.filteredItineraries = [...this.itineraries];
        this.applySort();
      }
    });
  }
  openSortDialog() {
    const dialogRef = this.dialog.open(SortDialogComponent, {
      width: '350px',
      data: {
        currentSort: this.sortOption,
        options: this.itinerariesSortOptions
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sortOption = result;
        this.applySort();
      }
    });
  } 
}
