import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './users/admin/admin.component';

const routes: Routes = [
  // { path: 'property', loadChildren: () => import('./modules/property/property.module').then(m => m.PropertyModule) },

  {path: '', component: PostListComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'sign-up', component: SignupComponent },
  { path: 'users', component: AdminComponent},
  {
    path: 'profile',
    loadChildren: () => import('./users/users.module').then( m => m.UsersModule)
  }
  // {path: '*', component: PostListComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
