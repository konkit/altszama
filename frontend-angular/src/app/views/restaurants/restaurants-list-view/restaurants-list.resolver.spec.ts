import { TestBed } from '@angular/core/testing';

import { RestaurantsListResolver } from './restaurants-list.resolver';

describe('RestaurantsListResolver', () => {
  let resolver: RestaurantsListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RestaurantsListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
