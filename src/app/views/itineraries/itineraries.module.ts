import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';

import { ItinerariesRoutingModule } from './itineraries-routing.module';
import { ItinerariesComponent } from './itineraries.component';
import { SharedModule } from '../../shared/shared.module';
import { NewItineraryComponent } from './new-itinerary/new-itinerary.component';
import { Step1BasicDataComponent } from './new-itinerary/step1-basic-data/step1-basic-data.component';
import { Step2DayInfoComponent } from './new-itinerary/step2-day-info/step2-day-info.component';
import { Step3ExtrasComponent } from './new-itinerary/step3-extras/step3-extras.component';
import { ItinerarySummeryComponent } from './new-itinerary/itinerary-summery/itinerary-summery.component';
import { ResultsComponent } from './results/results.component';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';
import { ItineraryDetailsComponent } from './itinerary-details/itinerary-details.component';

@NgModule({
  declarations: [
    ItinerariesComponent,
    NewItineraryComponent,
    Step1BasicDataComponent,
    Step2DayInfoComponent,
    Step3ExtrasComponent,
    ItinerarySummeryComponent,
    ResultsComponent,
    ItineraryDetailsComponent
  ],
  providers: [provideNativeDateAdapter()],
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
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    QuillModule.forRoot()
  ],
  exports: [ItinerariesComponent]
})
export class ItinerariesModule { }
