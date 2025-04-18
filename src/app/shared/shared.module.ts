import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from './header/header.component';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    MatIconModule
  ],
  exports: [ 
    NavComponent,
    HeaderComponent 
  ]
})
export class SharedModule { }
