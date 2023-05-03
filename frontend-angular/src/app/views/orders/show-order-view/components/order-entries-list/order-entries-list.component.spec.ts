import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEntriesListComponent } from './order-entries-list.component';

describe('OrderEntriesListComponent', () => {
  let component: OrderEntriesListComponent;
  let fixture: ComponentFixture<OrderEntriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderEntriesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
