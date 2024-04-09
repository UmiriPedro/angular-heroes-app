import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  // Getter del usuario logeado. Si no hay usuario logeado, devuelve undefined
  get currentUser(): User | undefined {
    // Si el usuario no existe, devuelvo un undefined
    if ( !this.user ) return undefined;

    // Si el usuario existe, devuelvo un clone del objeto
    return structuredClone( this.user );
  }

  // Método que ejecuta el login
  login( email: string, password: string ): Observable<User> {
    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        // Asigna el usuario logeado al usuario actual
        tap( user => this.user = user),
        // Setea el token de la sesión del usuario logeado al localstorage
        tap( user => localStorage.setItem('token', 'asdlkfjal.aopdj358.8rufa' ))
      );
  }

  // Método para saber si se está autenticado
  checkAuthentication(): Observable<boolean> {
    // Si el local storage no tiene el 'token', devuelvo un false
    if ( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        // Asigno el usuario
        tap( user => this.user = user ),
        // Con la doble negación de user, devuelvo el si existe el usuario
        map( user => !!user ),
        // Si hay un error, devolvemos un Observable false
        catchError( error => of(false) )
      );
  }

  // Método que ejecuta el logout
  logout(): void {
    // Marca como undefined el usuario logeado
    this.user = undefined;
    // con el clear() eliminamos del localstorage todo lo que grabo esta aplicación
    localStorage.clear();
  }

}
