import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AdminLoginFailure, AdminLoginSuccess, loginFailure, loginSuccess, logout } from '../../auth/store/auth.actions';
import { AlertService } from './alert.service';
import { IAdmin, IUser } from '../models/user.model';
import { IAuthState } from '../models/authState.model';
import { environment } from '../../../environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private store: Store<{ auth: IAuthState }>,
    private alertService: AlertService,
    private router: Router
  ) { }

  private readonly apiUrl = environment.AUTH_API;

  login(email: string, password: string) {
    return this.httpClient.post<{ accessToken: string, user: IUser }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response) {
            this.store.dispatch(loginSuccess({ token: response.accessToken, user: response.user }));
          }
        }),
        map((response) => response.user),
        catchError((error) => {
          this.store.dispatch(loginFailure({ error: error.error.message }));
          this.alertService.showToast(error.error.message, 'error');
          return throwError(() => new Error(error.error.message));
        })
      );
  }

  adminLogin(email: string, password: string) {
    return this.httpClient.post<{ accessToken: string, admin: IAdmin }>(`${this.apiUrl}/adminLogin`, { email, password })
      .pipe(
        tap((response) => {
          if (response) {
            this.store.dispatch(AdminLoginSuccess({ token: response.accessToken, admin: response.admin }));
          }
        }),
        map(response => response.admin),
        catchError((error) => {
          this.store.dispatch(AdminLoginFailure({ error: 'Admin login failed.' }));
          this.alertService.showToast(error.error.message, 'error');
          return throwError(() => new Error(error.error.message))
        })
      );
  }

  getToken(cookieName: string) {
    return this.httpClient.get<{ token: string }>(`${this.apiUrl}/getToken?cookieName=${cookieName}`).pipe(
      map((response) => {
        return response.token;
      })
    );
  }

  verifyToken(tokenValue: string) {
    return this.httpClient.post<{ status: boolean, message: string }>(`${this.apiUrl}/verifyToken`, { tokenValue }).pipe(
      map((res) => {
        return res.status;
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('Token verification failed.'));
      })
    )
  }

  logout(tokenValue: string) {
    return this.httpClient.get<{ message: string }>(`${this.apiUrl}/logout?tokenValue=${tokenValue}`).pipe(
      map((response) => response.message),
      catchError(() => {
        return throwError(() => new Error('Error caught while logging out.'));
      })
    );
  }

  isAuthenticated() {
    return this.store.select(state => state.auth).pipe(
      map((auth) => {
        return auth.isAuthenticated;
      })
    );
  }

}
