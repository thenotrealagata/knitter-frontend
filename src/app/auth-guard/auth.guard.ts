import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(UserService).getUser() !== null;

  if (!isLoggedIn) {
    inject(Router).navigate(['/login']);
  }
  return isLoggedIn;
};