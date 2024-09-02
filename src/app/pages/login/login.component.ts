import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../service/toast.service';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    ToastModule,
    ThemeToggleComponent,
    TranslateModule,
  ],
  template: `
    <div class="main">
      <p-toast></p-toast>
      <app-theme-toggle />
      <div class="photo-container"></div>
      <div class="backdrop"></div>
      <div class="welcome-container">
        <app-theme-toggle />
        <div class="login-container">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="login-logo"></div>
            <div class="input-fields">
              <label for="email">{{ 'login.email' | translate }}</label>
              <input id="email" formControlName="email" type="email" />
              <label for="password">{{ 'login.password' | translate }}</label>
              <input id="password" formControlName="password" type="password" />
            </div>
            <div class="button-group">
              <p-button
                styleClass="login-button"
                [label]="'login.loginButton' | translate"
                [loading]="loading"
                [disabled]="loginForm.invalid"
                class="p-button-md"
                (click)="onSubmit()"
              ></p-button>
              <p-button
                styleClass="register-button"
                [label]="'login.registerButton' | translate"
                [disabled]="loading"
                routerLink="/register"
              ></p-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false; // Tracking loading state.
  backgroundUrl = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true; // Set loading state to true
      const { email, password } = this.loginForm.value;
      this.apiService.login({ email, password }).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body != null) {
            this.apiService.saveCredentials(response.body.token, response.body.id);
            this.toastService.showToast(
              'success',
              this.translate.instant('toastMessages.successTitle'),
              this.translate.instant('toastMessages.loginSuccess')
            );
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
              this.loading = false; // Set loading state to false
            }, 1000);
          }
        },
        error: (err) => {
          this.toastService.showToast(
            'error',
            this.translate.instant('toastMessages.errorTitle'),
            err.error.message || this.translate.instant('toastMessages.loginFailed')
          );
          this.loading = false; // Set loading state to false
        },
      });
    }
  }
}
