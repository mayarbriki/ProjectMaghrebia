import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  template: `
    <!-- Conditionally show Navbar based on route -->
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <router-outlet></router-outlet>
  `,
  imports: [RouterOutlet, NavbarComponent],  // Add RouterOutlet to imports
  styleUrls: ['./app.component.css'],
  standalone: true,
})

export class AppComponent implements OnInit {
  isProductPage: boolean = true;  // Default to show the product page
  showNavbar: boolean = true;     // Control the visibility of the navbar
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Listen for route changes to conditionally show navbar and set page type
    this.router.events.subscribe(() => {
      // Hide the navbar on specific routes (e.g., product detail page)
      if (this.router.url === '/product-detail') {
        this.isProductPage = false;
        this.showNavbar = false;  // Hide navbar on product-detail page
      } else {
        this.isProductPage = true;
        this.showNavbar = true;   // Show navbar on other pages
      }
    });

    // Hide loading spinner once app is initialized
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }

  title = 'FrontOfficeMaghrebia';

  navigateToProductDetail() {
    this.router.navigate(['/product-detail']);
  }
}
