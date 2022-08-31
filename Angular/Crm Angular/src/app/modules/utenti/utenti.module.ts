import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { UtentiRoutingModule } from './utenti-routing.module';
import { UtentiComponent } from './utenti.component';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    UtentiComponent
  ],
  imports: [
    CommonModule,
    UtentiRoutingModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ]
})
export class UtentiModule { }
