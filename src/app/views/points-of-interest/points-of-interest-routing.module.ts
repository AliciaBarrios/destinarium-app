import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointsOfInterestComponent } from './points-of-interest.component';

const routes: Routes = [{ path: '', component: PointsOfInterestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointsOfInterestRoutingModule { }
