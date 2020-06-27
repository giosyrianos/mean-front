import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  signUp(formData: NgForm) {
    if (formData.invalid) {
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
      return;
    }
    this.authService.createUser(formData.value.email, formData.value.password, formData.value.role);

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
