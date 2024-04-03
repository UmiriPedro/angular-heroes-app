import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  // Creo el formulario reactivo
  public heroForm = new FormGroup({
    // Lo de abajo son las propiedades que quiero que el formulario maneje
    id: new FormControl<string>(''),
    // Con el nonNullable: true, le indicamos que no permitimos enviarle null
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>('')
  });

  public publishers = [
    { id: 'DC Comics', description: 'DC - Comics' },
    { id: 'Marvel Comics', description: 'Marvel - Comics' }
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Si la url no incluye la palabra 'edit', no hago nada
    if ( !this.router.url.includes('edit') ) return;

    // Si la url incluye la palabra 'edit', cargo en el formulario los datos del héroe
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      ).subscribe( hero => {
        // Si no existe un héroe, saco a la persona de la pantalla
        if ( !hero ) return this.router.navigateByUrl('/');

        // Caso contrario, reestablezco el formulario con los valores del hero
        // El reset, reestablece el formulario y en este caso, mapea todos los valores del formulario que tienen el mismo nombre del hero
        this.heroForm.reset( hero );
        return;
      })
  }

  get currentHero(): Hero {
    // Con el "as Hero", le digo que el this.heroForm.value lo trate como un Hero
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  onSubmit(): void {
    // Si el formulario es inválido, no hace nada
    if ( this.heroForm.invalid ) return;

    // Si el Héroe tiene id, actualiza
    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.superhero } updated!`);
        });

        return;
    }

    // Si no sucedió ninguno de los if anteriores, inserta
    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id ]);
        this.showSnackbar(`${ hero.superhero } created!`);

      });

  }

  // Método que abre el diálogo cuando se hace click en el botón Borrar
  onDeleteHero(): void {
    // Si el currenHero no tiene id, lanzo un error
    if ( !this.currentHero.id ) throw Error('Hero id is required');

    // El open() recibe el componente y la data
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    // Esto se ejecuta una vez que se cierra el dialog
    dialogRef.afterClosed()
      .pipe(
        // Hacemos un filtro de aquellos result que son verdaderos
        filter( (result: boolean) => result ),
        // Llamo al service para eliminar al héroe
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id )),
        // Hacemos un filtro de aquellos que wasDeleted son true
        filter( (wasDeleted: boolean) => wasDeleted )
      )
      .subscribe(() => {
        // Saco al usuario al listado de héroes
        this.router.navigate(['/heroes']);
      });
  }

  // Método para mostrar el snackbar con el mensaje que recibe por parámetro
  showSnackbar( message: string ): void {
    // El 'done' es un botón que si se hace click, desaparece el snackbar
    // El duration: 2500 es la cantidad de tiempo que muestra el snackbar, en este caso 2500 = dos segundos y medio
    this.snackbar.open( message, 'done', {
      duration: 2500
    });
  }
}
