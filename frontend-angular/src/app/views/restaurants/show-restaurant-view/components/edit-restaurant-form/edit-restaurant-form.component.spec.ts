import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestaurantFormComponent } from './edit-restaurant-form.component';

describe('EditRestaurantFormComponent', () => {
  let component: EditRestaurantFormComponent;
  let fixture: ComponentFixture<EditRestaurantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRestaurantFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRestaurantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
