import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { SideBarComponent } from "../../core/sideMenu/sideMenu.component";
import { UserService } from "../../shared/services/user.service";
import { IUser } from "../../shared/models/user.model";
import { AlertService } from "../../shared/services/alert.service";

@Component({
    selector: 'app-userPage',
    imports: [
        SideBarComponent,
        CommonModule,
        FormsModule
    ],
    templateUrl: './user.component.html'
})
export class UserPageComponent implements OnInit {

    users: IUser[] = [];
    input: string = '';

    constructor(
        private userService: UserService,
        private alertService: AlertService,
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    private loadUsers() {
        this.userService.getAllUsers().subscribe(users => {
            this.users = users;
        });
    }

    toggleStatus(email: string) {
        this.userService.updateUserStatus(email).subscribe({
            next: () => {
                this.loadUsers();
                this.alertService.showToast('Status changed.', 'success');
            },
            error: err => this.alertService.showToast('Status not changed.', 'error')

        });
    }

    searchUser(email: string) {
        this.userService.searchUser(email).subscribe({
            next: (users) => this.users = users,
            error: (error) => this.alertService.showAlert('Error', error, 'error'),
        });
    }
}