import { TestBed } from '@angular/core/testing';

import { SinistrePredictionService } from './sinistre-prediction.service';

describe('SinistrePredictionService', () => {
  let service: SinistrePredictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SinistrePredictionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
