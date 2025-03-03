import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-admin.component.html',
  styleUrls: ['./feedback-admin.component.scss'],
})
export class FeedbackAdminComponent implements OnInit {
  feedbacks: any[] = [];
  errorMessage = '';

  constructor(public feedbackService: FeedbackService) {}

  ngOnInit() {
    this.loadFeedback();
  }

  loadFeedback() {
    this.feedbackService.getAllFeedback().subscribe({
      next: (data) => {
        console.log('Received feedback data:', data);
        // Log each feedback item to debug image field names
        data.forEach((item: any, index: number) => {
          console.log(`Feedback ${index}:`, item);
          console.log(`Image field available:`, 
            Object.keys(item).filter(key => 
              key.includes('image') || key.includes('img') || key.includes('file')
            )
          );
        });
        this.feedbacks = data;
      },
      error: (error) => {
        console.error('Error loading feedback:', error);
        this.errorMessage = 'Error loading feedback.';
      },
    });
  }

  deleteFeedback(id: string): void {
    const feedbackId = Number(id);
    if (isNaN(feedbackId)) {
      console.error('Invalid ID:', id);
      return;
    }
 
    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: () => {
        this.feedbacks = this.feedbacks.filter(f => f.id !== feedbackId);
      },
      error: (error) => {
        console.error('', error);
        this.errorMessage = '';
      },
    });
  }

  // Helper method to check if image exists
  hasImage(feedback: any): boolean {
    // Check all possible image field names
    return !!(feedback.image_url || feedback.imageUrl || feedback.image || 
             feedback.img || feedback.imgUrl || feedback.file_name);
  }

  // Get the appropriate image field from feedback
  getImageField(feedback: any): string {
    // Try all possible field names
    return feedback.image_url || feedback.imageUrl || feedback.image || 
           feedback.img || feedback.imgUrl || feedback.file_name || '';
  }
}