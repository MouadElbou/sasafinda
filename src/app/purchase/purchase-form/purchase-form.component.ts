import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PaymentMethod } from '../../shared/enums/payment-method.enum';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    MatTooltipModule
  ],
  template: `
     <div class="purchase-form" [ngClass]="{'rtl-layout': currentLang === 'ar'}">
  <h2>{{ (editMode ? 'purchase.form.edit' : 'purchase.form.new') | translate }}</h2>

  <form [formGroup]="purchaseForm" (ngSubmit)="onSubmit()">
    <mat-form-field appearance="outline">
      <mat-label>{{ 'purchase.form.date' | translate }}</mat-label>
      <input matInput [matDatepicker]="picker" formControlName="date" required>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>{{ 'purchase.form.description' | translate }}</mat-label>
      <textarea matInput formControlName="description" required rows="3"></textarea>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>{{ 'purchase.form.status' | translate }}</mat-label>
      <mat-select formControlName="status" required>
        <mat-option value="pending">{{ 'purchase.status.pending' | translate }}</mat-option>
        <mat-option value="completed">{{ 'purchase.status.completed' | translate }}</mat-option>
        <mat-option value="cancelled">{{ 'purchase.status.cancelled' | translate }}</mat-option>
      </mat-select>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>{{ 'purchase.form.paymentMethod' | translate }}</mat-label>
      <mat-select formControlName="paymentMethod" required>
        <mat-option *ngFor="let method of paymentMethods" [value]="method">
          {{method}}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <div formArrayName="items" class="items-section">
      <h3>{{ 'purchase.form.items.title' | translate }}</h3>
      <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="item-row">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'purchase.form.items.name' | translate }}</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'purchase.form.items.quantity' | translate }}</mat-label>
          <input matInput type="number" formControlName="quantity" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'purchase.form.items.price' | translate }}</mat-label>
          <input matInput type="number" formControlName="price" required>
        </mat-form-field>

        <button mat-icon-button color="warn" type="button" (click)="removeItem(i)">
          <mat-icon>delete</mat-icon>
        </button>
      </div>

      <button mat-stroked-button type="button" (click)="addItem()">
        <mat-icon>add</mat-icon> {{ 'purchase.form.items.add' | translate }}
      </button>
    </div>

    <div class="form-actions">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button type="submit" style="background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%); color: #2c3e50;">
        {{ (editMode ? 'purchase.form.update' : 'purchase.form.create') | translate }}
      </button>
    </div>
  </form>
</div>
  `,
  styles: [`
    .purchase-form {
      padding: 24px;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
      margin: 16px;
      direction: ltr;
    }

    .form-row {
      margin-bottom: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .items-section {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
      margin: 20px 0;
    }

    .item-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: start;
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 24px;
    }

    h3 {
      color: #34495e;
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

    .rtl-layout .form-actions {
      flex-direction: row-reverse;
    }

    .rtl-layout input[type="number"] {
      direction: ltr;
    }  `]
})
export class PurchaseFormComponent {
  purchaseForm: FormGroup;
  paymentMethods = Object.values(PaymentMethod);
  editMode: boolean = false;
  currentLang: string = 'en';

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<PurchaseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly translate: TranslateService

  ) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });

    this.purchaseForm = this.fb.group({
      date: [new Date(), Validators.required],
      description: ['', Validators.required],
      status: [data?.status || 'completed', Validators.required],
      paymentMethod: [data?.paymentMethod || 'espéces', Validators.required],
      items: this.fb.array([])
    });

    if (data?.items) {
      this.editMode = true;
      this.purchaseForm.patchValue(data);
      data.items.forEach((item: any) => {
        const itemGroup = this.fb.group({
          name: [item.name, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          price: [item.price, [Validators.required, Validators.min(0)]]
        });
        this.items.push(itemGroup);
      });
    } else {
      this.addItem();
    }
  } get items() {
    return this.purchaseForm.get('items') as any;
  }

  addItem() {
    const itemGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateTotal(): number {
    return this.items.controls.reduce((total: number, item: any) => {
      const quantity = item.get('quantity').value || 0;
      const price = item.get('price').value || 0;
      return total + (quantity * price);
    }, 0);
  }

  onSubmit() {
    if (this.purchaseForm.valid) {
      const formValue = this.purchaseForm.value;
      formValue.total = this.calculateTotal();
      this.dialogRef.close(formValue);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
