import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = request.url.startsWith('http://localhost:8080');

    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}` // Utilisez les backticks ici pour la chaîne template
        }
      });
    
      console.log('Request with JWT:', request);
      console.log('Authorization Header:', request.headers.get('Authorization'));
      console.log('Current User:', currentUser);
      console.log('Request URL:', request.url);

    } else {
      console.log('Request without JWT:', request);
    }

    return next.handle(request);
  }
}
