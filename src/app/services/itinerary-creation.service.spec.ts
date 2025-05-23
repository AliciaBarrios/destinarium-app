import { TestBed } from '@angular/core/testing';

import { ItineraryCreationService } from './itinerary-creation.service';

describe('ItineraryCreationService', () => {
  let service: ItineraryCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
