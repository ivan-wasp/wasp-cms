import { TestBed } from '@angular/core/testing';

import { NonPickupDropoffGuard } from './non-pickup-dropoff.guard';

describe('NonPickupDropoffGuard', () => {
  let guard: NonPickupDropoffGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonPickupDropoffGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
