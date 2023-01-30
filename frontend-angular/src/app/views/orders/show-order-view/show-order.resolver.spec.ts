import { TestBed } from '@angular/core/testing';

import { ShowOrderResolver } from './show-order.resolver';

describe('ShowOrderResolver', () => {
  let resolver: ShowOrderResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShowOrderResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
