import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8082/feedback'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  addFeedback(content: string, rating: number, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('rating', rating.toString());
    if (image) {
      formData.append('image', image);
    }

    return this.http.post(`${this.baseUrl}/add`, formData);
  }
}
