import { TestBed, inject } from '@angular/core/testing';

import { ZFunctionsService } from './z-functions.service';

describe('ZFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZFunctionsService]
    });
  });

  it('should be created', inject([ZFunctionsService], (service: ZFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
