import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método que se ejecuta cuando se hace click en el botón login
  onLogin(): void {
    // Llamamos al login del service
    this.authService.login('peter@gmail.com', '123456')
      .subscribe( user => {
        // Enviamos al usuario a la ruta '/'
        this.router.navigate(['/']);
      });
  }
}
