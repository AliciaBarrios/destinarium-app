import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItinerariesComponent } from './itineraries.component';

const routes: Routes = [{ path: '', component: ItinerariesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItinerariesRoutingModule { }
