import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  storageKey = 'session_key';
  usernameKey = 'username';

  constructor() { }

  createSession(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  setUsername(username: string) {
    localStorage.setItem(this.usernameKey, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.usernameKey);
  }
}
