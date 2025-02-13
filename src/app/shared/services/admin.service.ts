import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { catchError, map, throwError } from "rxjs";

import { IAdmin, IUser } from "../models/user.model";
import { AlertService } from "./alert.service";
import { environment } from "../../../environment";


@Injectable({
    providedIn: 'root',

})
export class AdminService {

    constructor(
        private httpClient: HttpClient,
        private alertService: AlertService,
    ) { }

    private readonly apiUrl = environment.ADMIN_API;

    saveAdmin(adminData: IUser) {
        return this.httpClient.post<{ message: string }>(`${this.apiUrl}/register`, adminData).pipe(
            map((response) => {
                return response.message;
            }),
            catchError((error) => {
                console.error(error);
                if (error.status === 400) {
                    this.alertService.showToast('User already exists.', 'error');
                    return throwError(() => new Error(''));
                } else {
                    return throwError(() => new Error('Something went wrong while registering.'))
                }
            })
        )
    }

    changeAdminStatus(email: string) {
        return this.httpClient.put(`${this.apiUrl}/changeStatus`, { email }).pipe(
            catchError((error) => {
                console.error(error);
                return throwError(() => new Error('something bad happened.'))
            })
        );
    }

    loadAdmins() {
        return this.httpClient.get<{ admins: IAdmin[] }>(`${this.apiUrl}/loadAdmins`).pipe(
            map(response => response.admins),
            catchError((error) => {
                console.error(error);
                return throwError(() => new Error('Error while fetching admins.'));
            })
        );
    }

}