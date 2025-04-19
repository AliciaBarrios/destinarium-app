import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItinerariesRoutingModule } from './itineraries-routing.module';
import { ItinerariesComponent } from './itineraries.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ItinerariesComponent
  ],
  imports: [
    CommonModule,
    ItinerariesRoutingModule,
    SharedModule
  ],
  exports: [ItinerariesComponent]
})
export class ItinerariesModule { }
