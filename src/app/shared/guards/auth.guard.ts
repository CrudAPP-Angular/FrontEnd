import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { catchError, map, Observable, of, switchMap, take } from "rxjs";

import { AuthService } from "../services/auth.service";
import { IAuthState } from "../models/authState.model";
import { isAuthenticated, loginFailure, loginSuccess } from "../../auth/store/auth.actions";
import { AlertService } from "../services/alert.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        private store: Store<{ auth: IAuthState }>,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService,
    ) { }

    canActivate(): Observable<boolean> {
        console.log('guard activated');

        return this.authService.isAuthenticated().pipe(
            switchMap((isAuth) => {
                if (isAuth) {
                    return of(true);
                } else {
                    return this.store.select(state => state.auth).pipe(
                        switchMap((auth) => {
                            if (auth.token) {
                                return this.authService.verifyToken(auth.token).pipe(
                                    map((isVerified) => {
                                        this.store.dispatch(isAuthenticated({ isAuthenticated: isVerified }));
                                        return isVerified;
                                    }),
                                    catchError((error) => {
                                        this.store.dispatch(loginFailure(error));
                                        this.alertService.showAlert("Authentication Error", error, 'error');
                                        this.router.navigate(['login']);
                                        return of(false);
                                    })
                                );
                            }
                            else {
                                return this.authService.getToken('userToken').pipe(
                                    map((userToken) => {
                                        if (userToken) {
                                            const userData = JSON.parse(localStorage.getItem('userData') as string);
                                            this.store.dispatch(loginSuccess({ token: userToken, user: userData }));
                                            return true;
                                        } else {
                                            this.alertService.showToast('Please login', 'info');
                                            this.router.navigate(['login']);
                                            return false;
                                        }
                                    }),
                                    catchError(() => {
                                        this.store.dispatch(loginFailure({ error: 'Token expired' }));
                                        this.alertService.showToast('Please login', 'info')
                                        this.router.navigate(['login']);
                                        return of(false);
                                    })
                                );
                            }
                        })
                    );
                }
            })
        );
    }
}