import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../users.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from 'src/app/posts/post.model';
import { map } from 'rxjs/operators';


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
  public posts: any = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private usrService: UserService,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
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
      console.log(this.userId, this.profileID );
      this.user = userData;

    });
  }

  getProfilesPosts(userID: string) {
    this.isLoading = true;
    this.userType = this.authService.getUserType();
    if (this.userType === 'Client') {
      this.usrService.getUsersPosts(userID)
        .pipe(
          map((postData) => {
            return {
              posts: postData.map(post => {
                return {
                  title: post.basicFields.title,
                  content: post.basicFields.description,
                  id: post._id,
                  imgPath: post.basicFields.imgPath,
                  owner: post.basicFields.ownerId,
                  category: post.basicFields.category,
                  subCategory: post.basicFields.subCategory,
                  bids: post.bids
                };
              }),
            };
          })
        )
        .subscribe(userPosts => {
        this.isLoading = false;
        console.log(userPosts, this.userType);
        this.posts = userPosts.posts;
      });
    } else {
      this.usrService.getDevPosts(userID).subscribe(userPosts => {
        this.isLoading = false;
        console.log(userPosts);
      })
    }
  }

  declineBid(postid: string, bidid: string, devid: string){
    // this.postService.declineBid(postid, bidid, devid)
    console.log(postid);
  }

  acceptBid(postid: string, bidid: string, devid: string){
    console.log(postid);
    // this.postService.acceptBid(postid, bidid, devid)
  }

  onDelete(id) {
    console.log(id);
  }

}
