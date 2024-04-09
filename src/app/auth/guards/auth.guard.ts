import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService: AuthService = inject( AuthService );
  const router: Router = inject( Router );

  return authService.checkAuthentication()
    .pipe(
      tap( isAuthenticated => console.log('Authenticated:', isAuthenticated) ),
      tap( isAuthenticated => {
        // Si no está autenticado
        if ( !isAuthenticated ) {
          // Lo redirecciono al login
          router.navigate(['./auth/login']);
        }
      })
    );
};

// CanMatch: Recibe la ruta y los segmentos url
export const canMatchGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  return checkAuthStatus();
};

// CanMatch: Recibe la ruta y el estado
export const canActiveGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkAuthStatus();
};
