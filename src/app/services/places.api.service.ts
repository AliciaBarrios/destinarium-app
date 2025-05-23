import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesApiService {
  private apiUrl = 'http://localhost:3000/places';

  constructor(private http: HttpClient) { }

  searchPlace(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get(`${this.apiUrl}/search`, { params });
  }
}
