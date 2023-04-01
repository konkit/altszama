import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTimeFormComponent } from './order-time-form.component';

describe('OrderTimeFormComponent', () => {
  let component: OrderTimeFormComponent;
  let fixture: ComponentFixture<OrderTimeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTimeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTimeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
