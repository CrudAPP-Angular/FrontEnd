import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../../core/sideMenu/sideMenu.component';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAuthState } from '../../shared/models/authState.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    SideBarComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  authState$!: Observable<IAuthState>;

  constructor(private store: Store<{ auth: IAuthState }>) { }

  ngOnInit(): void {
    this.authState$ = this.store.select(state => state.auth);
  }
}
