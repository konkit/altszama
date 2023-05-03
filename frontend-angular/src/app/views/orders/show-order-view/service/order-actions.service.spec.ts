import {TestBed} from '@angular/core/testing';

import {OrderActionsService} from './order-actions.service';

describe('OrderActionsService', () => {
  let service: OrderActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
