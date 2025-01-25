import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
      , TranslateModule,
            MatTooltipModule
  ],
  template: `
    <div class="customer-form-container" [ngClass]="{'rtl-layout': currentLang === 'ar'}">
      <h2 mat-dialog-title>{{ (data.id ? 'customers.form.edit' : 'customers.form.new') | translate }}</h2>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'customers.form.type' | translate }}</mat-label>
              <mat-select formControlName="type">
                <mat-option value="person">{{ 'customers.type.person' | translate }}</mat-option>
                <mat-option value="company">{{ 'customers.type.company' | translate }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Person fields -->
          <ng-container *ngIf="form.get('type')?.value === 'person'">
            <div class="form-row two-cols">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'customers.form.firstName' | translate }}</mat-label>
                <input matInput formControlName="firstName" type="text">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'customers.form.lastName' | translate }}</mat-label>
                <input matInput formControlName="lastName" type="text">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'customers.form.cin' | translate }}</mat-label>
                <input matInput formControlName="cin" type="text">
                <mat-icon matSuffix>badge</mat-icon>
              </mat-form-field>
            </div>
          </ng-container>

          <!-- Company fields -->
          <ng-container *ngIf="form.get('type')?.value === 'company'">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'customers.form.companyName' | translate }}</mat-label>
                <input matInput formControlName="companyName" type="text">
              </mat-form-field>
            </div>

            <div class="form-row two-cols">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'customers.form.contactPerson' | translate }}</mat-label>
                <input matInput formControlName="contactPerson" type="text">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'customers.form.taxNumber' | translate }}</mat-label>
                <input matInput formControlName="taxNumber" type="text">
              </mat-form-field>
            </div>
          </ng-container>

          <!-- Common fields -->
          <div class="form-row two-cols">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'customers.form.phone' | translate }}</mat-label>
              <input matInput formControlName="phone" type="tel">
              <mat-icon matSuffix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'customers.form.email' | translate }}</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'customers.form.address' | translate }}</mat-label>
              <textarea matInput formControlName="address" rows="3"></textarea>
              <mat-icon matSuffix>location_on</mat-icon>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close type="button">{{ 'common.cancel' | translate }}</button>
          <button mat-raised-button color="primary" type="submit" style="background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%); color: #2c3e50;" [disabled]="!form.valid">
            {{ (data.id ? 'customers.form.update' : 'customers.form.create') | translate }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
  .purchase-form {
    padding: 24px;
    max-width: 800px;
    direction: ltr;
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
    text-align: left;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
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
  }

  /* Force LTR for non-Arabic languages */
  :not(.rtl-layout) mat-form-field {
    direction: ltr;
    text-align: left;
  }

  :not(.rtl-layout) .form-actions {
    flex-direction: row;
  }
`]})
export class CustomerFormComponent {
  form: FormGroup;
  currentLang: string = 'en';

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly translate: TranslateService

  ) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
    
    this.form = this.fb.group({
      id: [data.id],
      type: [data.type || 'person', Validators.required],
      firstName: [data.firstName || ''],
      lastName: [data.lastName || ''],
      companyName: [data.companyName || ''],
      contactPerson: [data.contactPerson || ''],
      phone: [data.phone || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      address: [data.address || ''],
      taxNumber: [data.taxNumber || ''],
      cin: [data.cin || '']
    });

    this.form.get('type')?.valueChanges.subscribe(type => {
      if (type === 'person') {
        this.form.get('companyName')?.clearValidators();
        this.form.get('firstName')?.setValidators(Validators.required);
        this.form.get('lastName')?.setValidators(Validators.required);
        this.form.get('cin')?.setValidators(Validators.required);
      } else {
        this.form.get('firstName')?.clearValidators();
        this.form.get('lastName')?.clearValidators();
        this.form.get('cin')?.clearValidators();
        this.form.get('companyName')?.setValidators(Validators.required);
      }
      this.form.updateValueAndValidity();
    });  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}