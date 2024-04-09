import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { canActiveGuard, canMatchGuard } from './auth/guards/auth.guard';
import { authCanActiveGuard, authCanMatchGuard } from './auth/guards/public.guard';

// dominio.com/''
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    canActivate: [ authCanActiveGuard ],
    canMatch: [ authCanMatchGuard ]
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule ),
    canActivate: [ canActiveGuard ],
    canMatch: [ canMatchGuard ]
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full' // La redirección se va a dar siempre que el path sea tal cual está definido ( '' )
  },
  {
    // Cualquier caso que no esté definido, redirecciona al '404'
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
