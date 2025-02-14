import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
  standalone: true,
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [RouterModule, ProductDetailComponent]
})
export class ProductComponent {
  constructor(private router: Router) {}

  navigateToProductDetail() {
    this.router.navigate(['/product-detail']);
  }
}
