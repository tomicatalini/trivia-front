import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '../model/Auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/user';

  //Estado de autenticación del usuario
  // private loggedIn = new BehaviorSubject<boolean>(false);
  // loggedIn$ = this.loggedIn.asObservable();
  
  private userData = new BehaviorSubject<Auth | null>(null);
  userData$ = this.userData.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(auth: Auth) {
    this.userData.next(auth);
    //this.loggedIn.next(true);
    localStorage.setItem('auth_user', JSON.stringify(auth));
  }

  logout() {
    //this.loggedIn.next(false);
    this.userData.next(null);
    localStorage.removeItem('auth_user');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('auth_user') != null ? true : false;
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
    return this.http.post(`${this.apiUrl}`, body, { responseType: 'json' });
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const user: Auth = JSON.parse(userData);
      this.userData.next(user);
    }
  }
}
