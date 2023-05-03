import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStateButtonsComponent } from './order-state-buttons.component';

describe('OrderStateButtonsComponent', () => {
  let component: OrderStateButtonsComponent;
  let fixture: ComponentFixture<OrderStateButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderStateButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStateButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
