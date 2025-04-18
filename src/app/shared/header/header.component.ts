import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  menuOpen = false;

  constructor(private router: Router) {}

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
    document.body.style.overflow = 'auto'; // Permitir desplazamiento nuevamente
  }
}
