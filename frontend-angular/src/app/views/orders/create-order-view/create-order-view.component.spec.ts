import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderViewComponent } from './create-order-view.component';

describe('CreateOrderViewComponent', () => {
  let component: CreateOrderViewComponent;
  let fixture: ComponentFixture<CreateOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
