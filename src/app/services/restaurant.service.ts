import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestaurantDTO } from '../models/restaurant.dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'restaurants';
    this.apiUrl = environment.apiUrlDestinarium + '/' + this.controller;
  }

  getRestaurants(): Observable<RestaurantDTO[]>  {
    return this.http.get<RestaurantDTO[]>(this.apiUrl);
  }

  getRestaurantByName(name: string): Observable<RestaurantDTO[]> {
    return this.http
      .get<RestaurantDTO[]>(`${this.apiUrl}/name/${name}`);
  }

  getRestaurantById(restaurantId: string): Observable<RestaurantDTO> {
    return this.http
      .get<RestaurantDTO>(`${this.apiUrl}/${restaurantId}`);
  }

  createRestaurant(restaurant: RestaurantDTO): Observable<RestaurantDTO> {
    return this.http
      .post<RestaurantDTO>(this.apiUrl, restaurant);
  }

  updateRestaurant(
    restaurantId: string,
    restaurant: RestaurantDTO
  ): Observable<RestaurantDTO> {
    return this.http
      .put<RestaurantDTO>(`${this.apiUrl}/${restaurantId}`, restaurant);
  }

  linkRestaurantsToItinerary(itineraryId: string, restaurantIds: string[]): Observable<any> {
    return this.http.post(
      `${environment.apiUrlDestinarium}/itineraries/${itineraryId}/restaurants`,
      { restaurantIds }
    );
  }

  deleteRestaurant(restaurantId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.apiUrl}/${restaurantId}`);
  }
}
