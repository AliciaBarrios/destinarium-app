import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../Guards/auth.guards';
import { LoginComponent } from '../../views/users/login/login.component';
import { ProfileComponent } from '../../views/users/profile/profile.component';
import { RegisterComponent } from '../../views/users/register/register.component';
import { UsersComponent } from './users.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegisterComponent,
  },
  {
    path: 'perfil',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mis-datos',
    component: EditProfileComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
