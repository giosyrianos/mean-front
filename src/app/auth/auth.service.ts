import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  // private authStatusListener = new BehaviorSubject<boolean>(false);
  private isAuthenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
   }

  createUser(email: string, password: string, role: string) {
    const authData: AuthData = {
      email,
      password,
      role
    };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
        // redirect here to my posts
        this.router.navigate(['/']);
      },
        error => {
          console.log(error);
          this.authStatusListener.next(false);
          this.router.navigate(['/sign-up']);
      }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuhtTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      },
        error => {
        console.log(error.message);
       }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuhtTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuhtTimer(duration: number) {
    console.log(duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}
