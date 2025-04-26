import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../Guards/auth.guards';
import { LoginComponent } from '../../views/users/login/login.component';
import { MenuComponent } from '../../views/users/menu/menu.component';
import { ProfileComponent } from '../../views/users/profile/profile.component';
import { RegisterComponent } from '../../views/users/register/register.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'registro',
        component: RegisterComponent,
      },
      {
        path: 'menu',
        component: MenuComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
