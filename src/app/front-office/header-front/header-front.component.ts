import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from 'src/app/auth.service';
import { SuggestionService } from 'src/app/suggestion.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookmarkComponent } from 'src/app/bookmark/bookmark.component';

@Component({
  selector: 'app-header-front',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule , BookmarkComponent, RouterModule],
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
// In HeaderFrontComponent
user: User | null = null;
  suggestionCount = 0;
  suggestions: any[] = [];
  private authSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private suggestionService: SuggestionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to authentication state
    this.authSubscription = this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
      if (status) {
        this.loadSuggestions();
      } else {
        this.user = null;
        this.suggestionCount = 0;
        this.suggestions = [];
        this.suggestionService.clearSuggestions();
      }
    });

    // Subscribe to user updates
    this.userSubscription = this.authService.user$.subscribe({
      next: (user) => {
        this.user = user;
        if (user?.id) {
          // Refresh balance when user data changes
          this.authService.fetchUserBalance(user.id).subscribe({
            next: (balance) => {
              this.user = { ...this.user!, accountBalance: balance };
            },
            error: (error) => console.error('Error fetching balance:', error)
          });
        }
      },
      error: (error) => console.error('[HeaderFront] User subscription error:', error)
    });
    

    // Subscribe to suggestion updates
    this.suggestionService.suggestionsCount$.subscribe(count => {
      console.log('Suggestion count updated:', count);
      this.suggestionCount = count;
    });

    this.suggestionService.suggestions$.subscribe(suggestions => {
      console.log('Suggestions updated in component:', suggestions);
      this.suggestions = suggestions;
    });
  }
  goToFeedbacks() {
    this.router.navigate(['/app-feedback-display']);
    this.closeDropdown();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadSuggestions() {
    this.suggestionService.fetchSuggestions().subscribe({
      next: (suggestions) => console.log('Suggestions loaded:', suggestions),
      error: (err) => console.error('Failed to load suggestions:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  navigateToBookmarks(): void {
    this.router.navigate(['/app-bookmark']);
  }
  closeDropdown() {
    // Close the dropdown menu (if necessary)
    const dropdown = document.querySelector('.dropdown-menu') as HTMLElement;
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }
  
}