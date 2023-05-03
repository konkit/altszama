import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderOwnerButtonsComponent} from './order-owner-buttons.component';

describe('OrderOwnerButtonsComponent', () => {
  let component: OrderOwnerButtonsComponent;
  let fixture: ComponentFixture<OrderOwnerButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderOwnerButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderOwnerButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
