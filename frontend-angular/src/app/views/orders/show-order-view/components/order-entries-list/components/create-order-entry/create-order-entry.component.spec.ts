import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderEntryComponent } from './create-order-entry.component';

describe('CreateOrderEntryComponent', () => {
  let component: CreateOrderEntryComponent;
  let fixture: ComponentFixture<CreateOrderEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrderEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrderEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
