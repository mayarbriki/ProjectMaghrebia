import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-display.component.html',
  styleUrl: './product-display.component.scss'
})
export class ProductDisplayComponent implements OnInit {
  products: Product[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 3; // Show 3 items at a time
  transitionInProgress: boolean = false;
  translateX: number = 0;
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }
  
  prevSlide() {
    if (!this.transitionInProgress) {
      this.transitionInProgress = true;
      
      if (this.currentIndex === 0) {
        // Loop to the end
        this.currentIndex = Math.max(0, this.products.length - this.itemsPerPage);
      } else {
        this.currentIndex--;
      }
      
      // Calculate the translation
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
        // Loop to the beginning
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      
      // Calculate the translation
      this.updateTranslation();
      
      setTimeout(() => {
        this.transitionInProgress = false;
      }, 500); // Match transition time in CSS
    }
  }
  
  updateTranslation(): void {
    // Each card is 200px wide + 20px gap = 220px per item
    const itemWidth = 220;
    this.translateX = -(this.currentIndex * itemWidth);
  }
  
  getItemWidth(index: number): string {
    // Apply the width to each product
    return index < this.products.length ? '220px' : '0';
  }

  isCurrentlyVisible(index: number): boolean {
    return index >= this.currentIndex && index < this.currentIndex + this.itemsPerPage;
  }
}