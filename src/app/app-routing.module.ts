import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) 
  }, 
  { 
    path: 'itinerarios', 
    loadChildren: () => import('./modules/itineraries/itineraries.module').then(m => m.ItinerariesModule) 
  },
  { 
    path: 'blog', 
    loadChildren: () => import('./modules/blog/blog.module').then(m => m.BlogModule) 
  },
  { 
    path: 'users', 
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
