import { TestBed, inject } from '@angular/core/testing';

import { MyInvestorService } from './myinvestor.service';

describe('MyInvestorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyInvestorService]
    });
  });

  it('should ...', inject([MyInvestorService], (service: MyInvestorService) => {
    expect(service).toBeTruthy();
  }));
});
