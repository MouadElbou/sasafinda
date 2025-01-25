import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IpcService } from '../services/ipc.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    TranslateModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule 
  ],
    providers: [ThemeService],
  template: `
  <div class="settings-container">
    <h1>{{ 'settings.title' | translate }}</h1>
    
    <mat-card class="settings-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>language</mat-icon>
        <mat-card-title>{{ 'settings.language.title' | translate }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'settings.language.select' | translate }}</mat-label>
          <mat-select [(ngModel)]="selectedLanguage" (selectionChange)="onLanguageChange()">
            <mat-option value="en">{{ 'settings.language.english' | translate }}</mat-option>
            <mat-option value="fr">{{ 'settings.language.french' | translate }}</mat-option>
            <mat-option value="ar">{{ 'settings.language.arabic' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card-content>
    </mat-card>

    <!-- <mat-card class="settings-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>palette</mat-icon>
        <mat-card-title>{{ 'settings.appearance.title' | translate }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="setting-row">
          <span>{{ 'settings.appearance.darkMode' | translate }}</span>
          <mat-slide-toggle [(ngModel)]="darkMode" (change)="onThemeChange()"></mat-slide-toggle>
        </div>
      </mat-card-content>
    </mat-card> -->

    <mat-card class="settings-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>account_circle</mat-icon>
        <mat-card-title>{{ 'settings.account.title' | translate }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="setting-row" (click)="openPasswordDialog()">
          <span>{{ 'settings.account.changePassword' | translate }}</span>
          <mat-icon class="action-icon">edit</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="settings-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>backup</mat-icon>
        <mat-card-title>{{ 'settings.backup.title' | translate }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="setting-row">
          <button mat-raised-button color="primary" (click)="exportDatabase()">
            <mat-icon>cloud_download</mat-icon>
            {{ 'settings.backup.export' | translate }}
          </button>
          <button mat-raised-button color="accent" (click)="importDatabase()">
            <mat-icon>cloud_upload</mat-icon>
            {{ 'settings.backup.import' | translate }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
  `,  styles: [`
    .settings-container {
      padding: 32px;
      background: var(--background-color);
      min-height: calc(100vh - 64px);
    }

    h1 {
      color: var(--text-color);
      margin-bottom: 24px;
      font-weight: 500;
    }

    .settings-card {
      max-width: 600px;
      margin: 0 auto 24px;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      background-color: var(--card-background);
      color: var(--text-color);
    }

    .settings-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    mat-card-title {
      font-size: 1.2rem;
      color: var(--text-color);
    }

    mat-form-field {
      width: 100%;
      margin-top: 16px;
    }

    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .action-icon {
      color: var(--text-color);
      cursor: pointer;
    }

    .action-icon:hover {
      color: var(--accent-color, #3498db);
    }

    mat-divider {
      margin: 8px 0;
    }

    mat-icon {
      margin-right: 8px;
    }

    ::ng-deep .mat-mdc-slide-toggle {
      margin: 0 8px;
    }

    .backup-section {
      display: flex;
      gap: 16px;
      padding: 16px 0;
    }

    .backup-button {
      flex: 1;
      padding: 16px !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .backup-button mat-icon {
      margin-right: 8px;
    }

    .export-button {
      background: var(--primary-color, #2196f3) !important;
      color: white !important;
    }

    .import-button {
      background: var(--accent-color, #ff4081) !important;
      color: white !important;
    }

    .backup-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
  `]})
export class SettingsComponent {
  selectedLanguage = 'en';
  darkMode = false;
  notifications = true;
  newPassword: string = '';

  constructor(
    private readonly translate: TranslateService,
    private themeService: ThemeService
    ,    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly ipc: IpcService,
  ) {
    this.darkMode = this.themeService.getCurrentTheme();

    // Get the current language from localStorage
    this.selectedLanguage = localStorage.getItem('preferredLanguage') ?? 'en';
    
    // Set the language
    translate.use(this.selectedLanguage);
    
    // Initialize other settings
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.notifications = localStorage.getItem('notifications') !== 'false';
    
    this.applyTheme();
  }

  ngOnInit() {
    console.log('Current language:', this.translate.currentLang);
    this.translate.get('settings.title').subscribe(res => {
      console.log('Translated title:', res);
    });
  }

  onLanguageChange() {
    localStorage.setItem('preferredLanguage', this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
    document.documentElement.dir = this.selectedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = this.selectedLanguage;
  }

  onThemeChange() {
    this.themeService.toggleDarkMode();

  }

  openPasswordDialog() {
    this.dialog.open(PasswordDialogComponent, {
      width: '400px',
      disableClose: true
    });
  }
  onNotificationChange() {
    localStorage.setItem('notifications', this.notifications.toString());
  }

  private applyTheme() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  async exportDatabase() {
    try {
      await this.ipc.exportDatabase();
      this.snackBar.open('Database exported successfully', 'Close', {
        duration: 3000
      });
    } catch (error) {
      this.snackBar.open('Failed to export database', 'Close', {
        duration: 3000
      });
    }
  }

  async importDatabase() {
    try {
      await this.ipc.importDatabase();
      this.snackBar.open('Database imported successfully', 'Close', {
        duration: 3000
      });
    } catch (error) {
      this.snackBar.open('Failed to import database', 'Close', {
        duration: 3000
      });
    }
  }}
