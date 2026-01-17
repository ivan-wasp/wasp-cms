import { TestBed } from '@angular/core/testing';

import { NonPatrolGuard } from './non-patrol.guard';

describe('NonPatrolGuard', () => {
  let guard: NonPatrolGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonPatrolGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
