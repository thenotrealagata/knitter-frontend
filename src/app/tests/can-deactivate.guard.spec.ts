import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { canDeactivateGuard } from '../shared/guards/can-deactivate/can-deactivate.guard';

/*describe('canDeactivateGuard', () => {
  // todo
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canDeactivateGuard(...guardParameters as any[]));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
*/