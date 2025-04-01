import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
export interface User {
  id: number;
  username: string;
  email: string;
  accountBalance?: number;  // The ? makes this property optional
  phoneNumber?: string;
  address?: string;
  role : 'ADMIN' | 'CUSTOMER' | 'AGENT';
  image?: string;
  // Add any other properties your user object might have
}
@Injectable({
  providedIn: 'root',
})
// Add this interface at the top of your file or in a separate models file

export class AuthService {
  
  private apiUrl = 'http://localhost:8082/api/users';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  //private userSubject = new BehaviorSubject<any>(this.getUser()); // Add userSubject to emit user updates

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
 // user$ = this.userSubject.asObservable(); // Observable for user updates

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
    if (file) {
      formData.append("file", file);
    }
    return this.http.post("http://localhost:8082/api/users/register", formData);
  }

  // Login user
 
  logout() {
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null); // Emit null user
  }



  // Fetch updated user from backend
 // In your AuthService
 private userSubject = new BehaviorSubject<User | null>(this.getUser());
 user$ = this.userSubject.asObservable(); // Now properly typed
 getUser(): User | null {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    const user: User = JSON.parse(userData);
    return {
      ...user,
      accountBalance: user.accountBalance ?? 0 // Set default value if undefined
    };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

login(username: string, password: string): Observable<User> {
  return this.http.post<User>(`${this.apiUrl}/login`, null, {
    params: { username, password },
  }).pipe(
    tap(response => {
      if (response) {
        const user: User = {
          ...response,
          accountBalance: response.accountBalance ?? 0
        };
        localStorage.setItem('user', JSON.stringify(user));
        this.isAuthenticatedSubject.next(true);
        this.userSubject.next(user);
      }
    }),
    catchError(error => {
      console.error('Login error:', error);
      return this.handleError(error);
    })
  );
}

fetchUserBalance(userId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/${userId}/balance`);
}

fetchUser(userId: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
    tap((response: User) => {
      // Fetch the balance separately
      this.fetchUserBalance(userId).subscribe({
        next: (balance) => {
          const userWithBalance: User = {
            ...response,
            accountBalance: balance
          };
          localStorage.setItem('user', JSON.stringify(userWithBalance));
          this.userSubject.next(userWithBalance);
        },
        error: (error) => console.error('Error fetching balance:', error)
      });
    }),
    catchError(this.handleError)
  );
}
shareProduct(userId: number, shareData: { productName: string; productDescription: string; recipientEmail: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/${userId}/share-product`, shareData, { responseType: 'text' })
      .pipe(
        tap(() => {
          // Fetch updated user after sharing to get the new balance
          this.fetchUser(userId).subscribe({
            error: (err) => console.error('Failed to fetch updated user after sharing:', err)
          });
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}