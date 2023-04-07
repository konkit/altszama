import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeChipComponent } from './payment-type-chip.component';

describe('PaymentChipComponent', () => {
  let component: PaymentTypeChipComponent;
  let fixture: ComponentFixture<PaymentTypeChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTypeChipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTypeChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
