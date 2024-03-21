import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

const routes: Routes = [
  {
    // localhost:4200/heroes/
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        // localhost:4200/heroes/new-hero
        path: 'new-hero',
        component: NewPageComponent
      },
      {
        // localhost:4200/heroes/search
        path: 'search',
        component: SearchPageComponent
      },
      {
        // localhost:4200/heroes/edit/:id
        path: 'edit/:id',
        component: NewPageComponent
      },
      {
        // localhost:4200/heroes/list
        path: 'list',
        component: ListPageComponent
      },
      {
        /*
          Siempre tiene que ir al final porque es un comodín.
          Si estuviese al inicio, las otras no entraría porque todos los otros path,
            coincidirían con el de este path.
        */
        // localhost:4200/heroes/:id
        path: ':id',
        component: HeroPageComponent
      },
      {
        // Cualquier caso que no esté definido, redirecciona al 'list'
        path: '**',
        redirectTo: 'list'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
