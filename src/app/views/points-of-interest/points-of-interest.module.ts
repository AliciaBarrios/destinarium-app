import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PointsOfInterestComponent } from './points-of-interest.component';
import { PointsOfInterestRoutingModule } from './points-of-interest-routing.module';

@NgModule({
  declarations: [
    PointsOfInterestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PointsOfInterestRoutingModule,
  ],
  exports: [
    PointsOfInterestComponent
  ]
})
export class PointsOfInterestModule { }
