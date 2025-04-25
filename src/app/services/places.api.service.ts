import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesApiService {
  private apiUrl = 'https://api.example.com/lugares'; // URL de la API
  

  constructor(private http: HttpClient) { }

  // Método para obtener los lugares
  getPlaces(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
