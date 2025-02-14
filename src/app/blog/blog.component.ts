import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Import Router
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  standalone: true,
  selector: 'app-blog',
  imports:[NavbarComponent,RouterModule],
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
