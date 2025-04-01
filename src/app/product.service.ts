import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { SuggestionService } from './suggestion.service';

// Interface Product avec typage strict
export interface Product {
  idProduct?: number;
  name: string;
  description: string;
  category: string; // Considérez utiliser un enum si possible
  fileName?: string;
  price?: number;
  paymentPlans?: Array<{
    name: string;
    amount: number;
    duration: number;
  }>;
  views?: number;
}
export interface ProductStatistics {
  totalProducts: number;
  averagePrice: number;
  totalViews: number;
  productsByCategory: { [key: string]: number };
  viewsByCategory: { [key: string]: number };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:6060/api/products';
  private readonly userUrl = 'http://localhost:8082/api/users';

  constructor(
    private http: HttpClient,
    private suggestionService: SuggestionService
  ) {}

  // Récupère tous les produits
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Ajoute un nouveau produit
  addProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Récupère un produit par ID
  getProductById(id: number): Observable<Product> {
    if (!id) {
      return throwError(() => new Error('Product ID is required'));
    }
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Met à jour un produit
  updateProduct(id: number, formData: FormData): Observable<Product> {
    if (!id) {
      return throwError(() => new Error('Product ID is required'));
    }
    return this.http.put<Product>(`${this.baseUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Supprime un produit
  deleteProduct(id: number): Observable<any> {
    if (!id) {
      return throwError(() => new Error('Product ID is required'));
    }
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Incrémente les vues d'un produit
  incrementViews(id: number): Observable<Product> {
    if (!id) {
      return throwError(() => new Error('Product ID is required'));
    }
    return this.http.post<Product>(`${this.baseUrl}/${id}/increment-views`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Récupère le produit le plus vu
  getMostViewedProduct(): Observable<Product[]> {  // Updated return type
    return this.http.get<Product[]>(`${this.baseUrl}/most-viewed`);
  }

  // Récupère les produits bookmarkés d'un utilisateur
  getBookmarkedProducts(userId: number): Observable<number[]> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'));
    }
    return this.http.get<number[]>(`${this.userUrl}/${userId}/bookmarks`).pipe(
      catchError(this.handleError)
    );
  }

  // Ajoute des produits aux favoris
  bookmarkProducts(userId: number, productIds: number[]): Observable<string> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'));
    }
    if (!productIds?.length) {
      return throwError(() => new Error('At least one product ID is required'));
    }
    return this.http.post<string>(
      `${this.userUrl}/${userId}/bookmark`,
      productIds
    ).pipe(
      tap(() => this.suggestionService.refreshSuggestions()),
      catchError(this.handleError)
    );
  }

  // Retire un produit des favoris
  unbookmarkProduct(userId: number, productId: number): Observable<void> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'));
    }
    if (!productId) {
      return throwError(() => new Error('Product ID is required'));
    }
    return this.http.post<void>(
      `${this.userUrl}/${userId}/unbookmark`,
      { productId }
    ).pipe(
      tap(() => this.suggestionService.refreshSuggestions()),
      catchError(this.handleError)
    );
  }

  // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/search`, {
      params: { query }
    });
  }
 // Sorts products using the /sort endpoint
 sort(sortBy: string = 'name', sortDir: string = 'asc'): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.baseUrl}/sort`, {
      params: { sortBy, sortDir }
  }).pipe(
      catchError(this.handleError)
  );
}
getProductStatistics(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/statistics`).pipe(
    catchError(this.handleError)
  );
}


}