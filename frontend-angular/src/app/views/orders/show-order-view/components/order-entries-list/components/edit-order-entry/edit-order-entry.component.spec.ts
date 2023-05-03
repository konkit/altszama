import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderEntryComponent } from './edit-order-entry.component';

describe('EditOrderEntryComponent', () => {
  let component: EditOrderEntryComponent;
  let fixture: ComponentFixture<EditOrderEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOrderEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrderEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
