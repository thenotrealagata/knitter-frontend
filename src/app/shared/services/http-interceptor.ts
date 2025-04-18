import { HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { UserService } from "./user.service";
import { inject } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Router } from "@angular/router";

export function authInterceptor (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const sessionService = inject(UserService);
    const router = inject(Router);

    // Based on https://angular.dev/guide/http/interceptors#dependency-injection-in-interceptors
    const jwtToken = sessionService.getToken();
    let subscription;
    // Append JWT token to request
    if (jwtToken) {
        const authenticatedRequest = req.clone({ headers: req.headers.set('authorization', `Bearer ${jwtToken}`) });
        subscription = next(authenticatedRequest);
    } else {
        subscription = next(req);
    }
    
    // If response status is Unauthorized, redirect user to login form
    return subscription.pipe(tap({
        error: (err) => {
                const status = err.status;
                if (status == 401) {
                    sessionService.logout();
                    router.navigate(['/login']);
                }
            }
        }
    ))
}