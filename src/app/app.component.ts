import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  authListenerSubs: Subscription;
  typeListenerSubs: Subscription;
  userIsAuthenticated = false;
  title = 'mean-app';
  postList: Post[] = [];
  showFiller = false;
  isClient = false;
<<<<<<< HEAD
  type: any;
=======
  userType: string;
>>>>>>> c1ea4b5d9c88d920e0223745f0f8a4192a58b0e6
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.type = this.authService.getUserType();
      // if (this.authService.getUserType() != 'Client') {
      this.isClient = this.type === 'Client';
      this.userIsAuthenticated = true;
      // }
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.typeListenerSubs = this.authService.getUserTypeListener()
      .subscribe(userType => {
        this.type = userType;
        this.isClient = userType === 'Client';
      });
  }

  show() {
    console.log('works:', this.type);
  }


  getPost(post: Post) {
    console.log(post);
    this.postList.push(post);
  }
}
