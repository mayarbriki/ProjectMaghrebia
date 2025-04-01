import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  password?: string; // Optional for security reasons
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: 'ADMIN' | 'CUSTOMER' | 'AGENT'; // Adjust roles as needed
  image?: string;
  accountBalance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8082/api/users'; // Spring Boot backend URL

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, null, {
      params: { username, password },
    });
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${username}`);
  }
}
