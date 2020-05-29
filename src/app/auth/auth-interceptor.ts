import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const auhtToken = this.authService.getToken();
    // clone request
    const authRequest = req.clone({
      headers: req.headers.set('authorization', `Bearer ${auhtToken}`)
    });
    return next.handle(authRequest);
  }
}
