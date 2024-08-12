import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ToastModule],
  template: `
    <div class="main">
      <p-toast></p-toast>
      <div class="register-container">
        <div class="register-form">
          <h2>Join Us! ↓</h2>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" [class.loading]="loading">
            <div>
              <label for="email">Email</label>
              <input id="email" formControlName="email" type="email" [disabled]="loading" />
            </div>
            <div>
              <label for="password">Password</label>
              <input id="password" formControlName="password" type="password" [disabled]="loading" />
            </div>
              <p-button label="Register" [disabled]="registerForm.invalid" [loading]="loading" severity="success" (click)="onSubmit()"></p-button>
          </form>
        </div>
      </div>
      <div class="photo-container"></div>
    </div>
  `,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const { email, password } = this.registerForm.value;
      this.apiService.register({ email, password }).subscribe({
        next: (response) => {
          if (response.status == 200) {
            this.loading = false;
            this.toastService.showToast('success', 'Success', response.body.message);
            setTimeout(() => {
            }, 1000); // Redirect after 2 seconds
          };
        },
        error: (err) => {
          this.toastService.showToast('error', 'Error', err.error.message);
          this.loading = false;
        },
      });
    }
  }
}
