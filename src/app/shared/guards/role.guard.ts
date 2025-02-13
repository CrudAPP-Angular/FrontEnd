import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { IAuthState } from "../models/authState.model";

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private store: Store<IAuthState>
    ) { }

    canActivate(): Observable<any> {
        return this.store.select(state => state.user?.role)
    }
}