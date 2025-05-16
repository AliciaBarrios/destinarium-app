import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayDTO } from '../models/day.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  private baseUrl = 'http://localhost:3000/days';

  constructor(private http: HttpClient) {}

  getAllDays(): Observable<DayDTO[]> {
    return this.http.get<DayDTO[]>(this.baseUrl);
  }

  getDayById(dayId: string): Observable<DayDTO> {
    return this.http.get<DayDTO>(`${this.baseUrl}/${dayId}`);
  }

  getDaysByItineraryId(itineraryId: string): Observable<DayDTO[]> {
    return this.http.get<DayDTO[]>(`${this.baseUrl}/by-itinerary/${itineraryId}`);
  }

  newDays(days: DayDTO[]): Observable<DayDTO[]> {
    return this.http.post<DayDTO[]>(this.baseUrl, days);
  }

  updateDay(dayId: string, day: DayDTO): Observable<DayDTO> {
    return this.http.put<DayDTO>(`${this.baseUrl}/${dayId}`, day);
  }

  deleteDay(dayId: string): Observable<{ affected: number }> {
    return this.http.delete<{ affected: number }>(`${this.baseUrl}/${dayId}`);
  }
}
