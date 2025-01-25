import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: window.location.search.includes('authenticated=true') ? 'dashboard' : 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'purchase',
        loadComponent: () => import('./purchase/purchase.component').then(m => m.PurchaseComponent)
      },
      {
        path: 'cash-desk',
        loadComponent: () => import('./cash-desk/cash-desk.component').then(m => m.CashDeskComponent)
      }
    ]
  }
];