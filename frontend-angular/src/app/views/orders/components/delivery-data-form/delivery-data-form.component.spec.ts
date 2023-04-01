import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDataFormComponent } from './delivery-data-form.component';

describe('DeliveryDataFormComponent', () => {
  let component: DeliveryDataFormComponent;
  let fixture: ComponentFixture<DeliveryDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryDataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
