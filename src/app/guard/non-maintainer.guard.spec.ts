import { TestBed } from '@angular/core/testing';

import { NonMaintainerGuard } from './non-maintainer.guard';

describe('NonMaintainerGuard', () => {
  let guard: NonMaintainerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonMaintainerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
