import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccommodationDTO } from '../models/accommodation.dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccommodationService {
  private apiUrl: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'accommodations';
    this.apiUrl = environment.apiUrlDestinarium + '/' + this.controller;
  }

  getAccommodations(): Observable<AccommodationDTO[]>  {
    return this.http.get<AccommodationDTO[]>(this.apiUrl);
  }

  getAccommodationByName(name: string): Observable<AccommodationDTO[]> {
    return this.http
      .get<AccommodationDTO[]>(`${this.apiUrl}/name/${name}`);
  }

  getAccommodationById(accommodationId: string): Observable<AccommodationDTO> {
    return this.http
      .get<AccommodationDTO>(`${this.apiUrl}/${accommodationId}`);
  }

  createAccommodation(accommodation: AccommodationDTO): Observable<AccommodationDTO> {
    return this.http
      .post<AccommodationDTO>(this.apiUrl, accommodation);
  }

  updateAccommodation(
    accommodationId: string,
    accommodation: AccommodationDTO
  ): Observable<AccommodationDTO> {
    return this.http
      .put<AccommodationDTO>(`${this.apiUrl}/${accommodationId}`, accommodation);
  }

  linkAccommodationsToItinerary(itineraryId: string, accommodationIds: string[]): Observable<any> {
    return this.http.post(
      `${environment.apiUrlDestinarium}/itineraries/${itineraryId}/accommodations`,
      { accommodationIds }
    );
  }

  deleteAccommodation(accommodationId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.apiUrl}/${accommodationId}`);
  }
}
