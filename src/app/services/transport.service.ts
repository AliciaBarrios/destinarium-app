import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransportDTO } from '../models/transport.dto';
import { Observable } from 'rxjs';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'transports';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getTransports(): Observable<TransportDTO[]>  {
    return this.http.get<TransportDTO[]>(this.urlBlogUocApi);
  }

  getTransportByCompany(company: string): Observable<TransportDTO[]> {
    return this.http
      .get<TransportDTO[]>(`${this.urlBlogUocApi}/company/${company}`);
  }

  getTransportById(transportId: string): Observable<TransportDTO> {
    return this.http
      .get<TransportDTO>(`${this.urlBlogUocApi}/${transportId}`);
  }

  createTransport(transport: TransportDTO): Observable<TransportDTO> {
    return this.http
      .post<TransportDTO>(this.urlBlogUocApi, transport);
  }

  updateTransport(
    transportId: string,
    transport: TransportDTO
  ): Observable<TransportDTO> {
    return this.http
      .put<TransportDTO>(`${this.urlBlogUocApi}/${transportId}`, transport);
  }

  linkTransportsToItinerary(itineraryId: string, transportIds: string[]): Observable<any> {
    return this.http.post(
      `http://localhost:3000/itineraries/${itineraryId}/transports`,
      { transportIds }
    );
  }

  deleteTransport(transportId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.urlBlogUocApi}/${transportId}`);
  }
}
