import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentazioneRoutingModule } from './presentazione-routing.module';
import { PresentazioneComponent } from './presentazione.component';


@NgModule({
  declarations: [
    PresentazioneComponent
  ],
  imports: [
    CommonModule,
    PresentazioneRoutingModule
  ]
})
export class PresentazioneModule { }
