import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(UserService).getToken() !== null;
  
  if (!isLoggedIn) {
    inject(Router).navigate(['/login']);
  }
  return isLoggedIn;
};