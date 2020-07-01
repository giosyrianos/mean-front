import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../users.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;
  user: any;
  profileID: string;
  isLoading = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute

  ) {}

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
    });
  }

  getUserData(userID: string) {
    this.isLoading = true;
    this.userService.getSingleUser(userID).subscribe(userData => {
      this.isLoading = false;
      this.user = userData;
    });
  }
}
