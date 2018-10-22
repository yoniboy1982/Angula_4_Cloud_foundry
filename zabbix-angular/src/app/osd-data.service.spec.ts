import { TestBed, inject } from '@angular/core/testing';

import { OsdDataService } from './osd-data.service';

describe('OsdDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OsdDataService]
    });
  });

  it('should be created', inject([OsdDataService], (service: OsdDataService) => {
    expect(service).toBeTruthy();
  }));
});
