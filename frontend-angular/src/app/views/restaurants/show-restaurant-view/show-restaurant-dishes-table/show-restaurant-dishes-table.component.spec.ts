import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRestaurantDishesTableComponent } from './show-restaurant-dishes-table.component';

describe('ShowRestaurantDishesTableComponent', () => {
  let component: ShowRestaurantDishesTableComponent;
  let fixture: ComponentFixture<ShowRestaurantDishesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRestaurantDishesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRestaurantDishesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
