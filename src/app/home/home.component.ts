import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductComponent } from '../product/product.component';
import { FooterComponent } from '../footer/footer.component';
import { BlogComponent } from '../blog/blog.component';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
 // standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NavbarComponent, ProductComponent,FooterComponent,BlogComponent,FeedbackComponent] // Import used components
})
export class HomeComponent {

}
