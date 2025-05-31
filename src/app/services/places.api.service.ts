import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PlaceFull {
  name: string;
  address: string;
  rating: number;
  types: string[];
  photos: string[];
}
export interface Destination {
  name: string;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesApiService {
  private apiUrl: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'places';
    this.apiUrl = environment.apiUrlDestinarium + '/' + this.controller;
  }

  searchPlaces(query: string): Observable<PlaceFull[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<PlaceFull[]>(`${this.apiUrl}/search`, { params });
  }

  searchPlaceFull(query: string): Observable<PlaceFull | null> {
    return this.http.get<PlaceFull | null>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }

  getCoordinates(place: string): Observable<{ lat: number; lng: number }> {
    return this.http.get<{ lat: number; lng: number }>(`${this.apiUrl}/coordinates?place=${encodeURIComponent(place)}`);
  }

  getGoogleMapsApiUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/api-url`);
  }
}

