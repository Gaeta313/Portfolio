import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertFatturaComponent } from 'src/app/components/alert-fattura/alert-fattura.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AlertErroriComponent } from 'src/app/components/alert-errori/alert-errori.component';



// lo shared module rende disponibile il component Alert Fattura(alert conferma eliminazione fattura), sia al modulo Cliente,
//che al modulo fatture, e rende disponibile il componet alert errori,
// per tutti i moduli che devono gestire errori nelle chimate al service, o che devono visualizzare messaggi di sistema

@NgModule({
  declarations: [ AlertFatturaComponent, AlertErroriComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports:[
    AlertFatturaComponent, AlertErroriComponent
  ]
})
export class SharedModule { }
