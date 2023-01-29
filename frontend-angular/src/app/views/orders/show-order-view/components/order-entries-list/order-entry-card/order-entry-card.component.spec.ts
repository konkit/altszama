import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEntryCardComponent } from './order-entry-card.component';

describe('OrderEntryCardComponent', () => {
  let component: OrderEntryCardComponent;
  let fixture: ComponentFixture<OrderEntryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderEntryCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEntryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
