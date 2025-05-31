import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayDTO } from '../models/day.dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DayService {
  private apiUrl: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'days';
    this.apiUrl = environment.apiUrlDestinarium + '/' + this.controller;
  }

  getAllDays(): Observable<DayDTO[]> {
    return this.http.get<DayDTO[]>(this.apiUrl);
  }

  getDayById(dayId: string): Observable<DayDTO> {
    return this.http.get<DayDTO>(`${this.apiUrl}/${dayId}`);
  }

  getDaysByItineraryId(itineraryId: string): Observable<DayDTO[]> {
    return this.http.get<DayDTO[]>(`${this.apiUrl}/by-itinerary/${itineraryId}`);
  }

  newDays(days: DayDTO[]): Observable<DayDTO[]> {
    return this.http.post<DayDTO[]>(this.apiUrl, days);
  }

  updateDay(dayId: string, day: DayDTO): Observable<DayDTO> {
    return this.http.put<DayDTO>(`${this.apiUrl}/${dayId}`, day);
  }

  deleteDay(dayId: string): Observable<{ affected: number }> {
    return this.http.delete<{ affected: number }>(`${this.apiUrl}/${dayId}`);
  }
}
