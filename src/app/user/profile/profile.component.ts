import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { HeaderComponent } from '../../core//userHeader/header.component';
import { IUser } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { AlertService } from '../../shared/services/alert.service';
import { logout } from '../../auth/store/auth.actions';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  profileImage: string = '';
  user!: IUser;

  constructor(
    private store: Store,
    private userService: UserService,
    private alertService: AlertService,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    this.user = JSON.parse(userData as string);

    if (this.user?.profileImage) {
      this.profileImage = `http://localhost:3000${this.user?.profileImage}`;
    }

    
  }

  //* triggers the file input.
  triggerFileInput() {
    this.renderer.selectRootElement(this.fileInput.nativeElement).click()
  }

  //* catches the change event on file input.
  onFileSelect(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput && fileInput.files) {
      const file = fileInput.files[0];
      if (file) {
        this.uploadFile(file, this.user.email);
      } else {
        this.alertService.showAlert('Error', 'File not uploaded. Try again.', 'error')
      }
    }
  }

  logout() {
    this.authService.logout('userToken').subscribe({
      next: (response) => {
        if (response) {
          this.store.dispatch(logout());
          localStorage.removeItem('userData');
          this.router.navigate(['login']);
        }
      },
      error: (error) => {
        this.alertService.showAlert("Error", error, 'error');
      }
    });
  }

  //* send request to server
  private uploadFile(file: File, email: string) {
    this.userService.uploadFile(file, email).subscribe({
      next: (imageUrl) => {
        if (imageUrl) {
          this.user!.profileImage = imageUrl;
          localStorage.setItem('userData', JSON.stringify(this.user));
          this.alertService.showToast('Image uploaded successfully', 'success');
        }
      },
      error: (error) => console.error(error),
      complete: () => console.log('file has been uploaded.')
    });
  }


}
