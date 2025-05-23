import { Injectable } from '@angular/core';
import { ItineraryDTO } from '../models/itinerary.dto';
import { DayDTO } from '../models/day.dto';
import { AccommodationDTO } from '../models/accommodation.dto';
import { TransportDTO } from '../models/transport.dto';
import { RestaurantDTO } from '../models/restaurant.dto';

@Injectable({
  providedIn: 'root'
})
export class ItineraryCreationService {
  private partialItinerary: Partial<ItineraryDTO & { days?: any[] }> = {};

  constructor() { 
    const stored = localStorage.getItem('draft_itinerary');
    if (stored) {
      this.partialItinerary = JSON.parse(stored);
    }
  }
  
  setStep1(data: Partial<ItineraryDTO>) {
    this.partialItinerary = { ...this.partialItinerary, ...data };
    this.saveToLocalStorage();
  }

  setStep2Days(days: DayDTO[]): void {
    this.partialItinerary = {
      ...this.partialItinerary,
      days
    };
    this.saveToLocalStorage();
  }

  setStep3Details(data: {
    accommodations?: AccommodationDTO[],
    transports?: TransportDTO[],
    restaurants?: RestaurantDTO[]
  }): void {
    this.partialItinerary = {
      ...this.partialItinerary,
      ...data
    };
    this.saveToLocalStorage();
  }

  getStep1Data(): Partial<ItineraryDTO> {
    const { days, transports, accommodations, restaurants, ...step1 } = this.partialItinerary;
    return step1;
  }

  getStep2Days(): DayDTO[] {
    return this.partialItinerary.days || [];
  }

  getStep3Details(): {
    accommodations?: AccommodationDTO[],
    transports?: TransportDTO[],
    restaurants?: RestaurantDTO[]
  } {
    return {
      accommodations: this.partialItinerary.accommodations,
      transports: this.partialItinerary.transports,
      restaurants: this.partialItinerary.restaurants,
    };
  }

  reset() {
    this.partialItinerary = {};
    localStorage.removeItem('draft_itinerary');
  }

  private saveToLocalStorage() {
    localStorage.setItem('draft_itinerary', JSON.stringify(this.partialItinerary));
  }
}
