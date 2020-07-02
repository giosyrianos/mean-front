import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  title = 'mean-app';
  postList: Post[] = [];
  showFiller = false;
  isClient = false;
  userType: string;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated){
      if (this.authService.getUserType() != 'Client'){
        this.userIsAuthenticated = false;
      }
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  le() {
    console.log('works')
  }


  getPost(post: Post) {
    console.log(post);
    this.postList.push(post);
  }
}
