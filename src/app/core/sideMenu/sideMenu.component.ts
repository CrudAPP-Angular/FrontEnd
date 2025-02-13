import { Component, computed, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { IAuthState } from "../../shared/models/authState.model";
import { AuthService } from "../../shared/services/auth.service";
import { logout } from "../../auth/store/auth.actions";
import { AlertService } from "../../shared/services/alert.service";


@Component({
    selector: 'app-side',
    templateUrl: './sideMenu.component.html',
    imports: [
        CommonModule,
        RouterLink,]
})
export class SideBarComponent implements OnInit {
    authState$!: Observable<IAuthState>;

    constructor(
        private store: Store<{ auth: IAuthState }>,
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.authState$ = this.store.select(state => state.auth);
    }

    logout() {
        this.authService.logout('adminToken').subscribe({
            next: (response) => {
                if (response) {
                    console.log(response)
                    localStorage.removeItem('adminToken');

                    this.store.dispatch(logout())
                    this.router.navigate(['/admin/login']);
                }
            },
            error: (error) => {
                this.alertService.showAlert("Error", error, 'error');
            }
        });
    }
}
