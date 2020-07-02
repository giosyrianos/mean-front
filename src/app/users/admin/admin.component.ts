import { Component, OnInit } from '@angular/core';
import { UserService } from '../users.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ParamMap, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PostService } from 'src/app/posts/post.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isLoading = false;
  userType: string;
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;
  profileID: string;
  user: any;
  public users: any = [];

  mySubscription: any;

  private usersListUpdated = new Subject<{users: any}>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
    });}

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
      this.getUsers();
    });
  }

  getUsers(){
    this.userService.getUsers()
    .pipe(
      map((usersData: any) => {
        console.log(usersData)
        return {
          users: usersData.users.map(user => {
            return {
              id: user._id,
              username: user.username,
              email: user.email,
              userType: user.userType
            };
          }),
        };
      })
    )
    .subscribe(isUsers => {
      this.isLoading = false;
      console.log(isUsers, this.userType);
      this.users = isUsers.users;
      this.usersListUpdated.next({
      users: [...this.users],
    });
}
)
        }

  updatePostsListener() {
    return this.usersListUpdated.asObservable();
  }

  goToProfile(userId: string){
    console.log(userId)
    this.router.navigate([`/profile/${userId}`])
  }
}
