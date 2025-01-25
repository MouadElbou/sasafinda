
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  ],
  template: `
    <div class="password-dialog">
      <h2 mat-dialog-title>Change Password</h2>
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Current Password</mat-label>
          <input matInput [type]="hideCurrentPassword ? 'password' : 'text'" [(ngModel)]="currentPassword">
          <button mat-icon-button matSuffix (click)="hideCurrentPassword = !hideCurrentPassword">
            <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>New Password</mat-label>
          <input matInput [type]="hideNewPassword ? 'password' : 'text'" [(ngModel)]="newPassword">
          <button mat-icon-button matSuffix (click)="hideNewPassword = !hideNewPassword">
            <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm New Password</mat-label>
          <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" [(ngModel)]="confirmPassword">
          <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword">
            <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="updatePassword()">Save Changes</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .password-dialog {
      padding: 20px;
      min-width: 350px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    mat-dialog-actions {
      margin-top: 20px;
    }
  `]
})
export class PasswordDialogComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<PasswordDialogComponent>,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  updatePassword() {
    if (this.currentPassword !== this.authService.getPassword()) {
      this.showError('Current password is incorrect');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showError('New passwords do not match');
      return;
    }

    if (this.newPassword.length < 6) {
      this.showError('Password must be at least 6 characters long');
      return;
    }

    this.authService.setPassword(this.newPassword);
    this.snackBar.open('Password updated successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    this.dialogRef.close(true);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
