import {TestBed} from '@angular/core/testing';

import {ModifyOrderEntryService} from './modify-order-entry.service';

describe('ModifyOrderEntryService', () => {
  let service: ModifyOrderEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifyOrderEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
