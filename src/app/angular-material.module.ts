import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatDialogModule,
  MatStepperModule,
  MatChipsModule,
  MatListModule
} from '@angular/material';



@NgModule({
  exports: [
    MatSidenavModule,
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatStepperModule,
    MatCardModule,
    MatChipsModule,
    MatListModule
  ]
})
export class AngularMaterialModule { }
