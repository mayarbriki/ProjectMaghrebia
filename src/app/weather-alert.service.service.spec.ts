import { TestBed } from '@angular/core/testing';

import { WeatherAlertServiceService } from './weather-alert.service.service';

describe('WeatherAlertServiceService', () => {
  let service: WeatherAlertServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherAlertServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
