import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { FattureClienteComponent } from 'src/app/components/fatture-cliente/fatture-cliente.component';
import { FormClienteComponent } from 'src/app/components/form-cliente/form-cliente.component';
import { FormFatturaClienteComponent } from 'src/app/components/form-fattura-cliente/form-fattura-cliente.component';
import { ClientiComponent } from './clienti.component';

const routes: Routes = [
  {
    path: '',
    component: ClientiComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        component: FormClienteComponent,
      },
      {
        path: ':id/fattureCliente',
        component: FattureClienteComponent,
        children: [
          {
            path: ':id/:idCliente',
            component: FormFatturaClienteComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientiRoutingModule {}
