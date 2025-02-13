import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Store } from '@ngrx/store';

import { HeaderComponent } from '../../../core/userHeader/header.component';
import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../../shared/services/auth.service';
import { loginRequest } from '../../store/auth.actions';
import { IAuthState } from '../../../shared/models/authState.model';


@Component({
  selector: 'app-user-login',
  imports: [
    HeaderComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,

  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup;

  pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private authservice: AuthService,
    private router: Router,
    private store: Store<IAuthState>,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.pattern)]]
    });
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    this.checkFieldErrors();

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.store.dispatch(loginRequest());

      this.authservice.login(email, password).subscribe({
        next: (userData) => {
          if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
            this.authservice.isAuthenticated().subscribe({
              next: (isAuth) => {
                if (isAuth) {
                  this.router.navigate(['home']);
                } else {
                  localStorage.removeItem('userData');
                  this.router.navigate(['login']);
                }
              },
              error: (error) => {
                console.error(error);
                this.alertService.showAlert('Error', 'Error caught while authenticating', 'error');
              },
              complete: () => console.log('User Authenticated.')
            });
          }
        },
        error: (error) => console.error(error),
      });
    }
  }


  private checkFieldErrors(): void {
    const email = this.loginForm.get('email');
    const password = this.loginForm.get('password');

    if (email?.invalid && email.touched) {
      if (email.hasError('required')) {
        this.alertService.showToast('Email is required', 'error');
      } else if (email.hasError('email')) {
        this.alertService.showToast('Invalid Email', 'error');
      }
    }

    if (password?.invalid && password.touched) {
      if (password.hasError('required')) {
        this.alertService.showToast('Password is required', 'error');
      } else if (password.hasError('pattern')) {
        this.alertService.showToast('Password at least contain one letter, one number, one special character and min length of six characters.', 'error');
      }
    }
  }

  get getField() {
    return (fieldKey: string) => this.loginForm.get(fieldKey);
  }
}
