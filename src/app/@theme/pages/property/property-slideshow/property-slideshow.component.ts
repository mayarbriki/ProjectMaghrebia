import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PropertyService } from 'src/app/property.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-slideshow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Display current image using the generated URL -->
      <img 
        *ngIf="images && images.length" 
        [src]="getImageUrl(images[currentIndex])" 
        class="w-full h-64 object-cover rounded-t-lg" 
        alt="Property image">
      
      <!-- Navigation buttons if there's more than one image -->
      <div *ngIf="images && images.length > 1">
        <button 
          (click)="prevImage()" 
          class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 cursor-pointer">
          ‹
        </button>
        <button 
          (click)="nextImage()" 
          class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 cursor-pointer">
          ›
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class PropertySlideshowComponent implements OnChanges {
  // Input array of images from the backend.
  @Input() images: any[] = [];
  currentIndex = 0;
  
  constructor(private propertyService: PropertyService) {
    console.log('PropertySlideshowComponent instantiated');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.currentIndex = 0;
      console.log('Images changed to:', this.images);
    }
  }
  
  getImageUrl(image: any): string {
    // Use the service method to generate the full URL
    const url = this.propertyService.getImageUrl(image);
    console.log('Final image URL:', url);
    return url;
  }
  
  prevImage(): void {
    if (this.images.length) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }
  
  nextImage(): void {
    if (this.images.length) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }
}
