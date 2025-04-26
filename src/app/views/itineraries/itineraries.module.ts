import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { ItinerariesRoutingModule } from './itineraries-routing.module';
import { ItinerariesComponent } from './itineraries.component';
import { SharedModule } from '../../shared/shared.module';
import { NewItineraryComponent } from './new-itinerary/new-itinerary.component';
import { Step1BasicDataComponent } from './new-itinerary/step1-basic-data/step1-basic-data.component';
import { Step2DayInfoComponent } from './new-itinerary/step2-day-info/step2-day-info.component';
import { Step3ExtrasComponent } from './new-itinerary/step3-extras/step3-extras.component';
import { ItinerarySummeryComponent } from './new-itinerary/itinerary-summery/itinerary-summery.component';
import { ItineraryConfirmationComponent } from './new-itinerary/itinerary-confirmation/itinerary-confirmation.component';
import { ResultsComponent } from './results/results.component';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    ItinerariesComponent,
    NewItineraryComponent,
    Step1BasicDataComponent,
    Step2DayInfoComponent,
    Step3ExtrasComponent,
    ItinerarySummeryComponent,
    ItineraryConfirmationComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    ItinerariesRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    QuillModule.forRoot()
  ],
  exports: [ItinerariesComponent]
})
export class ItinerariesModule { }
