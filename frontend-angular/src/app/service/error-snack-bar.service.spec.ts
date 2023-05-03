import { TestBed } from '@angular/core/testing';

import { ErrorSnackBarService } from './error-snack-bar.service';

describe('ErrorSnackBarService', () => {
  let service: ErrorSnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorSnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
