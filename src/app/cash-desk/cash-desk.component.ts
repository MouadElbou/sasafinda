import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IpcService } from '../services/ipc.service';
import { PrintService } from '../services/print.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginator,MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-cash-desk',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
        TranslateModule,
        MatTooltipModule,MatPaginatorModule
  ],
  template: `
    <div class="orders-container">
      <div class="header-section">
        <h1>{{ 'cashDesk.title' | translate }}</h1>
        <div class="header-actions">
          <mat-form-field class="search-field">
            <mat-label>{{ 'cashDesk.search.label' | translate }}</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="{{ 'cashDesk.search.placeholder' | translate }}" #input>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field class="date-filter">
            <mat-label>{{ 'cashDesk.filterByDate' | translate }}</mat-label>
            <mat-date-range-input [rangePicker]="picker">
              <input matStartDate placeholder="{{ 'cashDesk.startDate' | translate }}" (dateChange)="onDateFilterChange($event, 'start')">
              <input matEndDate placeholder="{{ 'cashDesk.endDate' | translate }}" (dateChange)="onDateFilterChange($event, 'end')">
            </mat-date-range-input>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-date-range-picker #picker></mat-date-range-picker>
          </mat-form-field>
          <button mat-raised-button class="print-all-button" (click)="printReport()">
            <mat-icon>print</mat-icon>
            {{ 'cashDesk.printReport' | translate }}
          </button>
        </div>
      </div>

      <mat-card class="balance-card">
        <mat-card-header>
          <mat-icon>account_balance_wallet</mat-icon>
          <mat-card-title>{{ 'cashDesk.currentBalance' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h1>{{ balance | number:'1.2-2' }} MAD</h1>
        </mat-card-content>
      </mat-card>

      <mat-card class="main-card">
        <mat-card-content>
          <table mat-table [dataSource]="transactions">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>{{ 'cashDesk.columns.date' | translate }}</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.transaction_date | date}}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>{{ 'cashDesk.columns.type' | translate }}</th>
              <td mat-cell *matCellDef="let transaction">
                <span class="status-badge" [class]="transaction.type">{{ 'cashDesk.transactionTypes.' + transaction.type | translate }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>{{ 'cashDesk.columns.description' | translate }}</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.description}}</td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>{{ 'cashDesk.columns.amount' | translate }}</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.amount | number:'1.2-2'}} MAD</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
        </mat-card-content>
      </mat-card>
      
    </div>
  `,  styles: [`
    .orders-container {
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
      .header-actions {
        display: flex;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 16px;
      }

      .search-field, .date-filter {
        min-width: 250px;
        flex: 1;
      }

      .print-all-button {
        background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%);
        color: white;
        padding: 0 32px;
        height: 48px;
        border-radius: 24px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
        transition: all 0.3s ease;
        white-space: nowrap;
      }

      .print-all-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(33, 150, 243, 0.3);
      }

      .print-all-button mat-icon {
        margin-right: 8px;
      }

      @media (max-width: 1200px) {
        .header-section {
          flex-direction: column;
          align-items: flex-start;
        }

        .header-actions {
          width: 100%;
        }
      }

      @media (max-width: 768px) {
        .search-field, .date-filter {
          min-width: 100%;
        }
      }
    .balance-card {
      background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
      margin-bottom: 32px;
      padding: 20px;
    }

    .main-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      padding: 32px;
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

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-badge.income {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    .status-badge.expense {
      background: rgba(244, 67, 54, 0.1);
      color: #F44336;
    }
  `]
})
export class CashDeskComponent implements OnInit {
  balance: number = 0;
  transactions: any[] = [];
  originalTransactions: any[] = []; // Add this line
  displayedColumns: string[] = ['date', 'type', 'description', 'amount'];
  startDate: Date | null = null;
  endDate: Date | null = null;
  @ViewChild('transactionsPaginator') paginator!: MatPaginator;
pageSize = 6;
pageSizeOptions = [15, 30, 50];
transactionsDataSource = new MatTableDataSource<any>([]);

  constructor(
    private readonly ipcService: IpcService,
    private readonly printService: PrintService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  private async loadData() {
    this.transactionsDataSource.data = this.transactions;
this.transactionsDataSource.paginator = this.paginator;
    try {
      this.balance = await this.ipcService.getCashDeskBalance();
      this.transactions = await this.ipcService.getCashDeskTransactions();
      this.originalTransactions = [...this.transactions]; // Add this line
    } catch (error) {
      console.error('Error loading cash desk data:', error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    
    if (!filterValue) {
      this.transactions = [...this.originalTransactions];
    } else {
      this.transactions = this.originalTransactions.filter(transaction => 
        transaction.type.toLowerCase().includes(filterValue) ||
        transaction.description.toLowerCase().includes(filterValue) ||
        transaction.amount.toString().includes(filterValue)
      );
    }
  }

  onDateFilterChange(event: any, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = event.value;
    } else {
      this.endDate = event.value;
    }
    this.filterTransactions();
  }

  private filterTransactions() {
    this.loadData().then(() => {
      this.transactions = this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        if (this.startDate && this.endDate) {
          return transactionDate >= this.startDate && transactionDate <= this.endDate;
        }
        if (this.startDate) {
          return transactionDate >= this.startDate;
        }
        if (this.endDate) {
          return transactionDate <= this.endDate;
        }
        return true;
      });
    });
  }

  printReport() {
    this.printService.generateCashDeskReport(this.balance, this.transactions);
  }
}