import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { LoggedUser } from '../models/logged-user.model';
import { jwtDecode } from "jwt-decode";
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<LoggedUser | null>;
  public currentUser: Observable<LoggedUser | null>;
  private baseUrl = 'http://localhost:8080/api/user';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserJson = localStorage.getItem('currentUser');
      const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;
      this.currentUserSubject = new BehaviorSubject<LoggedUser | null>(storedUser);
    } else {
      this.currentUserSubject = new BehaviorSubject<LoggedUser | null>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoggedUser | null {
    console.log('Current User Value:', this.currentUserSubject.value);
    return this.currentUserSubject.value;
  }

  isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate < new Date();
  }

  
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-in`, { username, password })
      .pipe(map(user => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.userService.getImage.next('/assets/images/placeholder.png');
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, { email, username, password })
      .pipe(map(message => {
        return message;
      }));
  }
}
