import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ItineraryDTO } from '../../../../models/itinerary.dto';
import { DayDTO } from '../../../../models/day.dto';
import { AccommodationDTO } from '../../../../models/accommodation.dto';
import { TransportDTO } from '../../../../models/transport.dto';
import { RestaurantDTO } from '../../../../models/restaurant.dto';

import { ItineraryCreationService } from '../../../../services/itinerary-creation.service';
import { ItineraryService } from '../../../../services/itineraries.service';
import { AccommodationService } from '../../../../services/accommodation.service';
import { DayService } from '../../../../services/day.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { SharedService } from '../../../../services/shared.services';

import { finalize } from 'rxjs';

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

  constructor(
    private itineraryCreationService: ItineraryCreationService,
    private itineraryService: ItineraryService,
    private dayService: DayService,
    private accommodationService: AccommodationService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
  ) {
    this.newItinerary = new ItineraryDTO(
      '', '', new Date(), '', 0, '', new Date(), new Date(), 0, 0, [], ''
    );
  }

  ngOnInit() {
    this.step1Data = this.itineraryCreationService.getStep1Data();
    this.step2Days = this.itineraryCreationService.getStep2Days();
    this.step3Details = this.itineraryCreationService.getStep3Details();
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

  private async linkAccommodations(itineraryId: string): Promise<void> {
    const accommodationIds = this.step3Details.accommodations?.map(accommodation => accommodation.accommodationId) ?? [];
    if (accommodationIds.length === 0) return Promise.resolve();
    return this.accommodationService.linkAccommodationsToItinerary(itineraryId, accommodationIds).toPromise().then(() => {});
  }

  // private linkRestaurants(itineraryId: string): Promise<void> {
  //   const restaurantIds = this.step3Details.restaurants?.map(restaurant => restaurant.restaurantId) ?? [];
  //   if (restaurantIds.length === 0) return Promise.resolve();
  //   return this.restaurantService.linkRestaurantsToItinerary(itineraryId, restaurantIds).toPromise().then(() => {});
  // }

  // private linkTransports(itineraryId: string): Promise<void> {
  //   const transportIds = this.step3Details.transports?.map(transport => transport.transportId) ?? [];
  //   if (transportIds.length === 0) return Promise.resolve();
  //   return this.transportService.linkTransportsToItinerary(itineraryId, transportIds).toPromise().then(() => {});
  // }

onSubmitItinerary(): void {
  let responseOK = false;
  let errorResponse: any;

  this.createItinerary()
    .then((itineraryId: string) => {
      return Promise.all([
        this.createDays(itineraryId),
        this.linkAccommodations(itineraryId),
        // this.linkRestaurants(itineraryId),
        // this.linkTransports(itineraryId),
      ]);
    })
    .then(() => {
      responseOK = true;
      console.log('Itinerario y detalles creados con éxito');
      // Aquí puedes redirigir o mostrar un mensaje al usuario
    })
    .catch((error) => {
      responseOK = false;
      errorResponse = error;
      this.sharedService.errorLog(error);
      console.error('Error al crear el itinerario:', error);
    })
    .finally(async () => {
      await this.sharedService.managementToast('summeryFeedback', responseOK, errorResponse);
        if (responseOK) {
        this.itineraryCreationService.reset();
      }
    });
  }
}
