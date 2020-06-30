import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../users.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';


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
      this.usrService.getSingleUser(this.profileID).subscribe(userData => {
        this.isLoading = false;
        this.user = userData;
      });
    });
  }

  getUserData(userID: string) {
    this.usrService.getSingleUser(userID).subscribe(userData => {
        this.isLoading = false;
        console.log(userData);
        this.user = userData;
    });
  }

  onDelete(id) {
    console.log(id)
  }

}
