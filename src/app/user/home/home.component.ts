import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { HeaderComponent } from '../../core/userHeader/header.component';
import { AuthService } from '../../shared/services/auth.service';
import { IUser } from '../../shared/models/user.model';
import { IAuthState } from '../../shared/models/authState.model';
import { loginSuccess } from '../../auth/store/auth.actions';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  user!: IUser;

  constructor(
    private authService: AuthService,
    private store: Store<{ auth: IAuthState }>,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userData') as string);
    console.log(this.user);

    // this.authService.setUserDetailsInStore('user');
  }

}

