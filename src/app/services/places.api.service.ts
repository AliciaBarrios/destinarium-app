import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesApiService {
  private apiUrl = 'https://api.example.com/lugares'; // URL de la API
  private password = 'AIzaSyB0wWjhkNl0MpDC1kouPgV5z265MPA8X_o';

  constructor(private http: HttpClient) { }

  // Método para obtener los lugares
  getPlaces(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
