import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PointsOfInterestComponent } from './points-of-interest.component';
import { PointsOfInterestRoutingModule } from './points-of-interest-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PointsOfInterestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PointsOfInterestRoutingModule,
    SharedModule,
    MatIconModule,
  ],
  exports: [
    PointsOfInterestComponent
  ]
})
export class PointsOfInterestModule { }
