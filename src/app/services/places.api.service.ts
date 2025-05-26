import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface PlaceFull {
  name: string;
  address: string;
  rating: number;
  types: string[];
  photos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PlacesApiService {
  private apiUrl = 'http://localhost:3000/places';

  constructor(private http: HttpClient) { }

  searchPlaces(query: string): Observable<PlaceFull[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<PlaceFull[]>(`${this.apiUrl}/search`, { params });
  }

  searchPlaceFull(query: string): Observable<PlaceFull | null> {
    return this.http.get<PlaceFull | null>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }
}
