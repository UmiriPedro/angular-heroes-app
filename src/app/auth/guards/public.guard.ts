import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService: AuthService = inject( AuthService );
  const router: Router = inject( Router );

  return authService.checkAuthentication()
    .pipe(
      tap( isLogged => console.log('Logged:', isLogged) ),
      tap( isLogged => {
        // Si está logeado
        if ( isLogged ) {
          // Lo redirecciono a los héroes
          router.navigate(['./']);
        }
      }),
      // Usamos el map para transformar el valor que recibimos del checkAuthentication
      map( isLogged => !isLogged )
    );
};

// CanMatch: Recibe la ruta y los segmentos url
export const authCanMatchGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('entre 1');
  return checkAuthStatus();
};

// CanMatch: Recibe la ruta y el estado
export const authCanActiveGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('entre 2');
  return checkAuthStatus();
};
