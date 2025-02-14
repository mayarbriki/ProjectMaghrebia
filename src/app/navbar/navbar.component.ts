import { CommonModule } from '@angular/common';
import { Component , HostListener} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule ,RouterModule] // Ensure RouterModule is imported
})
export class NavbarComponent {

  currentPage: string = 'index'; // Example value, update as needed
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
}}
