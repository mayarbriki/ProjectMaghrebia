// suggestion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  private apiUrl = 'http://localhost:8082/api/users';
  private productApiUrl = 'http://localhost:6060/api'; // Product service URL
  private suggestionsSubject = new BehaviorSubject<any[]>([]); // Store product details
  suggestions$ = this.suggestionsSubject.asObservable();
  suggestionsCount$ = this.suggestionsSubject.pipe(
    map(suggestions => suggestions.length)
  );

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  fetchSuggestions(): Observable<any[]> {
    const user = this.authService.getUser();
    if (!user?.id) {
      console.error('User not authenticated or ID not found:', user);
      throw new Error('User not authenticated or ID not found');
    }
    console.log('Fetching suggestions for user ID:', user.id);
    return this.http.get<number[]>(`${this.apiUrl}/${user.id}/suggestions`).pipe(
      switchMap(productIds => {
        if (productIds.length === 0) {
          return new Observable<any[]>(observer => {
            observer.next([]);
            observer.complete();
          });
        }
        // Fetch details for each product ID
        const productRequests = productIds.map(id =>
          this.http.get<any>(`${this.productApiUrl}/products/${id}`)
        );
        return forkJoin(productRequests);
      }),
      tap(products => {
        console.log('Product details received:', products);
        this.suggestionsSubject.next(products);
      })
    );
  }
  refreshSuggestions() {
    this.fetchSuggestions().subscribe();
  }
  getSuggestions(): any[] {
    return this.suggestionsSubject.value;
  }

  getSuggestionsCount(): number {
    return this.suggestionsSubject.value.length;
  }

  clearSuggestions() {
    this.suggestionsSubject.next([]);
  }
}