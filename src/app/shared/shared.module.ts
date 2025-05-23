import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';

import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { FullCardComponent } from './full-card/full-card.component';
import { SimpleCardComponent } from './simple-card/simple-card.component';
import { SwitchAuthComponent } from './switch-auth/switch-auth.component';

@NgModule({
  declarations: [
    NavComponent,
    HeaderComponent,
    SimpleCardComponent,
    FullCardComponent,
    SwitchAuthComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    RouterModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [
    NavComponent,
    HeaderComponent,
    FooterComponent,
    SimpleCardComponent,
    FullCardComponent,
    SwitchAuthComponent,
  ],
})
export class SharedModule {}
