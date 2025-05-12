import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  accountBalance?: number;
  phoneNumber?: string;
  address?: string;
  role: 'ADMIN' | 'CUSTOMER' | 'AGENT';
  image?: string;
  age?: number;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  category?: string; // Used for bookmarkedService
  satisfactionScore?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/users';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userSubject = new BehaviorSubject<User | null>(this.getUser());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }

  getUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;

      const user: User = JSON.parse(userData);
      return {
        ...user,
        accountBalance: user.accountBalance ?? 0,
        // Ensure category and satisfactionScore are properly preserved
        category: user.category,
        satisfactionScore: user.satisfactionScore
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  register(userData: any, file?: File): Observable<any> {
    const formData = new FormData();
    
    formData.append("username", userData.username);
    formData.append("password", userData.password);
    formData.append("email", userData.email);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("address", userData.address);
    formData.append("age", userData.age.toString());
    formData.append("gender", userData.gender);
    formData.append("maritalStatus", userData.maritalStatus);
    formData.append("occupation", userData.occupation);
    
    // Add category and satisfactionScore if provided
    if (userData.category) {
      formData.append("category", userData.category);
    }
    
    if (userData.satisfactionScore !== undefined) {
      formData.append("satisfactionScore", userData.satisfactionScore.toString());
    }
    
    if (file) {
      formData.append("file", file);
    }
    
    console.log("Registration payload:");
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    
    return this.http.post(`${this.apiUrl}/register`, formData)
      .pipe(
        catchError(error => {
          console.error('Registration error details:', error);
          return throwError(() => error);
        })
      );
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, null, {
      params: { username, password },
    }).pipe(
      tap(response => {
        if (response) {
          // Ensure all user properties are preserved
          const user: User = {
            ...response,
            accountBalance: response.accountBalance ?? 0,
            category: response.category, // Ensure category is preserved
            satisfactionScore: response.satisfactionScore // Ensure satisfactionScore is preserved
          };
          console.log('Storing user data with category and satisfactionScore:', user);
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

  logout() {
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
  }

  fetchUserBalance(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${userId}/balance`);
  }

  fetchUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      tap((response: User) => {
        // Store the current user first to avoid losing category and satisfactionScore
        const currentUser = this.getUser();
        
        this.fetchUserBalance(userId).subscribe({
          next: (balance) => {
            const userWithBalance: User = {
              ...response,
              accountBalance: balance,
              // Preserve category and satisfactionScore from response or current user
              category: response.category || currentUser?.category,
              satisfactionScore: response.satisfactionScore !== undefined ? 
                response.satisfactionScore : currentUser?.satisfactionScore
            };
            console.log('Updated user with balance and preserved fields:', userWithBalance);
            localStorage.setItem('user', JSON.stringify(userWithBalance));
            this.userSubject.next(userWithBalance);
          },
          error: (error) => console.error('Error fetching balance:', error)
        });
      }),
      catchError(this.handleError)
    );
  }

  // Method to update user category or satisfaction score
  updateUserPreferences(userId: number, data: {
    category?: string;
    satisfactionScore?: number;
  }): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/preferences`, data).pipe(
      tap((updatedUser: User) => {
        // Update stored user data
        const currentUser = this.getUser();
        if (currentUser) {
          const updatedUserData: User = {
            ...currentUser,
            category: data.category ?? currentUser.category,
            satisfactionScore: data.satisfactionScore !== undefined ? 
              data.satisfactionScore : currentUser.satisfactionScore
          };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          this.userSubject.next(updatedUserData);
        }
      }),
      catchError(this.handleError)
    );
  }

  shareProduct(userId: number, shareData: { productName: string; productDescription: string; recipientEmail: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/${userId}/share-product`, shareData, { responseType: 'text' })
      .pipe(
        tap(() => {
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