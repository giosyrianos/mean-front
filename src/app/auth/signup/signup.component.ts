import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  signUp(formData: NgForm) {
    console.log('from Angular:', formData.value);
    if (formData.invalid) {
      return;
    }
    this.authService.createUser(formData.value.email, formData.value.password, formData.value.role);
  }

}
