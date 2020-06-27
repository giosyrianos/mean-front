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
    this.isLoading = true;
    console.log('from Angular:', formData.value);
    if (formData.invalid) {
      return;
    }
    this.authService.createUser(formData.value.email, formData.value.password, formData.value.role)

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
