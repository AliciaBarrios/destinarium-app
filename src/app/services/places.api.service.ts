import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/places';

  constructor(private http: HttpClient) { }

  searchPlaces(query: string): Observable<PlaceFull[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<PlaceFull[]>(`${this.apiUrl}/search`, { params });
  }

  searchPlaceFull(query: string): Observable<PlaceFull | null> {
    return this.http.get<PlaceFull | null>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }

  getCoordinates(place: string, map: google.maps.Map): Observable<{ lat: number; lng: number }> {
    return new Observable(observer => {
      const service = new google.maps.places.PlacesService(map);
      const request = {
        query: place,
        fields: ['geometry']
      };

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          const location = results[0].geometry?.location;
          if (location) {
            observer.next({ lat: location.lat(), lng: location.lng() });
            observer.complete();
          } else {
            observer.error('No se encontró la localización');
          }
        } else {
          observer.error('No se encontró el lugar');
        }
      });
    });
  }
}

