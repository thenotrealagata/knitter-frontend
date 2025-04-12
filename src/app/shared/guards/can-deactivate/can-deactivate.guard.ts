import { CanDeactivateFn } from '@angular/router';
import { CanDeactivate } from './can-deactivate-interface';

export const canDeactivateGuard: CanDeactivateFn<CanDeactivate> = (component, currentRoute, currentState, nextState) => {
  if (component.canDeactivate() || confirm("Are you sure you want to leave this page? Your progress might not have been saved.")) {
    return true;
  }

  return false;
};
