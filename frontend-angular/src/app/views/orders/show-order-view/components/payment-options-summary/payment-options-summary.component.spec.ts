import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOptionsSummaryComponent } from './payment-options-summary.component';

describe('PaymentOptionsSummaryComponent', () => {
  let component: PaymentOptionsSummaryComponent;
  let fixture: ComponentFixture<PaymentOptionsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentOptionsSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOptionsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
