import { TestBed } from '@angular/core/testing';
import { UserService } from '../../shared/services/user.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../../shared/services/http-interceptor';
import { Router } from '@angular/router';
import { User } from '../../shared/model/User';
import { AtomicStitch, AtomicStitchType, Color } from '../../shared/model/Chart';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserService', () => {
    let service: UserService;
    let httpTesting: HttpTestingController;

    let router: jasmine.SpyObj<Router>;

    const baseUrl = 'http://localhost:8080/api';

    const sessionKey = 'session_key';
    const userKey = 'user';
    const usernameKey = 'username';

    beforeEach(() => {
        router = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([ authInterceptor ])),
                provideHttpClientTesting(),
                { provide: Router, useValue: router }
            ]
        });
        httpTesting = TestBed.inject(HttpTestingController);
        service = TestBed.inject(UserService);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('createSession should save JWT token', () => {
        service.createSession("random_string1");
        expect(localStorage.getItem(sessionKey)).toBe("random_string1");
    });

    it('getToken returns previously saved token', () => {
        expect(service.getToken()).toEqual(null);
        service.createSession("random_string2");
        expect(service.getToken()).toBe("random_string2");
    });

    it('setUser should save user', () => {
        const user = {
            id: 0,
            username: 'user0',
            favorites: []
        };
        service.setUser(user);
        expect(localStorage.getItem(userKey)).toBe(JSON.stringify(user));
    });

    it('getUser returns previously saved user', () => {
        expect(service.getUser()).toEqual(null);
        const user = {
            id: 1,
            username: 'user1',
            favorites: []
        };
        service.setUser(user);
        expect(service.getUser()).toEqual(user);
    });

    it('setUsername saves username', () => {
        service.setUsername('user2');
        expect(localStorage.getItem(usernameKey)).toBe('user2');
    });

    it('getUsername returns previously saved username', () => {
        expect(service.getUsername()).toEqual(null);
        service.setUsername('user3');
        expect(service.getUsername()).toBe('user3');
    });

    it('logout clears localStorage and navigates to chart listing', () => {
        service.setUser({
            id: 4,
            username: 'user4',
            favorites: []
        })
        service.createSession('token4');
        service.logout();
        expect(localStorage.key(0)).toBe(null); // Verify that there are no keys in localStorage
        expect(router.navigate).toHaveBeenCalledOnceWith(["/charts/list"]);
    });

    it('isFavorite returns correct state', () => {
        const user: User = {
            id: 5,
            username: 'user5',
            favorites: [
                {
                    id: 5,
                    title: 'Chart5',
                    description: '',
                    width: 1,
                    height: 1,
                    flat: false,
                    pattern: [ [ new AtomicStitch(Color.MC, AtomicStitchType.SSK) ] ],
                    colors: { MC: "#fff" },
                    filePath: ''
                }
            ]
        };
        service.setUser(user);
        expect(service.isFavorite(5)).toBeTrue();
        expect(service.isFavorite(0)).toBeFalse();
    });

    it('toggleFavorite adds favorite', () => {
        service.toggleFavorite(6, true);
        const req = httpTesting.expectOne(`${baseUrl}/users/favorites/${6}`);
        expect(req.request.method).toBe('POST');
    });

    it('toggleFavorite removes favorite', () => {
        service.toggleFavorite(6, false);
        const req = httpTesting.expectOne(`${baseUrl}/users/favorites/${6}`);
        expect(req.request.method).toBe('DELETE');
    });

});