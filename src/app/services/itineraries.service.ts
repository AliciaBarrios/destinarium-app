import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItineraryDTO } from '../models/itinerary.dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  private apiUrl: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'itineraries';
    this.apiUrl = environment.apiUrlDestinarium + '/' + this.controller;
  }

  getItineraries(): Observable<ItineraryDTO[]> {
    return this.http.get<ItineraryDTO[]>(this.apiUrl);
  }

  getItinerariesByUserId(userId: string): Observable<ItineraryDTO[]> {
    return this.http
      .get<ItineraryDTO[]>(environment.apiUrlDestinarium + '/users/itineraries/' + userId);
  }

  getFilteredItineraries(filters: any): Observable<ItineraryDTO[]> {
    return this.http.post<ItineraryDTO[]>(this.apiUrl + '/filter', filters);
  }

  createItinerary(itinerary: ItineraryDTO): Observable<ItineraryDTO> {
    return this.http.post<ItineraryDTO>(this.apiUrl, itinerary);
  }

  getItineraryById(itineraryId: string): Observable<ItineraryDTO> {
    return this.http
      .get<ItineraryDTO>(this.apiUrl + '/' + itineraryId);
  }

  updateItinerary(itineraryId: string, itinerary: ItineraryDTO): Observable<ItineraryDTO> {
    return this.http
      .put<ItineraryDTO>(this.apiUrl + '/' + itineraryId, itinerary);
  }

  deleteItinerary(itineraryId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.apiUrl + '/' + itineraryId);
  }

  getItineraryCountByUser(userId: string): Observable<number> {
    return this.http.get<number>(`${environment.apiUrlDestinarium}/users/${userId}/itineraries/count`);
  }

   uploadImage(formData: FormData): Observable<{ fileName: string }> {
    return this.http.post<{ fileName: string }>(this.apiUrl + '/upload-image', formData);
  }
}