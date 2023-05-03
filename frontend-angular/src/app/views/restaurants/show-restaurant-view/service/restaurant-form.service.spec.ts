import { TestBed } from '@angular/core/testing';

import { RestaurantFormService } from './restaurant-form.service';

describe('RestaurantFormService', () => {
  let service: RestaurantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
