import { TestBed } from '@angular/core/testing';

import { CreateOrderResolver } from './create-order.resolver';

describe('CreateOrderResolverResolver', () => {
  let resolver: CreateOrderResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CreateOrderResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
