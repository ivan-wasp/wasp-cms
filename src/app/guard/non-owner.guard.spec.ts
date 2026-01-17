import { TestBed } from '@angular/core/testing';

import { NonOwnerGuard } from './non-owner.guard';

describe('NonOwnerGuard', () => {
  let guard: NonOwnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonOwnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
