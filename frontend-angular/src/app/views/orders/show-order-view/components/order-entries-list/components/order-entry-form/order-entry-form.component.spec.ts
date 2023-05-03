import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEntryFormComponent } from './order-entry-form.component';

describe('OrderEntryFormComponent', () => {
  let component: OrderEntryFormComponent;
  let fixture: ComponentFixture<OrderEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderEntryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
