import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  constructor(private router: Router) {} // Inject Router

  // Method to navigate to /app-blog-detail
  navigateToBlogDetail() {
    this.router.navigate(['/app-blog-detail']);
  }

}
