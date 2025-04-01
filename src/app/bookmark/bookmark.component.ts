// bookmark.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Product, ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs'; // Added 'of' here
import { catchError, finalize } from 'rxjs/operators';
import { SuggestionService } from '../suggestion.service';
import { AllTemplateFrontComponent } from '../front-office/all-template-front/all-template-front.component';
import { HeaderFrontComponent } from '../front-office/header-front/header-front.component';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent],
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {
  bookmarkedProducts: Product[] = [];
  private bookmarkedProductIdsSubject = new BehaviorSubject<number[]>([]);
  bookmarkedProductIds$ = this.bookmarkedProductIdsSubject.asObservable();
  bookmarkedProductIds: number[] = [];
  userId: number | null = null;
  currentIndex: number = 0;
  itemsPerPage: number = 3;
  transitionInProgress: boolean = false;
  translateX: number = 0;
  mostViewedProducts: Product[] = [];
  bookmarkLoading: { [key: number]: boolean } = {};

  constructor(
    private productService: ProductService,
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

    this.bookmarkedProductIds$.subscribe(bookmarkedIds => {
      this.bookmarkedProductIds = bookmarkedIds;
      this.loadBookmarkedProducts();
      this.cdr.detectChanges();
    });
  }

  loadBookmarks(): void {
    if (!this.userId) return;

    this.productService.getBookmarkedProducts(this.userId).subscribe({
      next: (bookmarks) => {
        this.bookmarkedProductIdsSubject.next(bookmarks);
      },
      error: (error) => {
        console.error('Error loading bookmarks:', error);
        this.bookmarkedProductIdsSubject.next([]);
      }
    });
  }

  loadBookmarkedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (allProducts) => {
        this.bookmarkedProducts = allProducts.filter(product => 
          product.idProduct !== undefined && 
          this.bookmarkedProductIds.includes(product.idProduct)
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  toggleBookmark(product: Product): void {
    if (product.idProduct === undefined || !this.userId) return;

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
        return of(null); // 'of' is now properly imported
      }),
      finalize(() => {
        this.bookmarkLoading[productId] = false;
        this.loadBookmarks();
        this.suggestionService.refreshSuggestions();
      })
    ).subscribe();
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
      this.currentIndex = this.currentIndex === 0 ? 
        Math.max(0, this.bookmarkedProducts.length - this.itemsPerPage) : 
        this.currentIndex - 1;
      this.updateTranslation();
      setTimeout(() => this.transitionInProgress = false, 500);
    }
  }

  nextSlide() {
    if (!this.transitionInProgress) {
      this.transitionInProgress = true;
      this.currentIndex = (this.currentIndex + this.itemsPerPage >= this.bookmarkedProducts.length) ? 
        0 : this.currentIndex + 1;
      this.updateTranslation();
      setTimeout(() => this.transitionInProgress = false, 500);
    }
  }

  updateTranslation(): void {
    const itemWidth = 220;
    this.translateX = -(this.currentIndex * itemWidth);
  }

  isCurrentlyVisible(index: number): boolean {
    return index >= this.currentIndex && index < this.currentIndex + this.itemsPerPage;
  }

  viewProductDetails(productId: number | undefined): void {
    if (productId === undefined) return;

    this.productService.incrementViews(productId).subscribe({
      next: (updatedProduct) => {
        const index = this.bookmarkedProducts.findIndex(p => p.idProduct === productId);
        if (index !== -1) {
          this.bookmarkedProducts[index] = updatedProduct;
        }
        this.updateMostViewedProducts(updatedProduct);
        this.cdr.detectChanges();
        this.router.navigate(['/product', productId]);
      },
      error: (err) => {
        console.error('Error incrementing views:', err);
        this.router.navigate(['/product', productId]);
      }
    });
  }

  updateMostViewedProducts(updatedProduct: Product): void {
    const mostViewedIndex = this.mostViewedProducts.findIndex(p => p.idProduct === updatedProduct.idProduct);
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
  }

  isTrendingProduct(product: Product): boolean {
    return product.idProduct !== undefined && 
           this.mostViewedProducts.some(p => p.idProduct === product.idProduct);
  }
}