import { TestBed } from '@angular/core/testing';

import { ShowRestaurantResolver } from './show-restaurant.resolver';

describe('ShowRestaurantResolver', () => {
  let resolver: ShowRestaurantResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShowRestaurantResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
