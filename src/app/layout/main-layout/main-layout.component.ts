import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, MatSidenavModule, MatIconModule],
  template: `
    <div class="app-container">
      <app-header [dir]="'ltr'" (toggleSidenav)="sidenav.toggle()"></app-header>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav" [dir]="'ltr'">
          <app-sidebar></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--background-color);
    }

    .sidenav-container {
      flex: 1;
      background: transparent;
    }

    .mat-drawer.mat-sidenav {
      position: fixed;
      left: 0;
      top: 64px;
      height: calc(100vh - 64px);
      width: 73px;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: width;
      background-color: var(--sidenav-background);
      border-right: 1px solid var(--border-color);
    }

    [dir="rtl"] .mat-drawer.mat-sidenav {
      left: 0;
      right: auto;
    }

    .mat-sidenav-content {
      margin-left: 85px !important;
      margin-right: 12px !important;
      padding: 24px 12px 12px 12px;
      transition: margin 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      background: transparent;
    }

    ::ng-deep .mat-drawer-inner-container {
      overflow-x: hidden !important;
      width: calc(73px - 1px) !important;
    }
  `]
})
export class MainLayoutComponent {

}
