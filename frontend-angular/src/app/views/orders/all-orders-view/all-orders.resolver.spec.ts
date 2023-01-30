import { TestBed } from '@angular/core/testing';

import { AllOrdersResolver } from './all-orders.resolver';

describe('AllOrdersResolver', () => {
  let resolver: AllOrdersResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AllOrdersResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
