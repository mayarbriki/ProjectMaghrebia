import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../product.service';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from '../front-office/header-front/header-front.component';
import { RouterModule } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, RouterModule, FeedbackComponent, FormsModule],
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  safeImageUrl: string = '';
  selectedPlan: { name: string; amount: number; duration: number } | null = null;
  currentUser: { id: number; username: string; email: string; accountBalance?: number } | null = null;
  recipientEmail: string = '';
  shareMessage: string = '';
  isSharing: boolean = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Subscribe to authentication state
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        const user = this.authService.getUser();
        if (user && user.id) {
          this.currentUser = user;
          this.shareMessage = '';
        }
      } else {
        this.currentUser = null;
        this.shareMessage = 'Please log in to share products.';
      }
    });

    // Fetch the product
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(productId)) {
      this.productService.getProductById(productId).subscribe({
        next: (data: Product) => {
          this.product = data;
          if (this.product?.fileName) {
            this.safeImageUrl = this.product.fileName;
          }
          if (this.product?.paymentPlans && this.product.paymentPlans.length > 0) {
            this.selectedPlan = this.product.paymentPlans[0];
          }
        },
        error: (err) => console.error('Error fetching product:', err)
      });
    } else {
      console.error("Invalid Product ID");
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  selectPaymentPlan(plan: { name: string; amount: number; duration: number }): void {
    this.selectedPlan = plan;
  }

  openFeedbackModal(product: Product): void {
    this.dialog.open(FeedbackComponent, {
      width: '400px',
      data: { product }
    });
  }

  shareProduct(): void {
    if (!this.currentUser) {
      this.shareMessage = 'Please log in to share this product.';
      return;
    }
    if (!this.product) {
      this.shareMessage = 'Product not loaded. Please try again.';
      return;
    }
    if (!this.recipientEmail) {
      this.shareMessage = 'Please enter a recipient email.';
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.recipientEmail)) {
      this.shareMessage = 'Please enter a valid email address.';
      return;
    }
  
    this.isSharing = true;
    this.shareMessage = '';
  
    const shareData = {
      productName: this.product.name,
      productDescription: this.product.description,
      recipientEmail: this.recipientEmail
    };
  
    this.authService.shareProduct(this.currentUser.id, shareData).subscribe({
      next: (response) => {
        this.shareMessage = response;
        this.recipientEmail = '';
        // Refresh currentUser to reflect the updated balance
        const user = this.authService.getUser();
        if (user && user.id) {
          this.currentUser = user;
        }
        this.isSharing = false;
      },
      error: (error) => {
        this.shareMessage = error.message || 'Failed to share product. Please try again.';
        this.isSharing = false;
      }
    });
  }
}