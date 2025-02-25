import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-header-front',
  
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent {
  isAuthenticated = false;
  user: any;

  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
      if (status) {
        this.user = this.authService.getUser();
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
