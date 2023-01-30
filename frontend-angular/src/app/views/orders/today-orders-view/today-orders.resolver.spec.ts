import { TestBed } from '@angular/core/testing';

import { TodayOrdersResolver } from './today-orders.resolver';

describe('TodayOrdersResolver', () => {
  let resolver: TodayOrdersResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TodayOrdersResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
