import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Interface for Feedback data
interface Feedback {
  id: number;
  content: string;
  rating: number;
  imageUrl?: string;
  fullImageUrl?: string;
  // Add any other properties your feedback objects have
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8082/feedback'; // Update with your backend URL
  private staticBaseUrl = 'http://localhost:8082/upload-dir/'; // Match your Spring static resources URL

  constructor(private http: HttpClient) {}

  addFeedback(content: string, rating: number, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('rating', rating.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post(`${this.baseUrl}/add`, formData);
  }

  getAllFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}/all`).pipe(
      map((feedbacks: Feedback[]) => {
        // Transform the imageUrl to use the direct static resource path
        return feedbacks.map(feedback => {
          if (feedback.imageUrl && !feedback.imageUrl.startsWith('http')) {
            feedback.fullImageUrl = this.staticBaseUrl + feedback.imageUrl;
          } else {
            feedback.fullImageUrl = feedback.imageUrl;
          }
          return feedback;
        });
      })
    );
  }

  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  // This method is no longer needed if your backend returns full URLs
  // but kept for backward compatibility
  getImageUrl(fileName: string): string {
    if (!fileName) return '';
    
    // If it's already a full URL, return it as is
    if (fileName.startsWith('http')) {
      return fileName;
    }
    
    // Otherwise, construct the full URL
    return this.staticBaseUrl + fileName;
  }
}