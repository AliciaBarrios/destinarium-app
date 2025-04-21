import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-switch-auth',
  templateUrl: './switch-auth.component.html',
  styleUrl: './switch-auth.component.scss'
})
export class SwitchAuthComponent {
  @Input() active: 'login' | 'registro' = 'login';

  constructor(private router: Router) {}

  goTo(path: 'login' | 'registro') {
    if (this.active !== path) {
      this.router.navigate([`/usuario/${path}`]);
    }
  }
}
