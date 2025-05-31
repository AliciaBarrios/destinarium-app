import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../Guards/auth.guards';
import { ItinerariesComponent } from '../../views/itineraries/itineraries.component';
import { ItinerarySummeryComponent } from './new-itinerary/itinerary-summery/itinerary-summery.component';
import { NewItineraryComponent } from './new-itinerary/new-itinerary.component';
import { Step1BasicDataComponent } from './new-itinerary/step1-basic-data/step1-basic-data.component';
import { Step2DayInfoComponent } from './new-itinerary/step2-day-info/step2-day-info.component';
import { Step3ExtrasComponent } from './new-itinerary/step3-extras/step3-extras.component';
import { ResultsComponent } from './results/results.component';
import { ItineraryDetailsComponent } from './itinerary-details/itinerary-details.component';
import { EditItineraryComponent } from './edit-itinerary/edit-itinerary.component';

const routes: Routes = [
  { path: '', component: ItinerariesComponent },
  { path: 'resultados', component: ResultsComponent },
  { path: 'resultados/:id', component: ItineraryDetailsComponent },
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
    ],
  },
  {
    path: 'editar',
    component: EditItineraryComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'paso-1', pathMatch: 'full' },
      { path: 'paso-1/:id', component: Step1BasicDataComponent },
      { path: 'paso-2/:id', component: Step2DayInfoComponent },
      { path: 'paso-3/:id', component: Step3ExtrasComponent },
      { path: 'resumen/:id', component: ItinerarySummeryComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItinerariesRoutingModule {}
