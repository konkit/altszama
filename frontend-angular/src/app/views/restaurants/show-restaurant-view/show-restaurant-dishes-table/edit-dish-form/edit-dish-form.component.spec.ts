import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDishFormComponent } from './edit-dish-form.component';

describe('EditRestaurantFormComponent', () => {
  let component: EditDishFormComponent;
  let fixture: ComponentFixture<EditDishFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDishFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDishFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
