import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccommodationDTO } from '../models/accommodation.dto';
import { Observable } from 'rxjs';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccommodationService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'accommodations';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getAccommodations(): Observable<AccommodationDTO[]>  {
    return this.http.get<AccommodationDTO[]>(this.urlBlogUocApi);
  }

  getAccommodationByName(name: string): Observable<AccommodationDTO[]> {
    return this.http
      .get<AccommodationDTO[]>(`${this.urlBlogUocApi}/name/${name}`);
  }

  getAccommodationById(accommodationId: string): Observable<AccommodationDTO> {
    return this.http
      .get<AccommodationDTO>(`${this.urlBlogUocApi}/${accommodationId}`);
  }

  createAccommodation(accommodation: AccommodationDTO): Observable<AccommodationDTO> {
    return this.http
      .post<AccommodationDTO>(this.urlBlogUocApi, accommodation);
  }

  updateAccommodation(
    accommodationId: string,
    accommodation: AccommodationDTO
  ): Observable<AccommodationDTO> {
    return this.http
      .put<AccommodationDTO>(`${this.urlBlogUocApi}/${accommodationId}`, accommodation);
  }

  linkAccommodationsToItinerary(itineraryId: string, accommodationIds: string[]): Observable<any> {
    return this.http.post(
      `http://localhost:3000/itineraries/${itineraryId}/accommodations`,
      { accommodationIds }
    );
  }

  deleteAccommodation(accommodationId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.urlBlogUocApi}/${accommodationId}`);
  }
}
