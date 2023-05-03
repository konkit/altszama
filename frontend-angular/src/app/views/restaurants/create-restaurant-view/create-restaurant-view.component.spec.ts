import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRestaurantViewComponent } from './create-restaurant-view.component';

describe('CreateRestaurantViewComponent', () => {
  let component: CreateRestaurantViewComponent;
  let fixture: ComponentFixture<CreateRestaurantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRestaurantViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRestaurantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
