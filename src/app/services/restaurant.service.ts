import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestaurantDTO } from '../models/restaurant.dto';
import { Observable } from 'rxjs';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'restaurants';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getRestaurants(): Observable<RestaurantDTO[]>  {
    return this.http.get<RestaurantDTO[]>(this.urlBlogUocApi);
  }

  getRestaurantByName(name: string): Observable<RestaurantDTO[]> {
    return this.http
      .get<RestaurantDTO[]>(`${this.urlBlogUocApi}/name/${name}`);
  }

  getRestaurantById(restaurantId: string): Observable<RestaurantDTO> {
    return this.http
      .get<RestaurantDTO>(`${this.urlBlogUocApi}/${restaurantId}`);
  }

  createRestaurant(restaurant: RestaurantDTO): Observable<RestaurantDTO> {
    return this.http
      .post<RestaurantDTO>(this.urlBlogUocApi, restaurant);
  }

  updateRestaurant(
    restaurantId: string,
    restaurant: RestaurantDTO
  ): Observable<RestaurantDTO> {
    return this.http
      .put<RestaurantDTO>(`${this.urlBlogUocApi}/${restaurantId}`, restaurant);
  }

  linkRestaurantsToItinerary(itineraryId: string, restaurantIds: string[]): Observable<any> {
    return this.http.post(
      `http://localhost:3000/itineraries/${itineraryId}/restaurants`,
      { restaurantIds }
    );
  }

  deleteRestaurant(restaurantId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.urlBlogUocApi}/${restaurantId}`);
  }
}
