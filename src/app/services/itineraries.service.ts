import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItineraryDTO } from '../models/itinerary.dto';
import { Observable } from 'rxjs';
import { Form } from '@angular/forms';

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
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'itineraries';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getItineraries(): Observable<ItineraryDTO[]> {
    return this.http.get<ItineraryDTO[]>(this.urlBlogUocApi);
  }

  getItinerariesByUserId(userId: string): Observable<ItineraryDTO[]> {
    return this.http
      .get<ItineraryDTO[]>('http://localhost:3000/users/itineraries/' + userId);
  }

  createItinerary(itinerary: ItineraryDTO): Observable<ItineraryDTO> {
    return this.http.post<ItineraryDTO>(this.urlBlogUocApi, itinerary);
  }

  getItineraryById(itineraryId: string): Observable<ItineraryDTO> {
    return this.http
      .get<ItineraryDTO>(this.urlBlogUocApi + '/' + itineraryId);
  }

  updateItinerary(itineraryId: string, itinerary: ItineraryDTO): Observable<ItineraryDTO> {
    return this.http
      .put<ItineraryDTO>(this.urlBlogUocApi + '/' + itineraryId, itinerary);
  }

  deleteItinerary(itineraryId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlBlogUocApi + '/' + itineraryId);
  }

  getItineraryCountByUser(userId: string): Observable<number> {
    return this.http.get<number>(`http://localhost:3000/users/${userId}/itineraries/count`);
  }

   uploadImage(formData: FormData): Observable<{ fileName: string }> {
    return this.http.post<{ fileName: string }>('http://localhost:3000/itineraries/upload-image', formData);
  }
}