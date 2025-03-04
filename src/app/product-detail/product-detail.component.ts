import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../product.service'; // Ensure Product interface is imported
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from '../front-office/header-front/header-front.component';
import { RouterModule } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, RouterModule, FeedbackComponent],
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null; // Use Product type instead of any
  safeImageUrl: string = '';
  selectedPlan: { name: string; amount: number; duration: number } | null = null; // Track selected plan

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(productId)) {
      this.productService.getProductById(productId).subscribe({
        next: (data: Product) => {
          this.product = data;
          if (this.product?.fileName) {
            this.safeImageUrl = this.product.fileName;
          }
          // Optionally pre-select the first plan
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

  selectPaymentPlan(plan: { name: string; amount: number; duration: number }): void {
    this.selectedPlan = plan; // Set the clicked plan as selected
  }

  openFeedbackModal(product: Product): void {
    this.dialog.open(FeedbackComponent, {
      width: '400px',
      data: { product }
    });
  }
}