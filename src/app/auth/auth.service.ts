import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '../model/Auth';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = "auth_user";
  private apiUrl = 'http://localhost:8080/user';
  
  private userData = new BehaviorSubject<Auth | null>(null);
  userData$ = this.userData.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(auth: Auth) {
    auth.expiration = new Date(new Date().getTime() + 60 * 60 * 1000); // Set expiration to 1 hour from now
    this.userData.next(auth);
    this.saveSession(auth);
  }

  logout() {
    this.clearSession();
  }

  isLoggedIn(): boolean {
    const session = this.getStoredSession();
    return session !== null && this.isSessionValid(session);
  }

  private isSessionValid(session: Auth): boolean {
    const now = new Date();
    const expiration = new Date(session.expiration);
    
    return now.getTime() < expiration.getTime();
  }

  getUserData(): Auth | null {
    return this.userData.value;
  }

  validateUser(username: string, password: string) {
    const body = { username, password };
    return this.http.post(`${this.apiUrl}/validate`, body, { responseType: 'json' });
  }

  registerUser(name: string, password: string, email: string, rol: string) {
    const body = { name, password, email, rol };
    return this.http.post(`${this.apiUrl}`, body, { responseType: 'json' }) as Observable<ApiResponse>;
  }

  extendSession(): void {
    const session = this.getStoredSession();
    const now = new Date();
    const expiration = new Date(session?.expiration!);
    
    if (session && this.isSessionValid(session) && expiration.getHours() - now.getHours() < 1) {
      session.expiration.setHours(session.expiration.getHours() + 1);
      this.saveSession(session);
      this.userData.next(session);
    }
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const user: Auth = JSON.parse(userData);
      this.userData.next(user);
    }
  }

  private getStoredSession(): Auth | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Error parsing stored session:", error)
      return null
    }
  }

  private saveSession(session: Auth): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session))
    } catch (error) {
      console.error("Error saving session:", error)
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.userData.next(null);
  }
}
