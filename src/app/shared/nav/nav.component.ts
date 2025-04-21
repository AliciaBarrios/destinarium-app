import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  
  @Output() linkClicked = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  isAuthenticated$ = this.authService.isAuthenticated$;

  onLinkClick() {
    this.linkClicked.emit();
  }

  goTo(path: 'login' | 'registro') {
    this.onLinkClick();
    this.router.navigate([`/usuario/${path}`]);
  }
}
