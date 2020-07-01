import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../users.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from 'src/app/posts/post.model';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;
  profileID: string;
  user: any;
  userType: string;
  public posts: Post[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private usrService: UserService,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.isLoading = true;
    this.profileID = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.profileID = paramMap.get('userid');
      this.getUserData(this.profileID);
      this.getProfilesPosts(this.profileID);
    });
  }

  getUserData(userID: string) {
    this.isLoading = true;
    this.usrService.getSingleUser(userID).subscribe(userData => {
      this.isLoading = false;
      this.user = userData;
    });
  }

  getProfilesPosts(userID: string) {
    this.isLoading = true;
    this.userType = this.authService.getUserType();
    console.log(this.userType)
    if (this.userType == 'Client'){
      this.usrService.getUsersPosts(userID).subscribe(userPosts => {
        this.isLoading = false;
        console.log(userPosts);
      });
    }else{
      console.log("edw")
      this.usrService.getDevPosts(userID).subscribe(userPosts => {
        this.isLoading = false;
        console.log(userPosts);
      })
    }
  }

  onDelete(id) {
    console.log(id)
  }

}
