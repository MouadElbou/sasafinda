import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    TranslateModule
  ],
  template: `
    <div class="sidebar-container">
      <div class="nav-items">
        <a class="nav-item" routerLink="/dashboard" routerLinkActive="active">
          <div class="icon-card">
            <mat-icon>dashboard</mat-icon>
          </div>
          <span class="nav-label">{{ 'sidebar.dashboard' | translate }}</span>
        </a>

        <a class="nav-item" routerLink="/orders" routerLinkActive="active">
          <div class="icon-card">
            <mat-icon>print</mat-icon>
          </div>
          <span class="nav-label">{{ 'sidebar.orders' | translate }}</span>
        </a>

        <a class="nav-item" routerLink="/customers" routerLinkActive="active">
          <div class="icon-card">
            <mat-icon>people</mat-icon>
          </div>
          <span class="nav-label">{{ 'sidebar.customers' | translate }}</span>
        </a>

        <a class="nav-item" routerLink="/purchase" routerLinkActive="active">
          <div class="icon-card">
            <mat-icon>shopping_cart</mat-icon>
          </div>
          <span class="nav-label">{{ 'sidebar.purchase' | translate }}</span>
        </a>

        <a class="nav-item" routerLink="/cash-desk" routerLinkActive="active">
          <div class="icon-card">
            <mat-icon>point_of_sale</mat-icon>
          </div>
          <span class="nav-label">{{ 'sidebar.cashDesk' | translate }}</span>
        </a>

        <a class="nav-item" routerLink="/settings" routerLinkActive="active">
          <div class="icon-card">
            <mat-icon>settings</mat-icon>
          </div>
          <span class="nav-label">{{ 'sidebar.settings' | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px; /* Height of your header */
    }

    .mat-drawer.mat-sidenav {
      transform: none !important;
      position: fixed;
      left: 0;
      top: 64px; /* Height of your header */
      height: calc(100vh - 64px);
    }

    [dir="rtl"] .mat-drawer.mat-sidenav {
      left: 0;
      right: auto;
    }

    .mat-sidenav-content {
      margin-left: 73px !important;
      margin-right: 0 !important;
    }

    .sidebar-container {
      position: fixed;
      left: 0;
      padding: 12px;
      height: calc(100% - 24px);
      width: 73px;
      background: white;
      z-index: 2000;  
      overflow: hidden;
    }

    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      width: 100%;
    }

    .nav-item {
      width: 76px;
      height: 76px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: #2c3e50;
      padding: 8px;
      border-radius: 12px;
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
      position: relative;
      overflow: hidden;
    }

    .icon-card {
      width: 46px;
      height: 46px;
      background: #f8f9fa;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
      position: relative;
      z-index: 1;
    }

    .icon-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 14px;
      background: linear-gradient(135deg, #FFC107, #FFD54F);
      opacity: 0;
      transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .icon-card mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #FFC107;
      transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;
      position: relative;
    }

    .nav-label {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .nav-item:hover {
      background: rgba(255, 193, 7, 0.08);
      transform: translateY(-2px);
    }

    .nav-item:hover .icon-card {
      background: white;
      box-shadow: 0 4px 8px rgba(255, 193, 7, 0.2);
      transform: scale(1.05);
    }

    .nav-item.active {
      background: rgba(255, 193, 7, 0.12);
    }

    .nav-item.active .icon-card::after {
      opacity: 1;
    }

    .nav-item.active .icon-card mat-icon {
      color: white;
    }

    .nav-item.active .nav-label {
      color: #FFC107;
      font-weight: 600;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: #FFC107;
      border-radius: 0 4px 4px 0;
      transition: height 0.3s ease;
    }

    .nav-item.active::before {
      height: 60%;
    }
  `]
})
export class SidebarComponent {}
