import { Component, OnInit } from "@angular/core";

import { SideBarComponent } from "../../core/sideMenu/sideMenu.component";
import { IUser } from "../../shared/models/user.model";
import { AdminService } from "../../shared/services/admin.service";
import { CommonModule } from "@angular/common";
import { AlertService } from "../../shared/services/alert.service";

@Component({
    selector: 'app-adminPage',
    templateUrl: './admin.component.html',
    imports: [SideBarComponent, CommonModule]
})
export class adminPageComponent implements OnInit {

    admins: IUser[] = [];

    constructor(
        private adminService: AdminService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.loadAdmins();
    }

    changeAdminStatus(email: string) {
        this.adminService.changeAdminStatus(email).subscribe({
            next: () => {
                this.alertService.showToast('Status changed.', 'success');
                this.loadAdmins();
            },
            error: (error) => this.alertService.showAlert('Error', error, 'error')
        });
    }

    private loadAdmins() {
        this.adminService.loadAdmins().subscribe(admins => {
            this.admins = admins;
        });
    }
}