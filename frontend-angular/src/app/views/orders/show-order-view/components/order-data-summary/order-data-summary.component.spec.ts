import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDataSummaryComponent } from './order-data-summary.component';

describe('OrderDataSummaryComponent', () => {
  let component: OrderDataSummaryComponent;
  let fixture: ComponentFixture<OrderDataSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDataSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDataSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
