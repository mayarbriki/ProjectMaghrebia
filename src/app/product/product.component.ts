import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  constructor(private router: Router) {}

  // Method to navigate to product details
  navigateToProductDetail(type: string) {
    this.router.navigate(['/product-detail', type]);
  }
}
