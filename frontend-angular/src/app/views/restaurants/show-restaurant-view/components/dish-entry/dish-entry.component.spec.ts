import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishEntryComponent } from './dish-entry.component';

describe('ShowRestaurantDishesTableComponent', () => {
  let component: DishEntryComponent;
  let fixture: ComponentFixture<DishEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
