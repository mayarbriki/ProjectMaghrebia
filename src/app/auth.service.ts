import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/users'; // Backend API base URL
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }

  // Register a new user
  register(userData: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("password", userData.password);
    formData.append("email", userData.email);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("address", userData.address);
   // formData.append("role", userData.role); // Ensure role is a string or send properly formatted
    if (file) {
      formData.append("file", file);
    }
  
    return this.http.post("http://localhost:8082/api/users/register", formData);
  }

  // Login user
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, null, {
      params: { username, password },
    }).pipe(
      tap(response => {
        if (response) {
          localStorage.setItem('user', JSON.stringify(response));
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  
}
