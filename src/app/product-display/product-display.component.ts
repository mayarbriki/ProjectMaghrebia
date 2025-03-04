import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from '../feedback/feedback.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [CommonModule, FeedbackComponent],
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.scss'],
})
export class ProductDisplayComponent implements OnInit {
  products: Product[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 3; // Show 3 items at a time
  transitionInProgress: boolean = false;
  translateX: number = 0;
  mostViewedProduct: Product | null = null; // Store the most viewed product
  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch all products
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });

    // Fetch the most viewed product
    this.productService.getMostViewedProduct().subscribe({
      next: (data) => {
        this.mostViewedProduct = data;
      },
      error: (err) => console.error('Error fetching most viewed product:', err),
    });
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
      }, 500); // Match transition time in CSS
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
      }, 500); // Match transition time in CSS
    }
  }

  updateTranslation(): void {
    const itemWidth = 220; // 200px wide + 20px gap
    this.translateX = -(this.currentIndex * itemWidth);
  }

  getItemWidth(index: number): string {
    return index < this.products.length ? '220px' : '0';
  }

  isCurrentlyVisible(index: number): boolean {
    return index >= this.currentIndex && index < this.currentIndex + this.itemsPerPage;
  }

  viewProductDetails(productId: number | undefined): void {
    if (productId !== undefined) {
      this.productService.incrementViews(productId).subscribe({
        next: (updatedProduct) => {
          console.log(`Views incremented for product ${productId}: ${updatedProduct.views}`);
          // Update the local products array with the new views count
          const index = this.products.findIndex((p) => p.idProduct === productId);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          // Update most viewed product if necessary
          if (!this.mostViewedProduct || updatedProduct.views! > (this.mostViewedProduct.views || 0)) {
            this.mostViewedProduct = updatedProduct;
          }
          this.router.navigate(['/product', productId]);
        },
        error: (err) => {
          console.error('Error incrementing views:', err);
          this.router.navigate(['/product', productId]); // Navigate even if increment fails
        },
      });
    }
  }

  isTrendingProduct(product: Product): boolean {
    return product.idProduct === this.mostViewedProduct?.idProduct;
  }
}