import { TestBed, inject } from '@angular/core/testing';

import { FundamentalService } from './fundamental.service';

describe('FundamentalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FundamentalService]
    });
  });

  it('should ...', inject([FundamentalService], (service: FundamentalService) => {
    expect(service).toBeTruthy();
  }));
});
