import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDeskComponent } from './cash-desk.component';

describe('CashDeskComponent', () => {
  let component: CashDeskComponent;
  let fixture: ComponentFixture<CashDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashDeskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
