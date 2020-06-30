import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client/client.component';
import { DevsComponent } from './devs/devs.component';
import { AngularMaterialModule } from '../angular-material.module';

import { UsersRoutingModule } from './users-routing.module';
import { EditUserComponent } from './edit-user/edit-user.component';

@NgModule({
  declarations: [ClientComponent, DevsComponent, EditUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    AngularMaterialModule
  ]
})
export class UsersModule { }
