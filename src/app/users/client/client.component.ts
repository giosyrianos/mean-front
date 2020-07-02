import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { UserService } from '../users.service';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { Post } from 'src/app/posts/post.model';
import { map } from 'rxjs/operators';
import { PostService } from 'src/app/posts/post.service';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;
  profileID: string;
  user: any;
  userType: string;
  public posts: any = [];
  public acceptedPosts: any =[];
  isLoading = false;

  mySubscription: any;

  private postsListUpdated = new Subject<{posts: any}>();

  constructor(
    private authService: AuthService,
    private usrService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
   }


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

  updatePostsListener() {
    return this.postsListUpdated.asObservable();
  }
  

  getUserData(userID: string) {
    this.isLoading = true;
    this.usrService.getSingleUser(userID).subscribe(userData => {
      this.isLoading = false;
      // console.log(this.userId, this.profileID );
      this.user = userData;

    });
  }

  getProfilesPosts(userID: string) {
    this.isLoading = true;
    this.userType = this.authService.getUserType();
    if (this.userType === 'Client') {
      this.usrService.getUsersPosts(userID)
        .pipe(
          map((postData: any) => {
            return {
              posts: postData.map(post => {
                let newPost = {
                  title: post.basicFields.title,
                  content: post.basicFields.description,
                  id: post._id,
                  imgPath: post.basicFields.imgPath,
                  owner: post.basicFields.ownerId,
                  category: post.basicFields.category,
                  subCategory: post.basicFields.subCategory,
                  bids: post.bids
                };
                console.log(post.devId)
                if (post.devId != null){
                  this.acceptedPosts.push(newPost)
                }
                return newPost
              }),
            };
          })
        )
        .subscribe(userPosts => {
          this.isLoading = false;
          console.log(userPosts, this.userType);
          this.posts = userPosts.posts;
          this.postsListUpdated.next({
          posts: [...this.posts],
        });
      });
    } else {
      this.usrService.getDevPosts(userID)
        .pipe(
          map((postData: any) => {
            console.log(postData)
            return {
              posts: postData.data.map(post => {
                let newPost = {
                  title: post.basicFields.title,
                  content: post.basicFields.description,
                  id: post._id,
                  imgPath: post.basicFields.imgPath,
                  owner: post.basicFields.ownerId,
                  category: post.basicFields.category,
                  subCategory: post.basicFields.subCategory,
                  bids: post.bids
                };
                console.log(post.devId)
                if (post.devId != null){
                  this.acceptedPosts.push(newPost)
                }
                return newPost
              }),
            };
          })
        )
        .subscribe(userPosts => {
          this.isLoading = false;
          console.log(userPosts, this.userType);
          this.posts = userPosts.posts;
          this.postsListUpdated.next({
          posts: [...this.posts],
        });
      });
    }
  }

  goToDev(devId: any) {
    this.router.navigate([`/profile/${devId}`]);
  }

  declineBid(postid: string, bidid: string, devid: string){
    console.log("gere")
    this.postService.declineBid(postid, bidid, devid)
    // console.log(postid);
  }

  acceptBid(postid: string, bidid: string, devid: string){
    // console.log(postid);
    this.postService.acceptBid(postid, bidid, devid)
  }

  onDelete(id) {
    console.log(id);
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
