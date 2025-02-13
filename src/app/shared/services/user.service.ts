import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap, throwError } from 'rxjs';

import { Store } from '@ngrx/store';

import { IUser } from '../models/user.model';
import { AlertService } from './alert.service';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService,
    private store: Store
  ) { }

  private readonly url = environment.USER_API;

  saveUser(data: IUser) {
    return this.httpClient.post(`${this.url}/register`, data).pipe(
      catchError((error: any) => {
        this.alertService.showAlert('Error', error.error.message, 'error');
        return throwError(() => new Error(error.error));
      }),
    )
  }

  uploadFile(file: File, email: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    return this.httpClient.put<{ imageUrl: string }>(`${this.url}/uploadImage`, formData).pipe(
      map((response) => response.imageUrl),
      catchError((error) => {
        console.log(error);
        this.alertService.showAlert('Error', error.error.message, 'error');
        return throwError(() => new Error(error.error));
      }),
    )
  }

  updateUserStatus(email: string) {
    return this.httpClient.put<{ users: IUser[] }>(`${this.url}/updateStatus`, { email }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error("Failed to delete the user."))
      })
    );
  }

  getAllUsers() {
    return this.httpClient.get<{ users: IUser[] }>(`${this.url}/getUsers`).pipe(
      map(response => response.users)
    )
  }

  searchUser(email: string) {
    return this.httpClient.get<{ users: IUser[] }>(`${this.url}/searchUser?email=${email}`).pipe(
      map(response => response.users),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('Sorry, server is not available.'));
      })
    );
  }

}
