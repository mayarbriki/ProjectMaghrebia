// feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { tap } from 'rxjs/operators';

// Interface for Feedback data
interface Feedback {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  imageUrl?: string;
  fullImageUrl?: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8083/feedback'; // Corrected port to match backend
  private staticBaseUrl = 'http://localhost:8083/feedback/uploads/'; // Corrected port and path

  constructor(private http: HttpClient) {}
  updateFeedback(id: number, content: string, rating: number, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('rating', rating.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    console.log('FeedbackService - Update FormData entries:');
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value);
    }

    return this.http.put(`${this.baseUrl}/update/${id}`, formData).pipe(
      tap(response => console.log('FeedbackService - Update response from server:', response))
    );
  }

  addFeedback(content: string, rating: number, userId: number, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('rating', rating.toString());
    formData.append('userId', userId.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Log FormData entries for debugging
    console.log('FeedbackService - FormData entries:');
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value);
    }

    return this.http.post(`${this.baseUrl}/add`, formData).pipe(
      tap(response => console.log('FeedbackService - Response from server:', response))
    );
  }

  getAllFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}/all`).pipe(
      map((feedbacks: Feedback[]) => {
        return feedbacks.map(feedback => {
          if (feedback.imageUrl) {
            feedback.fullImageUrl = feedback.imageUrl.startsWith('http')
              ? feedback.imageUrl
              : `${this.staticBaseUrl}${feedback.imageUrl}`;
          }
          return feedback;
        });
      })
    );
  }

  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  getImageUrl(fileName: string): string {
    if (!fileName) return '';
    if (fileName.startsWith('http')) {
      return fileName;
    }
    return this.staticBaseUrl + fileName;
  }
}