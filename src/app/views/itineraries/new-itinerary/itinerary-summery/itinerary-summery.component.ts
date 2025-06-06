import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ItineraryDTO } from '../../../../models/itinerary.dto';
import { CategoryDTO } from '../../../../models/category.dto';
import { DayDTO } from '../../../../models/day.dto';
import { AccommodationDTO } from '../../../../models/accommodation.dto';
import { TransportDTO } from '../../../../models/transport.dto';
import { RestaurantDTO } from '../../../../models/restaurant.dto';

import { ItineraryCreationService } from '../../../../services/itinerary-creation.service';
import { ItineraryService } from '../../../../services/itineraries.service';
import { CategoryService } from '../../../../services/category.service';
import { AccommodationService } from '../../../../services/accommodation.service';
import { TransportService } from '../../../../services/transport.service';
import { RestaurantService } from '../../../../services/restaurant.service';
import { DayService } from '../../../../services/day.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { SharedService } from '../../../../services/shared.services';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-itinerary-summery',
  templateUrl: './itinerary-summery.component.html',
  styleUrl: './itinerary-summery.component.scss'
})
export class ItinerarySummeryComponent implements OnInit{
  step1Data!: Partial<ItineraryDTO>;
  step2Days!: DayDTO[];
  step3Details!: {
    accommodations?: AccommodationDTO[],
    transports?: TransportDTO[],
    restaurants?: RestaurantDTO[]
  };

  newItinerary: ItineraryDTO;
  categories: CategoryDTO[] = [];
  isEditMode: boolean = false;
  itineraryId?: string;

  constructor(
    private itineraryCreationService: ItineraryCreationService,
    private itineraryService: ItineraryService,
    private categoryService: CategoryService,
    private dayService: DayService,
    private accommodationService: AccommodationService,
    private transportService: TransportService,
    private restaurantService: RestaurantService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.newItinerary = new ItineraryDTO(
      '', '', new Date(), '', 0, '', new Date(), new Date(), 0, 0, [], ''
    );
  }

  ngOnInit() {
    this.step1Data = this.itineraryCreationService.getStep1Data();
    this.step2Days = this.itineraryCreationService.getStep2Days();
    this.step3Details = this.itineraryCreationService.getStep3Details();

    this.itineraryId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.itineraryId) {
      this.isEditMode = true;
    }
  }

  modifyStep(step: string): void {
    if (this.isEditMode) {
      this.router.navigateByUrl(`/itinerarios/editar/${step}/${this.itineraryId}`);
    } else {
      this.router.navigateByUrl(`/itinerarios/crear-itinerario/${step}`);
    }
  }

  private createItinerary(): Promise<string> {
    return new Promise((resolve, reject) => {
      const userId = this.localStorageService.get('user_id');
      if (!userId) {
        reject('No existe usuario autenticado');
        return;
      }

      this.newItinerary = {
        ...this.step1Data,
        userId: userId,
      } as ItineraryDTO;

      this.itineraryService.createItinerary(this.newItinerary).subscribe({
        next: (createdItinerary: any) => {
          const itineraryId = createdItinerary.itineraryId;
          this.sharedService.setItineraryId(itineraryId);
          resolve(itineraryId);
        },
        error: (error: HttpErrorResponse) => {
          this.sharedService.errorLog(error.error);
          reject(error.error);
        }
      });
    });
  }

  private async createDays(itineraryId: string): Promise<DayDTO[]> {
    return new Promise((resolve, reject) => {
      const daysWithItineraryId = this.step2Days.map(day => ({
        ...day,
        itineraryId: itineraryId
      }));

      this.dayService.newDays(daysWithItineraryId).subscribe({
        next: (createdDays) => {
          resolve(createdDays);
        },
        error: (error: HttpErrorResponse) => {
          this.sharedService.errorLog(error.error);
          reject(error.error);
        }
      });
    });
  }

  deleteDays(itineraryId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.itineraryService.getItineraryById(itineraryId).subscribe({
        next: (itinerary) => {
          const days = itinerary.days;
          if (days && days.length > 0) {
            let pending = days.length;
            days.forEach((day: any) => {
              this.dayService.deleteDay(day.dayId).subscribe({
                next: () => {
                  pending--;
                  if (pending === 0) {
                    resolve();
                  }
                },
                error: (err) => {
                  console.error(`Error al eliminar el día ${day.dayId}`, err);
                  reject(err);
                }
              });
            });
          } else {
            resolve(); 
          }
        },
        error: (error) => {
          console.error('Error al obtener el itinerario:', error);
          reject(error);
        }
      });
    });
  }

  private updateItinerary(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.itineraryId) {
        reject('No existe itineraryId para actualizar');
        return;
      }
      const updatedItinerary: ItineraryDTO = {
        ...this.step1Data,
        userId: this.localStorageService.get('user_id') || ''
      } as ItineraryDTO;

      this.itineraryService.updateItinerary(this.itineraryId, updatedItinerary).subscribe({
        next: (resp) => {
          resolve(this.itineraryId!);
        },
        error: (error: HttpErrorResponse) => {
          this.sharedService.errorLog(error.error);
          reject(error.error);
        }
      });
    });
  }

  private async linkAccommodations(itineraryId: string): Promise<void> {
    const accommodationIds = this.step3Details.accommodations?.map(accommodation => accommodation.accommodationId) ?? [];
    if (accommodationIds.length === 0) return Promise.resolve();
    return this.accommodationService.linkAccommodationsToItinerary(itineraryId, accommodationIds).toPromise().then(() => {});
  }

  private async linkRestaurants(itineraryId: string): Promise<void> {
    const restaurantIds = this.step3Details.restaurants?.map(restaurant => restaurant.restaurantId) ?? [];
    if (restaurantIds.length === 0) return Promise.resolve();
    return this.restaurantService.linkRestaurantsToItinerary(itineraryId, restaurantIds).toPromise().then(() => {});
  }

  private async linkTransports(itineraryId: string): Promise<void> {
    const transportIds = this.step3Details.transports?.map(transport => transport.transportId) ?? [];
    if (transportIds.length === 0) return Promise.resolve();
    return this.transportService.linkTransportsToItinerary(itineraryId, transportIds).toPromise().then(() => {});
  }

  async onSubmitItinerary(): Promise<void> {
    let responseOK = false;
    let errorResponse: any;

    try {
      if (this.isEditMode && this.itineraryId) {
        await this.deleteDays(this.itineraryId);
      }

      const itineraryId = await (this.isEditMode
        ? this.updateItinerary()
        : this.createItinerary());

      await Promise.all([
        this.createDays(itineraryId),
        this.linkAccommodations(itineraryId),
        this.linkRestaurants(itineraryId),
        this.linkTransports(itineraryId),
      ]);

      responseOK = true;

    } catch (error: any) {
      responseOK = false;
      errorResponse = error;
      this.sharedService.errorLog(error);
      console.error('Error al crear el itinerario:', error);
    } finally {
      await this.sharedService.managementToast('toast', responseOK, errorResponse);
      if (responseOK) {
        this.itineraryCreationService.reset();
        this.router.navigate(['/usuario/mis-itinerarios']);
      }
    }
  }

  getCoordenadasByName(nombre: string): Promise<{ lat: number, lng: number }> {
  const encodedName = encodeURIComponent(nombre);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedName}`;

  return fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      } else {
        throw new Error('No se encontraron coordenadas');
      }
    });
  }

}
