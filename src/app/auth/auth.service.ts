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
  private userTypeListener = new Subject<string>();
  private tokenTimer: any;
  private userId: string;
  private userType: string;

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

  getUserId() {
    return this.userId;
  }

  getUserType() {
    return this.userType;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserTypeListener() {
    return this.userTypeListener.asObservable();
  }

  createUser(email: string, password: string, userType: string) {
    const authData: AuthData = {
      email,
      password,
      userType
    };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
        // redirect here to my posts
        this.router.navigate(['/login']);
      }, error => {
          this.authStatusListener.next(false);
      });
  }

  createUser2(newUser: any) {
    const userData = new FormData();
    userData.append('newUser', JSON.stringify(newUser));
    userData.append('image', newUser.image);
    this.http.post('http://localhost:3000/api/user/signup',userData)
      .subscribe(response => {
        console.log(response);
        // redirect here to my posts
        this.router.navigate(['/login']);
      }, error => {
          this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post<{ token: string, expiresIn: number, userId: string, userType: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        console.log(response.userType);
        this.userTypeListener.next(response.userType);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuhtTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.userType = response.userType;
          this.userTypeListener.next(response.userType);
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId, this.userType);
          this.router.navigate([`/profile/${this.userId}`]);
        }
      }, error => {
          this.authStatusListener.next(false);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userTypeListener.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
    this.userId = null;
    this.userType = null;
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
      this.userId = authInfo.userId;
      this.userType = authInfo.userType;
      this.setAuhtTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.userTypeListener.next(authInfo.userType);
    }
  }

  private setAuhtTimer(duration: number) {
    console.log(duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userType: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userType', userType);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      userType
    };
  }
}
