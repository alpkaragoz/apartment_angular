import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, ButtonModule, ToastModule],
  template: `
    <div class="main">
      <p-toast></p-toast>
      <div class="photo-container"></div>
      <div class="welcome-container">
        <p class="welcome-text">Welcome to Apartment Hunter</p>
        <div class="login-container">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <h1>⌂</h1>
            <div>
              <label for="email">Email</label>
              <input id="email" formControlName="email" type="email"/>
              <label for="password">Password</label>
              <input id="password" formControlName="password" type="password"/>
            </div>
            <div class="button-group">
              <p-button styleClass="login-button" label="Login" [loading]="loading" [disabled]= "loginForm.invalid" class="p-button-md" (click)="onSubmit()"/>
              <p-button styleClass="register-button" label="Register" [disabled]="loading" routerLink="/register"/>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;  // Tracking loading state.

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;  // Set loading state to true
      const { email, password } = this.loginForm.value;
      this.apiService.login({ email, password }).subscribe({
        next: (response) => {
          if(response.status === 200) {
            this.apiService.saveToken(response.body.token);
            this.toastService.showToast('success', 'Success', response.body. message);
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
              this.loading = false;  // Set loading state to false
            }, 1000); // Redirect after 1 second
          }
        },
        error: (err) => {
          this.toastService.showToast('error', 'Error', err.error.message);
          this.loading = false;  // Set loading state to false
        }
      });
    }
  }
}
