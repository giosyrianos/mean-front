import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() { }

  onLogin(formData: NgForm) {
    this.isLoading = true;
    console.log(formData);
    if (formData.invalid) {
      return;
    }
    this.authService.login(formData.value.email, formData.value.password);
  }

}
