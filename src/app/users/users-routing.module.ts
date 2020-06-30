import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client/client.component';
import { EditUserComponent } from './edit-user/edit-user.component';

import { PostListComponent } from '../posts/post-list/post-list.component';

const routes: Routes = [
  {
    path: ':userid',
    component: ClientComponent
  },
  {
    path: 'edit/:userid',
    component: EditUserComponent
  }
  // {
  //   path: 'dev/:id',
  //   component: DevsComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
