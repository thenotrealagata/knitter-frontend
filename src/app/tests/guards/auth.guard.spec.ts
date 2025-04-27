import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from '../../shared/guards/auth-guard/auth.guard';
import { UserService } from '../../shared/services/user.service';

describe('CanActivateGuard', () => {
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['getToken']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userService},
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect and return false without logged in user', () => {
    userService.getToken.and.returnValue(null);
    expect(executeGuard({} as any, {} as any)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledOnceWith([ '/login' ]);
  });

  it('should return true for logged in user', () => {
    userService.getToken.and.returnValue("token");
    expect(executeGuard({} as any, {} as any)).toBeTrue();
  });

});
