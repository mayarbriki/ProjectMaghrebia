import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Product, ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from '../feedback/feedback.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SuggestionService } from '../suggestion.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [CommonModule, FeedbackComponent, FormsModule],
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.scss'],
})
export class ProductDisplayComponent implements OnInit {
  products: Product[] = [];
  originalProducts: Product[] = []; // Store the original list of products
  private bookmarkedProductIdsSubject = new BehaviorSubject<number[]>([]);
  bookmarkedProductIds$ = this.bookmarkedProductIdsSubject.asObservable();
  bookmarkedProductIds: number[] = [];
  userId: number | null = null;
  currentIndex: number = 0;
  itemsPerPage: number = 3;
  transitionInProgress: boolean = false;
  translateX: number = 0;
  mostViewedProducts: Product[] = [];
  searchQuery: string = '';
  searchResults: Product[] = [];
  sortBy: string = 'name';
  sortDir: string = 'asc';
  bookmarkLoading: { [key: number]: boolean } = {};

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userId = user?.id ?? null;

    if (this.userId) {
      this.loadBookmarks();
    }

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.originalProducts = data; // Store the original list
        this.products = [...this.originalProducts]; // Initialize products with the full list
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err)
    });

    this.productService.getMostViewedProduct().subscribe({
      next: (data: Product[]) => {
        this.mostViewedProducts = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching most viewed products:', err);
        this.mostViewedProducts = [];
      }
    });

    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        const updatedUser = this.authService.getUser();
        this.userId = updatedUser?.id ?? null;
        this.loadBookmarks();
      } else {
        this.userId = null;
        this.bookmarkedProductIdsSubject.next([]);
      }
    });

    this.bookmarkedProductIds$.subscribe(bookmarkedIds => {
      this.bookmarkedProductIds = bookmarkedIds;
      this.cdr.detectChanges();
    });
  }

  loadBookmarks(): void {
    if (!this.userId) return;

    this.productService.getBookmarkedProducts(this.userId).subscribe({
      next: (bookmarks) => {
        console.log('Bookmarked products fetched:', bookmarks);
        this.bookmarkedProductIdsSubject.next(bookmarks);
      },
      error: (error) => {
        console.error('Error loading bookmarks:', error);
        this.bookmarkedProductIdsSubject.next([]);
      }
    });
  }

  toggleBookmark(product: Product): void {
    if (product.idProduct === undefined || !this.userId) {
      console.error('Product ID or User ID is undefined');
      return;
    }

    const productId = product.idProduct;
    this.bookmarkLoading[productId] = true;

    let bookmarkAction$: Observable<string | void>;

    if (this.isBookmarked(productId)) {
      bookmarkAction$ = this.productService.unbookmarkProduct(this.userId, productId);
    } else {
      bookmarkAction$ = this.productService.bookmarkProducts(this.userId, [productId]);
    }

    bookmarkAction$.pipe(
      catchError(error => {
        console.error('Bookmark toggle error:', error);
        return of(null);
      }),
      finalize(() => {
        this.bookmarkLoading[productId] = false;
        this.loadBookmarks();
        this.cdr.detectChanges();
        this.suggestionService.refreshSuggestions();
      })
    ).subscribe({
      next: (response) => {
        if (response !== null) {
          console.log(`Bookmark toggle successful for product ID: ${productId}`);
        }
      }
    });
  }

  isBookmarked(productId: number | undefined): boolean {
    return productId !== undefined && this.bookmarkedProductIds.includes(productId);
  }

  isBookmarkLoading(productId: number | undefined): boolean {
    return productId ? !!this.bookmarkLoading[productId] : false;
  }

  prevSlide() {
    if (!this.transitionInProgress) {
      this.transitionInProgress = true;

      if (this.currentIndex === 0) {
        this.currentIndex = Math.max(0, this.products.length - this.itemsPerPage);
      } else {
        this.currentIndex--;
      }

      this.updateTranslation();

      setTimeout(() => {
        this.transitionInProgress = false;
      }, 500);
    }
  }

  nextSlide() {
    if (!this.transitionInProgress) {
      this.transitionInProgress = true;

      if (this.currentIndex + this.itemsPerPage >= this.products.length) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }

      this.updateTranslation();

      setTimeout(() => {
        this.transitionInProgress = false;
      }, 500);
    }
  }

  updateTranslation(): void {
    const itemWidth = 220;
    this.translateX = -(this.currentIndex * itemWidth);
  }

  getItemWidth(index: number): string {
    return index < this.products.length ? '220px' : '0';
  }

  isCurrentlyVisible(index: number): boolean {
    return index >= this.currentIndex && index < this.currentIndex + this.itemsPerPage;
  }

  viewProductDetails(productId: number | undefined): void {
    if (productId === undefined) return;

    this.productService.incrementViews(productId).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.idProduct === productId);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        const mostViewedIndex = this.mostViewedProducts.findIndex(p => p.idProduct === productId);
        if (mostViewedIndex !== -1) {
          this.mostViewedProducts[mostViewedIndex] = updatedProduct;
        } else if (this.mostViewedProducts.length < 3) {
          this.mostViewedProducts.push(updatedProduct);
        } else {
          this.mostViewedProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
          if ((updatedProduct.views || 0) > (this.mostViewedProducts[2].views || 0)) {
            this.mostViewedProducts[2] = updatedProduct;
          }
        }
        this.mostViewedProducts.sort((a, b) => (b.views || 0) - (a.views || 0));

        this.cdr.detectChanges();
        this.router.navigate(['/product', productId]);
      },
      error: (err) => {
        console.error('Error incrementing views:', err);
        this.router.navigate(['/product', productId]);
      }
    });
  }

  isTrendingProduct(product: Product): boolean {
    return product.idProduct !== undefined && 
           this.mostViewedProducts.some(p => p.idProduct === product.idProduct);
  }

  openDropdown() {
    const dropdownToggle = document.querySelector('.nav-link.dropdown-toggle') as HTMLElement;
    if (dropdownToggle) {
      dropdownToggle.click();
    }
  }
  loadProducts(): void {
    this.productService.sort(this.sortBy, this.sortDir).subscribe({
      next: (data) => {
        this.originalProducts = data;
        this.products = [...this.originalProducts];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }
  onSortChange(sortBy: string, sortDir: string): void {
    this.sortBy = sortBy;
    this.sortDir = sortDir;
    if (this.searchQuery.trim()) {
      this.onSearch();
    } else {
      this.loadProducts();
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (results) => {
          this.searchResults = results;
          this.products = [...this.searchResults]; // Replace products with search results
          this.currentIndex = 0; // Reset carousel to start
          this.updateTranslation(); // Update carousel position
          this.cdr.detectChanges();
          console.log('Search results:', results);
        },
        error: (err) => {
          console.error('Search error:', err);
          this.searchResults = [];
          this.products = [...this.originalProducts]; // Revert to original list on error
          this.currentIndex = 0;
          this.updateTranslation();
          this.cdr.detectChanges();
        }
      });
    } else {
      this.searchResults = [];
      this.products = [...this.originalProducts]; // Revert to original list if query is empty
      this.currentIndex = 0;
      this.updateTranslation();
      this.cdr.detectChanges();
    }
  }
}