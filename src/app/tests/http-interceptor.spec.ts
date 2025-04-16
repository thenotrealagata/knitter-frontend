import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from '../shared/services/http-interceptor';

describe('HttpInterceptor', () => {
  let service: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
