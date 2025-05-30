import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { UserDTO } from '../../models/user.dto';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  @Output() linkClicked = new EventEmitter<void>();
  userData: UserDTO;

  constructor(
  private authService: AuthService,
  private userService: UserService,
  private localStorageService: LocalStorageService,
  private router: Router
  ) {
    this.userData = new UserDTO('', '', '', '', new Date(), '', '', 0, 0);
  }

  ngOnInit(): void {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.userService.getUSerById(userId).subscribe({
        next: (user: UserDTO) => {
          this.userData = user;
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario', err);
        }
      });
    }
  }

  onLinkClick() {
    this.linkClicked.emit();
  }

  logout(): void {
    this.authService.logout();
    this.onLinkClick();
    this.router.navigate(['/usuario/login']);
  }
}
