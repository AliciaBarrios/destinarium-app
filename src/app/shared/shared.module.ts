import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { FullCardComponent } from './full-card/full-card.component';
import { FullCardPlacesComponent } from './full-card-places/full-card-places.component';
import { SimpleCardComponent } from './simple-card/simple-card.component';
import { SwitchAuthComponent } from './switch-auth/switch-auth.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SortDialogComponent } from './sort-dialog/sort-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    NavComponent,
    HeaderComponent,
    SimpleCardComponent,
    FullCardComponent,
    FullCardPlacesComponent,
    SwitchAuthComponent,
    FooterComponent,
    SortDialogComponent,
    FilterDialogComponent,
    BreadcrumbComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatRadioModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatChipsModule
  ],
  exports: [
    NavComponent,
    HeaderComponent,
    FooterComponent,
    SimpleCardComponent,
    FullCardComponent,
    FullCardPlacesComponent,
    SwitchAuthComponent,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatRadioModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSliderModule,
    MatChipsModule,
    BreadcrumbComponent
  ],
})
export class SharedModule {}
