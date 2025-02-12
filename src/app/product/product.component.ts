import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  constructor(private router: Router) {}

  navigateToProductDetail() {
    this.router.navigate(['/product-detail']);
  }
}
