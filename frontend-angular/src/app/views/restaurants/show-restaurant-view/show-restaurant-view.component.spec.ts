import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRestaurantViewComponent } from './show-restaurant-view.component';

describe('ShowRestaurantViewComponent', () => {
  let component: ShowRestaurantViewComponent;
  let fixture: ComponentFixture<ShowRestaurantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRestaurantViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRestaurantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
