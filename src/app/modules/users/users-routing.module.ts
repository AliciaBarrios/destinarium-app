import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../Guards/auth.guards';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { 
    path: '',
    children: [
      {
        path: 'login', 
        component: LoginComponent 
      },
      {
        path: 'registro',
        component: RegisterComponent
      },
      { 
        path: 'menu', 
        component: MenuComponent,
        canActivate: [AuthGuard] 
      },
      { 
        path: 'perfil', 
        component: ProfileComponent,
        canActivate: [AuthGuard] 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
