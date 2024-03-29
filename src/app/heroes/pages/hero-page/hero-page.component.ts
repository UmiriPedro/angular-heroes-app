import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute ,// Servicio para activar las rutas
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params // Obtenemos los parámetros de la ruta
      .pipe(
        /*
          El 'switchMap' permite tomar los params.
          De los params, lo desestructuramos y tomamos el id.
          Con el id, llamamos al service.
        */
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) )
      ).subscribe( hero => {
        // Si no existe un héroe, saco al usuario a la pantalla /heroes.list
        if ( !hero ) return this.router.navigate([ '/heroes/list' ]);

        // Si existe un héroe
        this.hero = hero;
        return;
      });
  }

  goBack(): void {
    this.router.navigateByUrl('heroes/list');
  }
}
