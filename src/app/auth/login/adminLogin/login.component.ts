import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Store } from '@ngrx/store';
import { AdminLoginRequest } from '../../store/auth.actions';
import { IAdmin } from '../../../shared/models/user.model';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class AdminLoginComponent implements OnInit {
  adminLoginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService,
    private store: Store,
    private router: Router,
  ) { }

  pattern: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  ngOnInit(): void {
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.pattern)]]
    });
  }

  adminLoginSubmit(): void {
    this.adminLoginForm.markAllAsTouched();
    this.checkFormValidation();

    if (this.adminLoginForm.valid) {
      const email = this.adminLoginForm.get('email')?.value;
      const password = this.adminLoginForm.get('password')?.value;

      this.store.dispatch(AdminLoginRequest());

      this.authService.adminLogin(email, password).subscribe({
        next: (adminData: IAdmin) => {
          localStorage.setItem('adminData', JSON.stringify(adminData));
          this.router.navigate(['admin/dashboard']);
        },
        error: (error) => console.log(error),
        complete: () => console.log('Admin logged in.')
      });
    }
  }

  private checkFormValidation(): void {
    const email = this.adminLoginForm.get('email');
    const password = this.adminLoginForm.get('password');

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
  }

}
