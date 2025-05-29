import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { SharedService } from '../services/shared.services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const access_token = this.localStorageService.get('access_token');
    if (access_token) {
      // logged in so return true
      return true;
    }

    this.sharedService.setLoginRedirectMessage('Por favor, inicia sesión para continuar');

    this.router.navigate(['/usuario/login']);

    return false;
  }
}