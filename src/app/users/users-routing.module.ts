import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client/client.component';
import { DevsComponent } from './devs/devs.component';

import { PostListComponent } from '../posts/post-list/post-list.component';

const routes: Routes = [
  {
    path: ':id',
    component: ClientComponent
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
