import { TestBed } from '@angular/core/testing';

import { OrderEntryService } from './order-entry.service';

describe('OrderEntryService', () => {
  let service: OrderEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
