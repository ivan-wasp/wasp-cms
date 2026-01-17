import { TestBed } from '@angular/core/testing';

import { NonBuyerGuard } from './non-buyer.guard';

describe('NonBuyerGuard', () => {
  let guard: NonBuyerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonBuyerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
