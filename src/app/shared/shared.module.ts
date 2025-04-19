import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from './header/header.component';
import { MatExpansionModule } from '@angular/material/expansion';

import { RouterModule } from '@angular/router';
import { SimpleCardComponent } from './simple-card/simple-card.component';
import { FullCardComponent } from './full-card/full-card.component';

@NgModule({
  declarations: [
    NavComponent,
    HeaderComponent,
    SimpleCardComponent,
    FullCardComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    RouterModule,
    MatIconModule
  ],
  exports: [ 
    NavComponent,
    HeaderComponent,
    SimpleCardComponent,
    FullCardComponent
  ]
})
export class SharedModule { }
