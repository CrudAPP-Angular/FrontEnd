import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { catchError, map, Observable, of, switchMap } from "rxjs";

import { isAuthenticated, loginFailure, loginSuccess } from "../../auth/store/auth.actions";
import { IAuthState } from "../models/authState.model";
import { AuthService } from "../services/auth.service";
import { AlertService } from "../services/alert.service";


@Injectable({ providedIn: "root" })
export class LoginGuard implements CanActivate {
    constructor(
        private store: Store<IAuthState>,
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router,

    ) { }

    canActivate(): Observable<any> {
        return this.store.select(state => state.token).pipe(
            switchMap((token) => {                
                if (token) {
                    return this.authService.verifyToken(token).pipe(
                        map((isVerified) => {
                            this.store.dispatch(isAuthenticated({ isAuthenticated: isVerified }));
                            this.router.navigate(['home']);
                            return isVerified;
                        }),
                        catchError((error) => {
                            this.store.dispatch(loginFailure(error));
                            this.router.navigate(['login']);
                            this.alertService.showAlert('Authentication Error', error, 'error');
                            return of(false);
                        })
                    );
                } else {
                    return this.authService.getToken('userToken').pipe(
                        map((userToken) => {
                            if (!userToken) return false;
                            const userData = JSON.parse(localStorage.getItem('userData') as string);
                            this.store.dispatch(loginSuccess({ token: userToken, user: userData }));
                            this.router.navigate(['home']);
                            return true;
                        }),
                        catchError(() => of(true))
                    );
                }
            })
        );
    }

}