import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../services/auth.service";

import { catchError, map, Observable, of, switchMap, tap } from "rxjs";

import { Store } from "@ngrx/store";

import { IAuthState } from "../models/authState.model";
import { AdminLoginFailure, AdminLoginSuccess } from "../../auth/store/auth.actions";
import { IAdmin } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

    constructor(
        private store: Store<{ auth: IAuthState }>,
        private httpClient: HttpClient,
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        return this.store.select(state => state.auth).pipe(
            switchMap((auth) => {
                if (auth.isAdminAuthenticated) {
                    return of(true);
                }

                if (auth.adminToken) {
                    return this.authService.verifyToken(auth.adminToken).pipe(
                        map((valid) => {
                            if (valid) return true;
                            else {
                                this.router.navigate(['/admin/login']);
                                return false;
                            }
                        }),
                        catchError(() => {
                            this.router.navigate(['/admin/login']);
                            return of(false);
                        })
                    );
                }

                const adminDetails = JSON.parse(localStorage.getItem('adminData') as string);

                return this.httpClient.post<{ adminToken: string, admin: IAdmin }>(
                    'http://localhost:3000/api/admin/getAdmin',
                    { email: adminDetails.email },
                    { withCredentials: true })
                    .pipe(
                        map((adminData) => {
                            if (!adminData) return false;
                            this.store.dispatch(AdminLoginSuccess({ token: adminData.adminToken, admin: adminData.admin }));
                            localStorage.setItem('adminData', JSON.stringify(adminData.admin));
                            return true;
                        }),
                        catchError((error) => {
                            console.log(error.error);
                            this.store.dispatch(AdminLoginFailure({ error: error.error.message }));
                            this.router.navigate(['/admin/login']);
                            return of(false);
                        })
                    );
            })
        );
    }

}