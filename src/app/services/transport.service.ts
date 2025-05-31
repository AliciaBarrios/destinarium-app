import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransportDTO } from '../models/transport.dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  private apiUrl: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'transports';
    this.apiUrl = environment.apiUrlDestinarium + '/' + this.controller;
  }

  getTransports(): Observable<TransportDTO[]>  {
    return this.http.get<TransportDTO[]>(this.apiUrl);
  }

  getTransportByCompany(company: string): Observable<TransportDTO[]> {
    return this.http
      .get<TransportDTO[]>(`${this.apiUrl}/company/${company}`);
  }

  getTransportById(transportId: string): Observable<TransportDTO> {
    return this.http
      .get<TransportDTO>(`${this.apiUrl}/${transportId}`);
  }

  createTransport(transport: TransportDTO): Observable<TransportDTO> {
    return this.http
      .post<TransportDTO>(this.apiUrl, transport);
  }

  updateTransport(
    transportId: string,
    transport: TransportDTO
  ): Observable<TransportDTO> {
    return this.http
      .put<TransportDTO>(`${this.apiUrl}/${transportId}`, transport);
  }

  linkTransportsToItinerary(itineraryId: string, transportIds: string[]): Observable<any> {
    return this.http.post(
      `${environment.apiUrlDestinarium}/itineraries/${itineraryId}/transports`,
      { transportIds }
    );
  }

  deleteTransport(transportId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.apiUrl}/${transportId}`);
  }
}
