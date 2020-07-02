import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { UserService } from '../users.service';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { Post } from 'src/app/posts/post.model';
import { map } from 'rxjs/operators';
import { PostService } from 'src/app/posts/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


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
  public devComments: any =[];
  isLoading = false;
  taskform: FormGroup;
  commentform: FormGroup;

  mySubscription: any;

  private postsListUpdated = new Subject<{posts: any}>();
  private commentsListUpdated = new Subject<{comments: any}>();

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
    this.commentform = new FormGroup({
      rating: new FormControl(null, {
        validators: [Validators.required]
      }),
      comment: new FormControl(null, {
        validators: [Validators.required]
      })
    })
    this.taskform = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        validators: [Validators.required]
      })
    });
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
      this.getComments(this.profileID);
    });
  }

  getComments(devId: string){
    if(this.authService.getUserType() == 'Client'){
      return
    }else{
      this.usrService.getDevComments(devId)
        .pipe(
          map((commentsData: any) => {
            return {
              comments: commentsData.comments.map(comment => {
                return {
                  rating: comment.rating,
                  comment: comment.comment,
                  username: comment.username
                };
              }),
            };
          })
        )
        .subscribe(devComments => {
          this.isLoading = false;
          console.log(devComments, this.userType);
          this.devComments = devComments.comments;
          this.commentsListUpdated.next({
          comments: [...this.devComments],
        });
    }
  )}
}

  commentDev(postId: string, devId: string) {
    if (this.commentform.invalid) {
      return;
    }
    if (!this.commentform.invalid) {
      this.userId = this.authService.getUserId()
      this.postService.commentDev(postId, this.commentform.value.rating, this.commentform.value.comment, this.userId, devId );
    }
  }

  updatePostsListener() {
    return this.postsListUpdated.asObservable();
  }

  updateCommentsListener() {
    return this.commentsListUpdated.asObservable();
  }
  
  addTask(postID: string){
    if (this.taskform.invalid) {
      return;
    }
    if (!this.taskform.invalid) {
      this.userId = this.authService.getUserId()
      this.postService.addTask(postID, this.taskform.value.name, this.taskform.value.description );
    }
  }

  completeTask(postId: string, taskId: string){
    this.userId = this.authService.getUserId()
    this.postService.completeTask(postId, taskId)
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
                return {
                  title: post.basicFields.title,
                  content: post.basicFields.description,
                  id: post._id,
                  imgPath: post.basicFields.imgPath,
                  owner: post.basicFields.ownerId,
                  category: post.basicFields.category,
                  subCategory: post.basicFields.subCategory,
                  bids: post.bids,
                  devId: post.devId,
                  tasks: post.tasks,
                  completed: post.completed,
                  commented: post.commented
                };
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
                return {
                  title: post.basicFields.title,
                  content: post.basicFields.description,
                  id: post._id,
                  imgPath: post.basicFields.imgPath,
                  owner: post.basicFields.ownerId,
                  category: post.basicFields.category,
                  subCategory: post.basicFields.subCategory,
                  bids: post.bids,
                  devId: post.devId,
                  tasks: post.tasks,
                  completed: post.completed,
                  commented: post.commented
                };
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

  submitCompletition(postId: string){
    console.log(postId)
    this.postService.completePost(postId);
  }

  declineBid(postid: string, bidid: string, devid: string){
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
