import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from '../front-office/header-front/header-front.component';
import { RouterModule } from '@angular/router'; // Import this
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, RouterModule, FeedbackComponent ],  // �� Import RouterModule
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  safeImageUrl: string = '';

  constructor(private route: ActivatedRoute, private productService: ProductService , private dialog :MatDialog) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));  // 🔹 Convert ID to number
    if (!isNaN(productId)) {
      this.productService.getProductById(productId).subscribe((data: any) => {
        this.product = data;
        if (this.product?.fileName) {
          this.safeImageUrl = this.product.fileName;
        }
      });
    } else {
      console.error("Invalid Product ID");
    }
  }
  openFeedbackModal(product: any) {
    this.dialog.open(FeedbackComponent, {
      width: '400px',
      data: { product }
    });
  }
  
}
