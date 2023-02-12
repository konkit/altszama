import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantCategoryEntriesComponent } from './restaurant-category-entries.component';

describe('ShowRestaurantDishesTableComponent', () => {
  let component: RestaurantCategoryEntriesComponent;
  let fixture: ComponentFixture<RestaurantCategoryEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantCategoryEntriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantCategoryEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
