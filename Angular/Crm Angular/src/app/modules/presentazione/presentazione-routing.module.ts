import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from 'src/app/auth/login.guard';
import { PresentazioneComponent } from './presentazione.component';

const routes: Routes = [{ path: '', component: PresentazioneComponent, canActivate:[LoginGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentazioneRoutingModule { }
