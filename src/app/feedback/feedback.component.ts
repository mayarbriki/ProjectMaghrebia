import { Component } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  content = '';
  rating = 5;
  imageFile?: File;
  successMessage = '';
  errorMessage = '';

  constructor(private feedbackService: FeedbackService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imageFile = input.files[0];
    }
  }

  submitFeedback() {
    this.feedbackService.addFeedback(this.content, this.rating, this.imageFile).subscribe({
      next: (response) => {
        this.successMessage = 'Feedback submitted successfully!';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error submitting feedback.';
        this.successMessage = '';
      },
    });
  }
}
