import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserService } from '../../shared/services/user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from '../../shared/services/http-interceptor';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

describe('HttpInterceptor', () => {
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['getToken', 'getUsername', 'logout']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userService},
        provideHttpClient(withInterceptors([ authInterceptor ])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router }
      ]
    });
    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  // Test adding JWT token
  it('should add JWT token', () => {
    const token = 'jwt_token';
    userService.getToken.and.returnValue(token);
    firstValueFrom(httpClient.get('http://localhost:8080/api/charts/1'));
    
    const req = httpTesting.expectOne({ method: 'GET' });
    expect(req.request.headers.get('authorization')).toBe(`Bearer ${token}`);
  });

  it('should not add auth header if no JWT token is stored', () => {
    userService.getToken.and.returnValue(null);

    firstValueFrom(httpClient.get('http://localhost:8080/api/charts/1'));
    
    const req = httpTesting.expectOne({ method: 'GET' });
    expect(req.request.headers.has('authorization')).toBeFalse();
  });

  // Test redirecting and logout when receiving 401
  it('redirects when receiving 401 Unauthorized', () => {
    const token = 'jwt_token';
    userService.getToken.and.returnValue(token);
    firstValueFrom(httpClient.get('http://localhost:8080/api/charts/1'));
    
    const req = httpTesting.expectOne({ method: 'GET' });
    req.flush('Unauthorized', {status: 401, statusText: 'Unauthorized'});
    expect(req.request.headers.get('authorization')).toBe(`Bearer ${token}`);
    expect(userService.logout).toHaveBeenCalledOnceWith();
    expect(router.navigate).toHaveBeenCalledOnceWith(["/login"]);
  });
});
