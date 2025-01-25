import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { PrintService } from '../services/print.service';
import { IpcService } from '../services/ipc.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule,DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-purchase',
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
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule, 
      TranslateModule,
            MatTooltipModule
  ],
  providers: [PrintService,
    { provide: DateAdapter, useClass: NativeDateAdapter  },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  template: `
  <div class="purchases-container">
    <div class="header-section">
      <h1>{{ 'purchase.title' | translate }}</h1>
      <div class="header-actions">
        <mat-form-field class="search-field">
          <mat-label>{{ 'purchase.search.label' | translate }}</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="{{ 'purchase.search.placeholder' | translate }}" #input>
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <mat-form-field class="date-filter">
          <mat-label>{{ 'purchase.filterByDate' | translate }}</mat-label>
          <mat-date-range-input [rangePicker]="picker">
            <input matStartDate placeholder="{{ 'purchase.startDate' | translate }}" (dateChange)="onDateFilterChange($event, 'start')">
            <input matEndDate placeholder="{{ 'purchase.endDate' | translate }}" (dateChange)="onDateFilterChange($event, 'end')">
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>
        <button mat-raised-button class="print-all-button" (click)="printAllPurchases()">
          <mat-icon>print</mat-icon>
          {{ 'purchase.printAll' | translate }}
        </button>
        <button mat-raised-button class="add-button" (click)="openPurchaseForm()">
          <mat-icon>add_circle</mat-icon>
          {{ 'purchase.newPurchase' | translate }}
        </button>
      </div>
    </div>

    <mat-card class="main-card">
      <div class="table-container">
        <table mat-table [dataSource]="purchaseDataSource">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>{{ 'purchase.columns.date' | translate }}</th>
            <td mat-cell *matCellDef="let purchase">{{purchase.date | date}}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>{{ 'purchase.columns.description' | translate }}</th>
            <td mat-cell *matCellDef="let purchase">{{purchase.description}}</td>
          </ng-container>

          <ng-container matColumnDef="payment_method">
            <th mat-header-cell *matHeaderCellDef>{{ 'purchase.columns.paymentMethod' | translate }}</th>
            <td mat-cell *matCellDef="let purchase">{{purchase.payment_method}}</td>
          </ng-container>

          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef>{{ 'purchase.columns.items' | translate }}</th>
            <td mat-cell *matCellDef="let purchase">{{purchase.items.length}}</td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>{{ 'purchase.columns.total' | translate }}</th>
            <td mat-cell *matCellDef="let purchase">{{purchase.total}} DH</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>{{ 'purchase.columns.status' | translate }}</th>
            <td mat-cell *matCellDef="let purchase">
              <span class="status-badge" [class]="purchase.status">{{purchase.status}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'purchase.columns.actions' | translate }}</th>
            <td mat-cell *matCellDef="let purchase">
              <div class="action-buttons">
                <button mat-icon-button class="pdf-button" (click)="printPurchase(purchase)" matTooltip="{{ 'purchase.actions.print' | translate }}">
                  <mat-icon>receipt</mat-icon>
                </button>
                <button mat-icon-button class="view-button" (click)="viewPurchase(purchase)" matTooltip="{{ 'purchase.actions.view' | translate }}">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button class="delete-button" (click)="deletePurchase(purchase)" matTooltip="{{ 'purchase.actions.delete' | translate }}">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator #purchasePaginator
  [pageSize]="pageSize"
  [pageSizeOptions]="pageSizeOptions"
  showFirstLastButtons>
</mat-paginator>
      </div>
    </mat-card>
  </div>
`,




  styles: [`  .purchases-container {
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

    .main-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      padding: 32px;
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

    .pdf-button {
      color: #2196F3;
      transition: all 0.3s ease;
    }

    .view-button {
      color: #000000;
      transition: all 0.3s ease;
    }

    .pdf-button:hover, .view-button:hover {
      background: rgba(255, 193, 7, 0.1);
      transform: scale(1.1);
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
    }

    .print-all-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(33, 150, 243, 0.3);
    }

    .print-all-button mat-icon {
      margin-right: 8px;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-badge.pending {
      background: rgba(255, 193, 7, 0.1);
      color: #FFC107;
    }

    .status-badge.completed {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    .status-badge.cancelled {
      background: rgba(244, 67, 54, 0.1);
      color: #F44336;
    }

    .print-all-button, .add-button {
      white-space: nowrap;
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

    ::ng-deep .mat-mdc-tab-group {
      font-family: 'Roboto', sans-serif;
    }

    ::ng-deep .mat-mdc-tab-label {
      opacity: 1 !important;
      padding: 0 24px;
      height: 48px;
    }

    ::ng-deep .mat-mdc-tab:not(.mat-mdc-tab-disabled) .mdc-tab__text-label,
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

    .date-filter {
      width: 300px;
      margin-right: 16px;
    }

    th.mat-header-cell, td.mat-cell {
      padding: 16px;
    }

    .action-buttons button {
      position: relative;
      overflow: hidden;
      transform: scale(1);
      transition: transform 0.2s ease, background-color 0.3s ease;
    }

    .action-buttons button:active {
      transform: scale(0.95);
    }

    .add-button, .print-all-button {
      position: relative;
      overflow: hidden;
    }

    .add-button:active, .print-all-button:active {
      transform: translateY(1px);
    }

    .mat-icon-button:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .payment-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background: rgba(33, 150, 243, 0.1);
      color: #2196F3;
      display: inline-block;
      text-align: center;
      line-height: 1.4;
      white-space: normal;
      word-wrap: break-word;
      max-width: 150px;
    }

    ::ng-deep .mat-mdc-paginator {
      background: transparent;
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid #eee;
    }

    ::ng-deep .mat-mdc-paginator-container {
      padding: 8px 24px;
      justify-content: flex-end;
    }

    ::ng-deep .mat-mdc-paginator-range-label {
      color: #2c3e50;
      font-weight: 500;
      margin: 0 24px;
    }

    ::ng-deep .mat-mdc-paginator-navigation-previous,
    ::ng-deep .mat-mdc-paginator-navigation-next {
      color: #FFC107;
    }

    ::ng-deep .mat-mdc-paginator-page-size {
      color: #2c3e50;
      font-weight: 500;
    }

    ::ng-deep .mat-mdc-paginator-page-size-select {
      margin: 0 16px;
    }

    .delete-button {
      color: #F44336;
      transition: all 0.3s ease;
    }

    .delete-button:hover {
      background: rgba(244, 67, 54, 0.1);
      transform: scale(1.1);
    }`]})

export class PurchaseComponent implements OnInit {
  displayedColumns: string[] = ['date', 'description', 'items', 'total', 'status', 'payment_method', 'actions'];
  purchases: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  @ViewChild('purchasePaginator') paginator!: MatPaginator;
pageSize = 6;
pageSizeOptions = [6, 12, 24];
purchaseDataSource = new MatTableDataSource<any>([]);

  constructor(
    private readonly ipc: IpcService,
    private readonly dialog: MatDialog,
    private readonly printService: PrintService
  ) {}

  ngOnInit() {
    this.loadPurchases();
  }

  async loadPurchases() {
    try {
      this.purchases = await this.ipc.getPurchases();
      this.purchaseDataSource.data = this.purchases;
      this.purchaseDataSource.paginator = this.paginator;
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  }

  openPurchaseForm(purchase?: any) {
    const dialogRef = this.dialog.open(PurchaseFormComponent, {
      width: '800px',
      data: {
        date: new Date().getTime() // Set today's date as timestamp
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const newPurchase = {
          ...result,
          date: result.date instanceof Date ? result.date.getTime() : Number(result.date)
        };
        await this.ipc.createPurchase(newPurchase);
        this.loadPurchases();
      }
    });
  }
  async deletePurchase(purchase: any) {
    if (confirm('Are you sure you want to delete this purchase?')) {
      await this.ipc.deletePurchase(purchase.id)
      this.loadPurchases()
    }
    this.purchases = await this.ipc.getPurchases();
  }

  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const allPurchases = await this.ipc.getPurchases();

    this.purchases = allPurchases.filter((purchase: any) =>
      purchase.description?.toLowerCase().includes(filterValue) ||
      purchase.status?.toLowerCase().includes(filterValue) ||
      purchase.total?.toString().includes(filterValue)
    );
  }

  printPurchase(purchase: any) {
    this.printService.generatePurchaseInvoice(purchase, this.purchases)
  }

  viewPurchase(purchase: any) {
    const purchaseData = {
      id: purchase.id,
      date: new Date(Number(purchase.date)),
      description: purchase.description,
      status: purchase.status,
      paymentMethod: purchase.payment_method, 
      items: purchase.items,
      total: purchase.total
    }

    const dialogRef = this.dialog.open(PurchaseFormComponent, {
      width: '800px',
      data: purchaseData
    })

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const updatedPurchase = {
          ...result,
          id: purchaseData.id,
          date: result.date instanceof Date ? result.date.getTime() : Number(result.date)
        }
        await this.ipc.updatePurchase(updatedPurchase)
        this.loadPurchases()
      }
    })
  }
  printAllPurchases() {
    this.printService.generateAllPurchaseInvoices(this.purchases)
  }

  onDateFilterChange(event: any, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = event.value;
    } else {
      this.endDate = event.value;
    }
    this.filterPurchasesByDate();
  }

  private async filterPurchasesByDate() {
    const allPurchases = await this.ipc.getPurchases();
    this.purchases = allPurchases.filter((purchase: { date: string | number }) => {
      const purchaseDate = new Date(Number(purchase.date));
      
      if (this.startDate && this.endDate) {
        return purchaseDate >= this.startDate && purchaseDate <= this.endDate;
      }
      if (this.startDate) {
        return purchaseDate >= this.startDate;
      }
      if (this.endDate) {
        return purchaseDate <= this.endDate;
      }
      return true;
    });  }
}
