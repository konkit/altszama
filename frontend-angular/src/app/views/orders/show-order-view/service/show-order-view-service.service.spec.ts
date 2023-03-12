import { TestBed } from '@angular/core/testing';

import { ShowOrderViewService } from './show-order-view.service';

describe('ShowOrderViewServiceService', () => {
  let service: ShowOrderViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowOrderViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
