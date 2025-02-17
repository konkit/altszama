import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RestaurantsListViewComponent} from './restaurants-list-view.component';

describe('RestaurantsListViewComponent', () => {
  let component: RestaurantsListViewComponent;
  let fixture: ComponentFixture<RestaurantsListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantsListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
