import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";

import { matchPasswordValidator } from "../../../shared/validators/matchPassword.validator";
import { AlertService } from "../../../shared/services/alert.service";
import { AdminService } from "../../../shared/services/admin.service";

@Component({
    selector: 'app-adminRegister',
    templateUrl: './adminRegister.component.html',
    imports: [
        ReactiveFormsModule,
        RouterLink
    ]
})
export class AdminRegisterComponent implements OnInit {
    registerAdminForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private alertService: AlertService,
        private adminService: AdminService,

    ) { }

    pattern: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    ngOnInit(): void {
        this.registerAdminForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern(this.pattern)]],
            confirmPassword: ['', Validators.required]
        }, {
            validators: matchPasswordValidator('password', 'confirmPassword'),
        });
    }

    submitForm(): void {
        this.registerAdminForm.markAllAsTouched();
        this.checkValidationErrors();

        if (this.registerAdminForm.valid) {
            const username = this.registerAdminForm.get('username')?.value;
            const email = this.registerAdminForm.get('email')?.value;
            const password = this.registerAdminForm.get('password')?.value;

            this.adminService.saveAdmin({ username, email, password }).subscribe({
                next: ((response) => console.log(response)),
                error: (error => {
                    if (error === '') {
                        this.alertService.showAlert('Login Error', error, 'error');
                    }
                })
            })
        }

    }

    private checkValidationErrors(): void {
        const username = this.registerAdminForm.get('username');
        const email = this.registerAdminForm.get('email');
        const password = this.registerAdminForm.get('password');
        const confirmPassword = this.registerAdminForm.get('confirmPassword');

        if (username?.invalid && username.touched) {
            if (username.hasError('required')) {
                this.alertService.showToast('Username is required', 'error');
                return;
            } else if (username.hasError('minLength')) {
                this.alertService.showToast('Username must be at least 4 characters long.', 'error');
                return;
            }
        }

        if (email?.invalid && email.touched) {
            if (email.hasError('required')) {
                this.alertService.showToast('Email is required.', 'error');
                return;
            } else if (email.hasError('email')) {
                this.alertService.showToast('Invalid email', 'error');
                return;
            }
        }

        if (password?.invalid && password.touched) {
            if (password.hasError('required')) {
                this.alertService.showToast('Password is required', 'error');
                return;
            } else if (password.hasError('pattern')) {
                this.alertService.showToast('Password at least contain one letter, one number, one special character and min length of six characters.', 'error');
                return;
            }
        }

        if (confirmPassword?.invalid && confirmPassword.touched) {
            if (confirmPassword.hasError('required')) {
                this.alertService.showToast('Confirm password is required.', 'error');
                return;
            } else if (confirmPassword.hasError('passwordMissMatch')) {
                this.alertService.showToast('Passwords do not match.', 'error');
                return;
            }
        }
    }
}