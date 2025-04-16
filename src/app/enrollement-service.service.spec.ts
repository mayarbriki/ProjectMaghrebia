import { TestBed } from '@angular/core/testing';

import { EnrollementServiceService } from '../enrollement-service.service';

describe('EnrollementServiceService', () => {
  let service: EnrollementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
