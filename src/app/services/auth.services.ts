import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDTO } from '../models/auth.dto';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBlogUocApi: string;
  private controller: string;
  private authState = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {
    this.controller = 'auth';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  isAuthenticated$ = this.authState.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  login(auth: AuthDTO): Observable<AuthToken> {
    return this.http.post<AuthToken>(this.urlBlogUocApi, auth);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.setAuthState(false);
  }

  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }

  isLoggedIn(): boolean {
    return this.authState.value;
  }
}