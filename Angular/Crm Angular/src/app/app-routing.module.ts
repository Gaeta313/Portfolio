import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'registrati',
    loadChildren: () =>
      import('./modules/registrati/registrati.module').then(
        (m) => m.RegistratiModule
      ),
  },
  {
    path: 'utenti',
    loadChildren: () =>
      import('./modules/utenti/utenti.module').then((m) => m.UtentiModule),
  },
  {
    path: 'clienti',
    loadChildren: () =>
      import('./modules/clienti/clienti.module').then((m) => m.ClientiModule),
  },
  {
    path: 'fatture',
    loadChildren: () =>
      import('./modules/fatture/fatture.module').then((m) => m.FattureModule),
  },
  {
    path: 'presentazione',
    loadChildren: () =>
      import('./modules/presentazione/presentazione.module').then(
        (m) => m.PresentazioneModule
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    loadChildren: () =>
      import('./modules/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
