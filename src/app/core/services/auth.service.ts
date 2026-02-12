import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.userKey);
    const token = localStorage.getItem(this.tokenKey);
    
    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      user.token = token;
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.apiService.post<ApiResponse<User>>('auth/login', credentials)
      .pipe(
        map(response => {
          
          if (response.success && response.data) {
            const user = response.data;
            this.setUserSession(user);
            return user;
          }
          throw new Error(response.message || 'Login failed');
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.apiService.post<ApiResponse<User>>('auth/register', userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            const user = response.data;
            this.setUserSession(user);
            return user;
          }
          throw new Error(response.message || 'Registration failed');
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setUserSession(user: User): void {
    if (user.token) {
      localStorage.setItem(this.tokenKey, user.token);
      delete user.token;
    }
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}