import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { UtentiComponent } from './utenti.component';

const routes: Routes = [{ path: '', component: UtentiComponent,canActivate:[AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtentiRoutingModule { }
