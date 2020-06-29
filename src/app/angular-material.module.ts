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
  MatTabsModule,
  MatFormFieldModule,
  MatTableModule,
  MatChipsModule
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
    MatTabsModule,
    MatFormFieldModule,
    MatTableModule,
    MatChipsModule
  ]
})
export class AngularMaterialModule { }
