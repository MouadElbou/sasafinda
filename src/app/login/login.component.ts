import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule
    ],
    template: `
      <div class="login-container">
        <mat-card class="login-card">
          <div class="logo-container">
            <img src="assets/logo.png" alt="Logo" class="logo">
          </div>
          <mat-card-header>
            <mat-card-title>Welcome Back!</mat-card-title>
            <mat-card-subtitle>Sign in to Sasafinda Print Shop</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="password" placeholder="Enter your password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="login()" class="login-button">
              <mat-icon>login</mat-icon>
              <span>Sign In</span>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    `,
    styles: [`
      .login-container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
      }
      .login-card {
        min-width: 350px;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
      }
      .logo-container {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .logo {
        width: 120px;
        height: auto;
        margin-bottom: 1rem;
      }
      mat-card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      mat-card-title {
        color: #FFC107;
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      mat-card-subtitle {
        color: #666;
        font-size: 1rem;
      }
      mat-form-field {
        width: 100%;
      }
      .login-button {
        width: 100%;
        margin-top: 1rem;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 25px;
        background: linear-gradient(135deg,rgb(5, 4, 0) 0%,rgb(0, 0, 0) 100%);
        color: black;
        transition: transform 0.2s ease;
      }
      .login-button:hover {
        transform: translateY(-2px);
      }
      .login-button mat-icon {
        margin-right: 8px;
      }
      ::ng-deep .mat-form-field-outline {
        color: #FFC107 !important;
      }
      ::ng-deep .mat-form-field-label {
        color: #FFC107 !important;
      }
      @media (max-width: 400px) {
        .login-card {
          min-width: 90%;
          margin: 1rem;
        }
      }
    `]
})
export class LoginComponent {
    password: string = '';
    hidePassword = true;

    login() {
      if (this.password === 'admin123') {
        console.log('Login successful');
      }
    }
}