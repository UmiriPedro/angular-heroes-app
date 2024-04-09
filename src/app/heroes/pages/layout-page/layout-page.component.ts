import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: './list' },
    { label: 'Añadir', icon: 'add', url: './new-hero' },
    { label: 'Buscar', icon: 'search', url: './search' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método getter que devuelve el usuario logeado o undefined
  get user(): User | undefined {
    return this.authService.currentUser;
  }

  // Método que se ejecuta cuando se hace click en el botón logout
  onLogout(): void {
    // Llama al logout del servicio de autenticación
    this.authService.logout();
    // Saca al usuario a la pantalla de login
    this.router.navigate(['/auth/login']);
  }
}
