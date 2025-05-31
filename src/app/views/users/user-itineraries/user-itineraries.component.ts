import { Component, OnInit } from '@angular/core';
import { ItineraryDTO } from '../../../models/itinerary.dto';
import { ItineraryService } from '../../../services/itineraries.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SharedService } from '../../../services/shared.services';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { FilterDialogComponent, FilterData } from '../../../shared/filter-dialog/filter-dialog.component';
import { SortDialogComponent, SortOption } from '../../../shared/sort-dialog/sort-dialog.component';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-itineraries',
  templateUrl: './user-itineraries.component.html',
  styleUrl: './user-itineraries.component.scss'
})
export class UserItinerariesComponent implements OnInit {
  itineraries: ItineraryDTO[] = [];
  filteredItineraries: ItineraryDTO[] = [];
  filterData: FilterData = {};
  sortOption: string = 'destination-a-z';
  apiUrl: string = environment.apiUrlDestinarium;

  itinerariesSortOptions: SortOption[] = [
    { value: 'destination-a-z', label: 'Destino (A-Z)' },
    { value: 'destination-z-a', label: 'Destino (Z-A)' },
    { value: 'duration-asc', label: 'Duración (ascendente)' },
    { value: 'duration-des', label: 'Duración (descendente)' },
  ];

  constructor(
    private itineraryService: ItineraryService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadItineraries();
  }

  private async loadItineraries(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
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
    }
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
