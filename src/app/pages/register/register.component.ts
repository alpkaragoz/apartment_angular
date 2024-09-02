import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../service/toast.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ToastModule, TranslateModule],
  template: `
    <div class="main">
      <div class="backdrop"></div>
      <p-toast></p-toast>
      <div class="register-container">
        <div class="register-form">
          <h2>{{ 'register.joinUs' | translate }}</h2>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" [class.loading]="loading">
            <div>
              <label for="email">{{ 'register.emailLabel' | translate }}</label>
              <input id="email" formControlName="email" type="email" [disabled]="loading" />
            </div>
            <div>
              <label for="password">{{ 'register.passwordLabel' | translate }}</label>
              <input id="password" formControlName="password" type="password" [disabled]="loading" />
            </div>
            <p-button
              label="{{ 'register.buttonLabel' | translate }}"
              [disabled]="registerForm.invalid"
              [loading]="loading"
              severity="success"
              (click)="onSubmit()"
            ></p-button>
          </form>
        </div>
      </div>
      <div class="photo-container"></div>
    </div>
  `,
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private translate: TranslateService // Inject TranslateService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const { email, password } = this.registerForm.value;
      this.apiService.register({ email, password }).subscribe({
        next: (response) => {
          if (response.status == 200 && response.body != null) {
            this.loading = false;
            this.toastService.showToast(
              'success',
              this.translate.instant('toastMessages.successTitle'),
              this.translate.instant('toastMessages.genericSuccess')
            );
          }
        },
        error: (err) => {
          if (err.status === 409) {
            this.toastService.showToast(
              'error',
              this.translate.instant('toastMessages.errorTitle'),
              this.translate.instant('toastMessages.emailInUse')
            );
          } else {
            this.toastService.showToast(
              'error',
              this.translate.instant('toastMessages.errorTitle'),
              this.translate.instant('toastMessages.genericError')
            );
          }
          this.loading = false;
        },
      });
    }
  }
}
