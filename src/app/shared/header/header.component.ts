import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  menuOpen = false;
  searchTerm = '';

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  search() {
    this.router.navigate(['/itinerarios/resultados'], {
      queryParams: { destino: this.searchTerm },
    });
  }

  // Método para abrir y cerrar el menú
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      // Bloquear el desplazamiento cuando el menú esté abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  // Método para cerrar el menú
  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = 'auto';
  }

  goToUserSection(): void {
    const token = this.localStorage.get('access_token');
    if (token) {
      this.router.navigate(['/usuario']);
    } else {
      this.router.navigate(['/usuario/login']);
    }
  }

  goTo(path: 'faqs' | 'contacto') {
    this.router.navigate([`/${path}`]);
  }
}
