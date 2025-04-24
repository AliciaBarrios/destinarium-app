import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItinerariesComponent } from './itineraries.component';
import { NewItineraryComponent } from './new-itinerary/new-itinerary.component';
import { Step1BasicDataComponent } from './new-itinerary/step1-basic-data/step1-basic-data.component';
import { Step2DayInfoComponent } from './new-itinerary/step2-day-info/step2-day-info.component';
import { Step3ExtrasComponent } from './new-itinerary/step3-extras/step3-extras.component';
import { ItinerarySummeryComponent } from './new-itinerary/itinerary-summery/itinerary-summery.component';
import { ItineraryConfirmationComponent } from './new-itinerary/itinerary-confirmation/itinerary-confirmation.component';
import { AuthGuard } from '../../Guards/auth.guards';

const routes: Routes = [
  { path: '', component: ItinerariesComponent },
  {
    path: 'crear-itinerario',
    component: NewItineraryComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'paso-1', pathMatch: 'full' },
      { path: 'paso-1', component: Step1BasicDataComponent },
      { path: 'paso-2', component: Step2DayInfoComponent },
      { path: 'paso-3', component: Step3ExtrasComponent },
      { path: 'resumen', component: ItinerarySummeryComponent },
      { path: 'confirmacion', component: ItineraryConfirmationComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItinerariesRoutingModule { }
