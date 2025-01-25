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
import { OrderFormComponent } from './order-form/order-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule, NativeDateAdapter } from '@angular/material/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-orders',
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
    MatPaginatorModule,
    TranslateModule,
    MatTooltipModule
  ],
  providers: [
    PrintService,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  templateUrl: './orders.component.html',
   styleUrls: ['./orders.component.css']

}) export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['date', 'customer', 'description', 'items', 'total', 'status', 'payment_method', 'actions'];
  companyDisplayedColumns: string[] = ['date', 'company', 'description', 'items', 'total', 'status', 'payment_method', 'actions'];
  personOrders: any[] = [];
  companyOrders: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  orders: any[] = [];
  pageSize = 6;
  pageSizeOptions = [6, 12, 24];
  @ViewChild('personPaginator') personPaginator!: MatPaginator;
  @ViewChild('companyPaginator') companyPaginator!: MatPaginator;
  
  personOrdersDataSource = new MatTableDataSource<any>([]);
  companyOrdersDataSource = new MatTableDataSource<any>([]);

  constructor(
    private readonly ipc: IpcService,
    private readonly dialog: MatDialog,
    private readonly printService: PrintService
  ) { }

  ngOnInit() {
    this.loadOrders();
  }















  async loadOrders() {
    this.personOrders = (await this.ipc.getPersonOrders())
      .sort((a: { date: string | number }, b: { date: string | number }) => Number(b.date) - Number(a.date));

    this.companyOrders = (await this.ipc.getCompanyOrders())
      .sort((a: { date: string | number }, b: { date: string | number }) => Number(b.date) - Number(a.date));

    this.personOrdersDataSource.data = this.personOrders;
    this.companyOrdersDataSource.data = this.companyOrders;
    this.personOrdersDataSource.paginator = this.personPaginator;
    this.companyOrdersDataSource.paginator = this.companyPaginator;
    
    this.orders = [...this.personOrders, ...this.companyOrders];
  }
  openOrderForm(order?: any) {
    const orderData = order ? {
      ...order,
      date: new Date(Number(order.date))
    } : {};

    const dialogRef = this.dialog.open(OrderFormComponent, {
      width: '800px',
      data: orderData
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        if (result.id) {
          await this.ipc.updateOrder(result);
        } else {
          await this.ipc.createOrder(result);
        }
        this.loadOrders();
      }
    });
  }

  async deleteOrder(order: any) {
    if (confirm('Are you sure you want to delete this order?')) {
      await this.ipc.deleteOrder(order.id);
      this.loadOrders();
    }
  }

  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const allPersonOrders = await this.ipc.getPersonOrders();
    const allCompanyOrders = await this.ipc.getCompanyOrders();


    this.personOrders = allPersonOrders.filter((order: any) =>
      order.firstName?.toLowerCase().includes(filterValue) ||
      order.lastName?.toLowerCase().includes(filterValue) ||
      order.phone?.toLowerCase().includes(filterValue) ||
      order.email?.toLowerCase().includes(filterValue) ||
      order.status?.toLowerCase().includes(filterValue) ||
      order.total?.toString().includes(filterValue)
    );
    this.personOrdersDataSource.filter = filterValue;

    this.companyOrders = allCompanyOrders.filter((order: any) =>
      order.companyName?.toLowerCase().includes(filterValue) ||
      order.phone?.toLowerCase().includes(filterValue) ||
      order.email?.toLowerCase().includes(filterValue) ||
      order.status?.toLowerCase().includes(filterValue) ||
      order.total?.toString().includes(filterValue)
    );
    this.companyOrdersDataSource.filter = filterValue;

  }
  async printBill(order: any) {
    const customer = await this.ipc.getCustomerById(order.customerId);
    this.printService.generateBill(order, this.orders, customer);
  }

  viewOrder(order: any) {
    const orderData = {
      id: order.id,
      customerId: order.customerId,
      date: new Date(Number(order.date)),
      status: order.status,
      paymentMethod: order.payment_method, 
      description: order.description,
      items: order.items,
      total: order.total
    };

    const dialogRef = this.dialog.open(OrderFormComponent, {
      width: '800px',
      data: orderData
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const updatedOrder = {
          ...result,
          date: result.date instanceof Date ? result.date.getTime() : Number(result.date)
        };
        await this.ipc.updateOrder(updatedOrder);
        await this.loadOrders();
      }
    });
  }

  printAllOrders() {
    const allOrders = [...this.personOrders, ...this.companyOrders];
    this.printService.generateAllBills(allOrders);
  }

  onDateFilterChange(event: any, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = event.value;
    } else {
      this.endDate = event.value;
    }
    
    this.personOrdersDataSource.data = this.filterOrdersByDate(this.personOrders);
    this.companyOrdersDataSource.data = this.filterOrdersByDate(this.companyOrders);
  }

  async filterOrders() {
    const allPersonOrders = await this.ipc.getPersonOrders();
    const allCompanyOrders = await this.ipc.getCompanyOrders();

    this.personOrders = this.filterOrdersByDate(allPersonOrders);
    this.companyOrders = this.filterOrdersByDate(allCompanyOrders);
  }

  private filterOrdersByDate(orders: any[]): any[] {
    return orders.filter(order => {
      const orderDate = new Date(Number(order.date));
      
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate.setHours(0, 0, 0, 0));
        const end = new Date(this.endDate.setHours(23, 59, 59, 999));
        return orderDate >= start && orderDate <= end;
      }
      if (this.startDate) {
        const start = new Date(this.startDate.setHours(0, 0, 0, 0));
        return orderDate >= start;
      }
      if (this.endDate) {
        const end = new Date(this.endDate.setHours(23, 59, 59, 999));
        return orderDate <= end;
      }
      return true;
    });
  }

}




