import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'app_password';
  
  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.setPassword('admin123');
    }
  }

  getPassword(): string {
    return localStorage.getItem(this.STORAGE_KEY) || 'admin123';
  }

  setPassword(newPassword: string): void {
    localStorage.setItem(this.STORAGE_KEY, newPassword);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('authenticated') === 'true';
  }

  authenticate() {
    localStorage.setItem('authenticated', 'true');
  }
}