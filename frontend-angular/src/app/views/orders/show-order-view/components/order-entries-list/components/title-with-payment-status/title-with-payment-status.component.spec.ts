import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleWithPaymentStatusComponent } from './title-with-payment-status.component';

describe('TitleWithPaymentStatusComponent', () => {
  let component: TitleWithPaymentStatusComponent;
  let fixture: ComponentFixture<TitleWithPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleWithPaymentStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleWithPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
