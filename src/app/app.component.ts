import { Component , OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isProductPage: boolean = true;  // Default to show the product page
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check the route to conditionally show the product or other components
    this.router.events.subscribe(() => {
      if (this.router.url === '/product') {
        this.isProductPage = true;
      } else if (this.router.url === '/product-detail') {
        this.isProductPage = false;
      }
    });
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }
  
  title = 'FrontOfficeMaghrebia';
  showNavbar: boolean = true; // Set this based on your logic

  navigateToProductDetail() {
    this.router.navigate(['/product-detail']);
  }
}
