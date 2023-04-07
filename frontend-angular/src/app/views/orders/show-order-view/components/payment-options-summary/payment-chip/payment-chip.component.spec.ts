import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChipComponent } from './payment-chip.component';

describe('PaymentChipComponent', () => {
  let component: PaymentChipComponent;
  let fixture: ComponentFixture<PaymentChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentChipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
