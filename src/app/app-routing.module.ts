import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'itinerarios',
    loadChildren: () =>
      import('./views/itineraries/itineraries.module').then(
        (m) => m.ItinerariesModule
      )
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./views/blog/blog.module').then((m) => m.BlogModule),
  },
  {
    path: 'usuario',
    loadChildren: () =>
      import('./views/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'puntos-interes',
    loadChildren: () =>
      import('./views/points-of-interest/points-of-interest.module').then((m) => m.PointsOfInterestModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
