import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItinerariesRoutingModule } from './itineraries-routing.module';
import { ItinerariesComponent } from './itineraries.component';


@NgModule({
  declarations: [
    ItinerariesComponent
  ],
  imports: [
    CommonModule,
    ItinerariesRoutingModule
  ]
})
export class ItinerariesModule { }
