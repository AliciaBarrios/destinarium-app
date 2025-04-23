import { Component, Output, EventEmitter, ChangeDetectionStrategy, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  
  @Output() linkClicked = new EventEmitter<void>();
  @HostListener('window:resize', [])
  onResize() {
    this.isDesktop = window.innerWidth >= 769;
  }

  ngOnInit() {
    this.onResize();
  }

  isDesktop = false;
  isAuthenticated$ = this.authService.isAuthenticated$;

  onLinkClick() {
    this.linkClicked.emit();
  }

  goTo(path: 'login' | 'registro' | 'menu') {
    this.onLinkClick();
    this.router.navigate([`/usuario/${path}`]);
  }
}
