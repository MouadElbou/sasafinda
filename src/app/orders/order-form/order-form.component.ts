import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IpcService } from '../../services/ipc.service';
import { CustomerFormComponent } from '../../customers/customer-form/customer-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule, 
          TranslateModule,
                MatTooltipModule
  ],
  providers: [IpcService],
  template: `
    <div class="order-form-container" [ngClass]="{'rtl-layout': currentLang === 'ar'}">
      <h2 mat-dialog-title>{{ (data.id ? 'orders.form.edit' : 'orders.form.new') | translate }}</h2>
      <form [formGroup]="form">
        <mat-dialog-content>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'orders.form.customer' | translate }}</mat-label>
              <mat-select formControlName="customerId" [disabled]="data.readonly">
                <mat-option *ngFor="let customer of customers" [value]="customer.id">
                  {{customer.firstName && customer.lastName ? customer.firstName + ' ' + customer.lastName : customer.companyName}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-icon-button type="button" (click)="openCustomerForm()" [disabled]="data.readonly">
              <mat-icon>person_add</mat-icon>
            </button>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'orders.form.date' | translate }}</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" [readonly]="data.readonly">
              <mat-datepicker-toggle matSuffix [for]="picker" [disabled]="data.readonly"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'orders.form.description' | translate }}</mat-label>
            <textarea matInput formControlName="description" required rows="3"></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'orders.form.status' | translate }}</mat-label>
              <mat-select formControlName="status">
                <mat-option value="completed">{{ 'orders.status.completed' | translate }}</mat-option>
                <mat-option value="pending">{{ 'orders.status.pending' | translate }}</mat-option>
                <mat-option value="cancelled">{{ 'orders.status.cancelled' | translate }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'orders.form.paymentMethod' | translate }}</mat-label>
            <mat-select formControlName="paymentMethod" [disabled]="data.readonly">
              <mat-option *ngFor="let method of paymentMethods" [value]="method">
                {{method}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div formArrayName="items">
            <h3>{{ 'orders.form.items.title' | translate }}</h3>
            <div *ngFor="let item of itemsFormArray.controls; let i=index" [formGroupName]="i">
              <div class="item-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'orders.form.items.name' | translate }}</mat-label>
                  <input matInput formControlName="name">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'orders.form.items.quantity' | translate }}</mat-label>
                  <input matInput type="number" formControlName="quantity">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'orders.form.items.price' | translate }}</mat-label>
                  <input matInput type="number" formControlName="price">
                </mat-form-field>

                <button mat-icon-button color="warn" type="button" (click)="removeItem(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <button mat-stroked-button type="button" (click)="addItem()">
              <mat-icon>add</mat-icon> {{ 'orders.form.items.add' | translate }}
            </button>
          </div>
        </mat-dialog-content>

        <div mat-dialog-actions align="end">
          <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
          <button mat-raised-button type="submit" style="background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%); color: #2c3e50;" (click)="onSubmit()">
            {{ (data.id ? 'orders.form.update' : 'orders.form.create') | translate }}
          </button>
        </div>
      </form>
    </div>
  `,    styles: [`
      .order-form-container {
    padding: 24px;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    direction: ltr;
  }

  .form-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
  }

  mat-form-field {
    width: 100%;
  }

  .item-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 16px;
    margin-bottom: 16px;
  }

  /* RTL specific styles */
  .rtl-layout {
    direction: rtl;
  }

  .rtl-layout mat-form-field {
    text-align: right;
    direction: rtl;
  }

  .rtl-layout .mat-dialog-actions {
    flex-direction: row-reverse;
  }

  .rtl-layout input[type="number"],
  .rtl-layout .mat-select-value {
    direction: ltr;
    text-align: right;
  }

      @media (min-width: 800px) {
        .order-form-container {
          max-width: 800px;
          margin: 0 auto;
        }
      }

      .form-row {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 16px;
      }

      @media (min-width: 600px) {
        .form-row {
          flex-direction: row;
          align-items: flex-start;
      
          mat-form-field {
            flex: 1;
          }
      
          button {
            margin-top: 4px;
          }
        }
      }

      .item-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }

      @media (min-width: 600px) {
        .item-row {
          grid-template-columns: 2fr 1fr 1fr auto;
        }
      }

      mat-form-field {
        width: 100%;
      }

      mat-dialog-content {
        max-height: calc(100vh - 200px);
        overflow-y: auto;
      }

      mat-dialog-actions {
        flex-wrap: wrap;
        gap: 8px;
      }

      @media (max-width: 400px) {
        mat-dialog-actions {
          justify-content: center;
        }

        button {
          width: 100%;
        }
      }

      .create-button {
        background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
        color: #2c3e50;
        padding: 0 32px;
        height: 48px;
        border-radius: 24px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
        transition: all 0.3s ease;
      }

      .create-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3);
      }
    `]
  })
export class OrderFormComponent implements OnInit {
  paymentMethods = [
    'espéces',
    'chéque', 
    'virement bancaire',
    'letter de change',
    'versement'
  ];
  form: FormGroup;
  customers: any[] = [];
  currentLang: string = 'en';

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<OrderFormComponent>,
    private readonly dialog: MatDialog,
    private readonly ipc: IpcService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
     private translate: TranslateService

  ) {
    this.form = this.fb.group({
      id: [data.id],
      customerId: [data.customerId, Validators.required],
      date: [data.date || new Date(), Validators.required],
      description: [data.description, Validators.required],
      paymentMethod: [data.paymentMethod || 'espéces', Validators.required],
      status: [data.status || 'completed', Validators.required],
      items: this.fb.array([])
    });

    if (data.items) {
      data.items.forEach((item: any) => this.addItem(item));
    }
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  async loadCustomers() {
    this.customers = await this.ipc.getCustomers();
    
  }

  get itemsFormArray() {
    return this.form.get('items') as FormArray;
  }

  addItem(item?: any) {
    const itemForm = this.fb.group({
      name: [item?.name || '', Validators.required],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      price: [item?.price || 0, [Validators.required, Validators.min(0)]]
    });

    this.itemsFormArray.push(itemForm);
  }

  removeItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  calculateTotal(): number {
    return this.itemsFormArray.controls.reduce((total, item) => {
      return total + (item.get('quantity')?.value * item.get('price')?.value);
    }, 0);
  }
    onSubmit() {
      if (this.form.valid) {
        const orderData = this.form.value;
        orderData.total = orderData.items.reduce((sum: number, item: any) => {
          return sum + (Number(item.quantity) * Number(item.price));
        }, 0);
        const formValue = {
          ...orderData,
          payment_method: orderData.paymentMethod,
          id: this.data.id
        };
        this.dialogRef.close(formValue);
      }
    }
  openCustomerForm() {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {}
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.ipc.createCustomer(result);
        await this.loadCustomers();
        this.form.patchValue({ customerId: result.id });
      }
    });
  }
}