import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../../core/userHeader/header.component';
import { matchPasswordValidator } from '../../../shared/validators/matchPassword.validator';
import { AlertService } from '../../../shared/services/alert.service';
import { UserService } from '../../../shared/services/user.service';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-register',
  imports: [
    HeaderComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;


  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private userService: UserService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.pattern)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.pattern)]]
    }, {
      validators: matchPasswordValidator('password', 'confirmPassword')
    });
  }


  onSubmitForm(): void {
    this.registerForm.markAsTouched();
    this.checkFieldErrors();

    if (this.registerForm.valid) {
      const username = this.registerForm.get('username')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;

      this.userService.saveUser({ username, email, password })
        .subscribe({
          next: (response) => {
            if (response) this.router.navigate(['login']);
          },
          error: (error) => console.log(error.message),
          complete: () => console.log('user registered successfully.')
        });
    }
  }

  private checkFieldErrors(): void {
    const username = this.registerForm.get('username');
    const email = this.registerForm.get('email');
    const password = this.registerForm.get('password');
    const confirmPassword = this.registerForm.get('confirmPassword');

    if (username?.invalid && username.touched) {
      if (username.hasError('required')) {
        this.alertService.showToast('Username is required', 'error');
      } else if (username.hasError('minLength')) {
        this.alertService.showToast('Username must be at least 4 characters long.', 'error');
      }
    }

    if (email?.invalid && email.touched) {
      if (email.hasError('required')) {
        this.alertService.showToast('Email is required.', 'error');
      } else if (email.hasError('email')) {
        this.alertService.showToast('Invalid email', 'error');
      }
    }

    if (password?.invalid && password.touched) {
      if (password.hasError('required')) {
        this.alertService.showToast('Password is required', 'error');
      } else if (password.hasError('pattern')) {
        this.alertService.showToast('Password at least contain one letter, one number, one special character and min length of six characters.', 'error');
      }
    }

    if (confirmPassword?.invalid && confirmPassword.touched) {
      if (confirmPassword.hasError('required')) {
        this.alertService.showToast('Confirm password is required.', 'error');
      } else if (confirmPassword.hasError('passwordMissMatch')) {
        this.alertService.showToast('Passwords do not match.', 'error');
      }
    }
  }

  get getField() {
    return (fieldKey: string) => this.registerForm.get(fieldKey);
  }

}
