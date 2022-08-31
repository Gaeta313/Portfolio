import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientiRoutingModule } from './clienti-routing.module';
import { Alert, ClientiComponent, Dialog } from './clienti.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormClienteComponent } from 'src/app/components/form-cliente/form-cliente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { FattureClienteComponent } from 'src/app/components/fatture-cliente/fatture-cliente.component';
import { FormFatturaClienteComponent } from 'src/app/components/form-fattura-cliente/form-fattura-cliente.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ClientiComponent,
    Dialog,
    FormClienteComponent,
    Alert,
    FattureClienteComponent,
    FormFatturaClienteComponent,

  ],
  imports: [
    CommonModule,
    ClientiRoutingModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule
  ],
})
export class ClientiModule {}
