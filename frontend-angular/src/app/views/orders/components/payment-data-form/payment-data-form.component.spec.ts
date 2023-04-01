import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDataFormComponent } from './payment-data-form.component';

describe('PaymentDataFormComponent', () => {
  let component: PaymentDataFormComponent;
  let fixture: ComponentFixture<PaymentDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
