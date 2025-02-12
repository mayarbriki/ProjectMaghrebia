import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  imagePath: SafeResourceUrl;
  handleImgError(event: any) {
    console.error('Image failed to load:', event);
  }
  constructor(private sanitizer: DomSanitizer) {
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/img/illustrations/393shots_so-removebg-preview.png");
  }
}
