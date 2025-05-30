import { Component, OnInit } from '@angular/core';
import { ItineraryDTO } from '../../../models/itinerary.dto';
import { ItineraryService } from '../../../services/itineraries.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SharedService } from '../../../services/shared.services';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-itineraries',
  templateUrl: './user-itineraries.component.html',
  styleUrl: './user-itineraries.component.scss'
})
export class UserItinerariesComponent implements OnInit {
  itineraries: ItineraryDTO[] = [];

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
        },
        error: (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      });
    }
  }

  onEditItinerary(id: string): void {
    this.router.navigate(['/itinerarios/editar', id]);
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
}
