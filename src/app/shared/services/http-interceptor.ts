import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { UserService } from "./user.service";
import {  Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthInterceptor implements HttpInterceptor {
    sessionService: UserService;
    router: Router;

    constructor(sessionService: UserService, router: Router) {
        this.sessionService = sessionService;
        this.router = router;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Based on https://angular.dev/guide/http/interceptors#dependency-injection-in-interceptors
        const jwtToken = this.sessionService.getToken();
        let subscription;

        // Append JWT token to request
        if (jwtToken) {
            const authenticatedRequest = req.clone({ headers: req.headers.set('authorization', `Bearer ${jwtToken}`) });
            subscription = next.handle(authenticatedRequest);
        } else {
            subscription = next.handle(req);
        }
        
        // If response status is Unauthorized, redirect user to login form
        return subscription.pipe(tap({
            error: (err) => {
                    const status = err.status;
                    if (status == 401) {
                        this.sessionService.logout();
                        this.router.navigate(['/login']);
                    }
                }
            }
        ))
    }
}