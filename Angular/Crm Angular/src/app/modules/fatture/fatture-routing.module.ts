import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { FormFatturaClienteComponent } from 'src/app/components/form-fattura-cliente/form-fattura-cliente.component';
import { FattureComponent } from './fatture.component';

const routes: Routes = [{ path: '', component: FattureComponent, canActivate: [AuthGuard], children:[
  {
    path:":id/:idCliente",
    component: FormFatturaClienteComponent
  }
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FattureRoutingModule { }
