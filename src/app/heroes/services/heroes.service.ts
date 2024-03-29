import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

// Constante con la cantidad máxima de resultados que puede devolver la query
const LIMIT_QUERY: number = 6;

@Injectable({providedIn: 'root'})
export class HeroesService {

  // Obtengo la url del archivo environments.ts
  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroById( id: string ): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        // El 'of' es una forma de crear observables basado en el valor que recibe por parámetro (En este caso, un undefined)
        catchError( error => of(undefined) )
      );
  }

  // Método que devuelve un array de héroes que coinciden con la query que recibe
  getSuggestions( query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }&_limit=${ LIMIT_QUERY }`);
  }

}
