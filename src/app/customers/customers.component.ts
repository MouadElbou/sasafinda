import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { IpcService } from '../services/ipc.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
        TranslateModule,
        MatTooltipModule
],
  template: `
    <div class="customers-container">
      <div class="header-section">
        <h1>{{ 'customers.title' | translate }}</h1>
        <button mat-raised-button class="add-button" (click)="openCustomerForm()">
          <mat-icon>add_circle</mat-icon>
          {{ 'customers.newCustomer' | translate }}
        </button>
      </div>
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>{{ 'customers.search.label' | translate }}</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="{{ 'customers.search.placeholder' | translate }}">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
      <mat-card class="main-card">
        <mat-tab-group animationDuration="200ms">
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">person</mat-icon>
              {{ 'customers.tabs.individual' | translate }}
            </ng-template>
            
            <div class="table-container">
              <table mat-table [dataSource]="personCustomers">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.name' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">{{customer.firstName}} {{customer.lastName}}</td>
                </ng-container>

                <ng-container matColumnDef="cin">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.cin' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">{{customer.cin}}</td>
                </ng-container>

                <ng-container matColumnDef="phone">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.phone' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">{{customer.phone}}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.email' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">{{customer.email}}</td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.actions' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">
                    <div class="action-buttons">
                      <button mat-icon-button class="edit-button" (click)="openCustomerForm(customer)" matTooltip="{{ 'customers.actions.edit' | translate }}">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button class="delete-button" (click)="deleteCustomer(customer)" matTooltip="{{ 'customers.actions.delete' | translate }}">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
           
            </div>
            <mat-paginator #personPaginator
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      showFirstLastButtons>
    </mat-paginator>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">business</mat-icon>
              {{ 'customers.tabs.company' | translate }}
            </ng-template>
            
            <div class="table-container">
              <table mat-table [dataSource]="companyCustomers">
                <ng-container matColumnDef="companyName">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.companyName' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">{{customer.companyName}}</td>
                </ng-container>
                <ng-container matColumnDef="ice">
  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.ice' | translate }}</th>
  <td mat-cell *matCellDef="let company">{{company.taxNumber || '-'}}</td>
</ng-container>
                <ng-container matColumnDef="contactPerson">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.contactPerson' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">{{customer.contactPerson}}</td>
                </ng-container>

                <ng-container matColumnDef="phone">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.phone' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">{{customer.phone}}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.email' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">{{customer.email}}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>{{ 'customers.columns.actions' | translate }}</th>
                  <td mat-cell *matCellDef="let customer">
                    <div class="action-buttons">
                      <button mat-icon-button class="edit-button" (click)="openCustomerForm(customer)" matTooltip="{{ 'customers.actions.edit' | translate }}">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button class="delete-button" (click)="deleteCustomer(customer)" matTooltip="{{ 'customers.actions.delete' | translate }}">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="companyDisplayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: companyDisplayedColumns;"></tr>
              </table>
            </div>
            <mat-paginator #companyPaginator
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      showFirstLastButtons>
    </mat-paginator>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .customers-container {
      padding: 32px;
      background: #f8f9fa;
      min-height: calc(100vh - 64px);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .add-button {
      background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
      color: #2c3e50;
      padding: 0 32px;
      height: 48px;
      border-radius: 24px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
      transition: all 0.3s ease;
    }

    .add-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3);
    }

    .add-button mat-icon {
      margin-right: 8px;
    }

    .main-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      padding: 32px;
    }

    .tab-icon {
      margin-right: 8px;
      color: #FFC107;
    }

    .table-container {
      margin-top: 0;
      overflow-x: auto;
      border-radius: 12px;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 12px;
    }

    th {
      color: #2c3e50;
      font-weight: 600;
      font-size: 14px;
      padding: 20px;
      background: #f8f9fa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 20px;
      font-size: 14px;
      color: #34495e;
    }

    tr.mat-mdc-row {
      background: white;
      transition: all 0.3s ease;
      border-radius: 12px;
      margin-bottom: 8px;
    }

    tr.mat-mdc-row:hover {
      background: rgba(255, 193, 7, 0.08);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .edit-button {
      color: #FFC107;
      transition: all 0.3s ease;
    }

    .edit-button:hover {
      background: rgba(255, 193, 7, 0.1);
      transform: scale(1.1);
    }

    .delete-button {
      color: #ff5252;
      transition: all 0.3s ease;
    }

    .delete-button:hover {
      background: rgba(255, 82, 82, 0.1);
      transform: scale(1.1);
    }

    .search-field {
  width: 100%;
  margin-bottom: 24px;
}

.search-field .mat-icon {
  color: #FFC107;
}
    ::ng-deep .mat-mdc-tab-group {
      font-family: 'Roboto', sans-serif;
    }

    ::ng-deep .mat-mdc-tab-label {
      opacity: 1 !important;
      padding: 0 24px;
      height: 48px;
    }

    ::ng-deep .mat-mdc-tab:not(.mat-mdc-tab-disabled).mdc-tab--active .mdc-tab__text-label {
      color: #FFC107;
      font-weight: 500;
    }

    ::ng-deep .mat-mdc-tab-header {
      border-bottom: 1px solid #eee;
      margin-bottom: 0;
    }

    ::ng-deep .mat-mdc-tab-label-content {
      font-weight: 500;
    }

    ::ng-deep .mat-mdc-tab .mdc-tab-indicator__content--underline {
      border-color: #FFC107 !important;
    }

    ::ng-deep .mat-mdc-tab-header .mat-ripple-element {
      background-color: rgba(255, 193, 7, 0.1) !important;
    }

    .customer-card {
      background-color: var(--card-background);
      color: var(--text-color);
    }
    .mat-mdc-table {
      background-color: var(--card-background);
      color: var(--text-color);
    }
  `]
})export class CustomersComponent implements OnInit {
  displayedColumns = ['name', 'cin', 'phone', 'email', 'actions'];
  companyDisplayedColumns = ['companyName',"ice", 'contactPerson', 'phone', 'email', 'actions'];
  personCustomers: any[] = [];
  companyCustomers: any[] = [];
  allPersonCustomers: any[] = [];
  allCompanyCustomers: any[] = [];
  
  @ViewChild('personPaginator') personPaginator!: MatPaginator;
@ViewChild('companyPaginator') companyPaginator!: MatPaginator;

pageSize = 6;
pageSizeOptions = [6, 12, 24];

personCustomersDataSource = new MatTableDataSource<any>([]);
companyCustomersDataSource = new MatTableDataSource<any>([]);

  constructor(
    private readonly ipc: IpcService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  async loadCustomers() {
    const customers = await this.ipc.getCustomers();
    this.allPersonCustomers = customers.filter((c: { type: string }) => c.type === 'person');
    this.allCompanyCustomers = customers.filter((c: { type: string }) => c.type === 'company');
    this.personCustomers = [...this.allPersonCustomers];
    this.companyCustomers = [...this.allCompanyCustomers];
    
    this.personCustomersDataSource.data = this.personCustomers;
    this.companyCustomersDataSource.data = this.companyCustomers;
    
    this.personCustomersDataSource.paginator = this.personPaginator;
    this.companyCustomersDataSource.paginator = this.companyPaginator;
  
  }

  openCustomerForm(customer?: any) {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '500px',
      data: customer || { type: 'person' }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        if (result.id) {
          await this.ipc.updateCustomer(result);
        } else {
          await this.ipc.createCustomer(result);
        }
        this.loadCustomers();
      }
    });
  }

  async deleteCustomer(customer: any) {
    if (confirm(`Are you sure you want to delete ${customer.firstName || customer.companyName}?`)) {
      await this.ipc.deleteCustomer(customer.id);
      this.loadCustomers();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    
    this.personCustomers = this.allPersonCustomers.filter(customer => 
      customer.firstName?.toLowerCase().includes(filterValue) ||
      customer.lastName?.toLowerCase().includes(filterValue) ||
      customer.email?.toLowerCase().includes(filterValue) ||
      customer.phone?.toLowerCase().includes(filterValue) ||
      customer.cin?.toLowerCase().includes(filterValue)
    );

    this.companyCustomers = this.allCompanyCustomers.filter(customer =>
      customer.companyName?.toLowerCase().includes(filterValue) ||
      customer.contactPerson?.toLowerCase().includes(filterValue) ||
      customer.email?.toLowerCase().includes(filterValue) ||
      customer.phone?.toLowerCase().includes(filterValue)
    );
  }
}

