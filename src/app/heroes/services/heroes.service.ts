import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

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

  // Método para agregar un héroe
  addHero( hero: Hero ): Observable<Hero> {
    // El segundo argumento, en este caso 'hero', es lo que tiene que grabar
    return this.http.post<Hero>(`${ this.baseUrl }/heroes`, hero );
  }

  // Método para actualizar un héroe con la información que recibo
  updateHero( hero: Hero ): Observable<Hero> {
    // Si el hero que recibo por parámetro no tiene id, lanzo un error
    if ( !hero.id ) throw Error('Hero id is required');

    // El segundo argumento, en este caso 'hero', es lo que tiene que actualizar
    return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${ hero.id }`, hero );
  }

  // Método para eliminar un héroe por id
  deleteHeroById( id: string ): Observable<boolean> {
    return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        // Si llega acá, devuelvo un true
        map( resp => true ),
        // Si hay un error devuelvo false que significa que no se borró
        catchError( err => of(false) )
      );
  }
}
