import { Component, Output, EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
declare global {
  interface Window {
    require: any;
  }
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar class="header">
      <div class="left-section">
        <button mat-icon-button (click)="toggleSidenav.emit()" class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
      </div>

      <div class="center-section">
        <img src="assets/logo.png" alt="Logo" class="toolbar-logo">
      </div>

      <div class="window-controls">
        <button mat-icon-button (click)="minimize()">
          <mat-icon>remove</mat-icon>
        </button>
        <button mat-icon-button (click)="maximize()">
          <mat-icon>crop_square</mat-icon>
        </button>
        <button mat-icon-button class="close-btn" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      -webkit-app-region: drag;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
      height: 64px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .left-section {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .center-section {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .window-controls {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      -webkit-app-region: no-drag;
    }

    .window-controls button {
      height: 32px;
      width: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }

    .window-controls .mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      line-height: 18px;
    }

    .toolbar-logo {
      height: 40px;
      transition: transform 0.2s ease;
    }
  `]})export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  private readonly ipcRenderer = window.require('electron').ipcRenderer;

  minimize() {
    this.ipcRenderer.send('minimize-window');
  }

  maximize() {
    this.ipcRenderer.send('maximize-window');
  }

  close() {
    this.ipcRenderer.send('close-window');
  }
}