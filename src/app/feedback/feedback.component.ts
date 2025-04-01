// feedback.component.ts
import { Component } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  content = '';
  rating = 5;
  imageFile?: File;
  successMessage = '';
  errorMessage = '';
  userId: number | null = null;

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe(user => {
      this.userId = user?.id || null;
      console.log('User ID from AuthService:', this.userId); // Log the userId
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imageFile = input.files[0];
    }
  }

  submitFeedback() {
    if (!this.userId) {
      this.errorMessage = 'Please log in to submit feedback';
      console.log('No userId available'); // Log if userId is missing
      return;
    }

    if (!this.content || this.rating < 1 || this.rating > 5) {
      this.errorMessage = 'Please provide valid content and a rating between 1 and 5';
      return;
    }

    console.log('Submitting feedback with:', { content: this.content, rating: this.rating, userId: this.userId, image: this.imageFile });

    this.feedbackService.addFeedback(this.content, this.rating, this.userId, this.imageFile).subscribe({
      next: (response) => {
        console.log('Feedback submitted:', response);
        this.successMessage = 'Feedback added successfully!';
        this.errorMessage = '';
        this.content = '';
        this.rating = 5;
        this.imageFile = undefined;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        this.errorMessage = 'Error submitting feedback: ' + (error.message || 'Unknown error');
        this.successMessage = '';
      }
    });
  }
}