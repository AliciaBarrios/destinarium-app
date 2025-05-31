import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryDTO } from '../models/category.dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'categories';
    this.apiUrl = environment.apiUrlDestinarium + '/' + this.controller;
  }

  getCategories(): Observable<CategoryDTO[]>  {
    return this.http.get<CategoryDTO[]>(this.apiUrl);
  }

  getCategoriesByItineraryId(itineraryId: string): Observable<CategoryDTO[]> {
    return this.http
      .get<CategoryDTO[]>(environment.apiUrlDestinarium + '/users/categories/' + itineraryId);
  }

  createCategory(category: CategoryDTO): Observable<CategoryDTO> {
    return this.http
      .post<CategoryDTO>(this.apiUrl, category);
  }

  getCategoryById(categoryId: string): Observable<CategoryDTO> {
    return this.http
      .get<CategoryDTO>(this.apiUrl + '/' + categoryId);
  }

  updateCategory(
    categoryId: string,
    category: CategoryDTO
  ): Observable<CategoryDTO> {
    return this.http
      .put<CategoryDTO>(this.apiUrl + '/' + categoryId, category);
  }

  deleteCategory(categoryId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.apiUrl + '/' + categoryId);
  }
}
