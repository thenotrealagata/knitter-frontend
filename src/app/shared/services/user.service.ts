import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClientService } from './http-client.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  sessionKey = 'session_key';
  userKey = 'user';
  usernameKey = 'username';

  httpClient: HttpClientService;
  router: Router;

  constructor(httpClient: HttpClientService, router: Router) { 
    this.httpClient = httpClient;
    this.router = router;
  }

  createSession(token: string) {
    localStorage.setItem(this.sessionKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.sessionKey);
  }

  setUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const item = localStorage.getItem(this.userKey);
    return item ? JSON.parse(item) as User : null;
  }

  setUsername(username: string) {
    localStorage.setItem(this.usernameKey, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(["/charts/list"]);
  }

  isFavorite(chartId: number): boolean {
    return this.getUser()?.favorites.some(favorite => favorite.id === chartId) ?? false;
  }

  async toggleFavorite(chartId: number, addFavorite: boolean) {
    const observable = addFavorite ? this.httpClient.addFavorite(chartId) : this.httpClient.removeFavorite(chartId);
    await firstValueFrom(observable).then((user) => {
      this.setUser(user);
    }).catch((err) => {
      
    });
  }
}
