import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './shared/services/user.service';

describe('AppComponent', () => {
  let httpClient: jasmine.SpyObj<HttpClient>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    httpClient = jasmine.createSpyObj('HttpClient', ['addFavorite', 'removeFavorite'])
    userService = jasmine.createSpyObj('UserService', ['getToken', 'getUsername', 'logout']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: UserService, useValue: userService}]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'knitter-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('knitter-frontend');
  });
});
