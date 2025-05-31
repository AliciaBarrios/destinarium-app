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
  private draftKey: string = 'draft_itinerary_new';

  constructor() {}
  setDraftMode(mode: 'new' | 'edit', itineraryId?: string) {
    if (mode === 'new') {
      this.draftKey = 'draft_itinerary_new';
    } else if (mode === 'edit' && itineraryId) {
      this.draftKey = `draft_itinerary_edit_${itineraryId}`;
    } else {
      throw new Error('ItineraryCreationService: Missing itinerary ID for edit mode');
    }

    // 👇 Carga el draft que toque según el modo
    const stored = localStorage.getItem(this.draftKey);
    if (stored) {
      this.partialItinerary = JSON.parse(stored);
    } else {
      this.partialItinerary = {};
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
    localStorage.removeItem(this.draftKey);
  }

  loadExistingItinerary(itinerary: ItineraryDTO & { days?: DayDTO[] }): void {
    this.partialItinerary = itinerary;
    this.saveToLocalStorage();
  }

  getExistingItinerary() {
    return this.partialItinerary; 
  }

  saveToLocalStorage() {
    localStorage.setItem(this.draftKey, JSON.stringify(this.partialItinerary));
  }
}
